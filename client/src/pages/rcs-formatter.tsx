import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-formatter/image-uploader";
import { FormatOptions } from "@/components/image-formatter/format-options";
import { EnhancedPreviewContainer } from "@/components/image-formatter/enhanced-preview-container";
import { Action, Customer, Campaign, RcsFormat } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, RotateCcw, Save, CalendarIcon } from "lucide-react";
import { processImages } from "@/lib/image-processing";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "wouter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function RcsFormatter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const campaignId = params?.campaignId;
  
  // State for form fields
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formatType, setFormatType] = useState<"richCard" | "carousel">("richCard");
  const [cardOrientation, setCardOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [mediaHeight, setMediaHeight] = useState<"short" | "medium" | "tall">("medium");
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(false);
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>("");
  const [verificationSymbol, setVerificationSymbol] = useState<boolean>(true); // Always enabled
  const [actions, setActions] = useState<Action[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState<string>("android");
  const [exporting, setExporting] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  
  // Fetch campaign data if we're in edit mode
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: ["/api/campaigns", campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
    enabled: !!campaignId,
  });
  
  // Fetch campaign formats if we're in edit mode
  const { data: campaignFormats = [], isLoading: isLoadingFormats } = useQuery<RcsFormat[]>({
    queryKey: ["/api/campaign", campaignId, "formats"],
    queryFn: async () => {
      const res = await fetch(`/api/campaign/${campaignId}/formats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign formats");
      return res.json();
    },
    enabled: !!campaignId,
  });
  
  // Fetch customers data
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return []; // Return empty array on unauthorized
        }
        
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        
        return await res.json();
      } catch (error) {
        console.error("Error fetching customers:", error);
        return []; // Return empty array on any error
      }
    },
  });
  
  // Set brand logo URL from selected brand
  useEffect(() => {
    if (selectedCustomerId && customers) {
      const brand = customers.find(c => c.id.toString() === selectedCustomerId);
      if (brand && brand.brandLogoUrl) {
        // Update the brand logo URL - making sure it's properly prefixed for server-stored images
        const logoUrl = brand.brandLogoUrl.startsWith('/') 
          ? `http://localhost:5000${brand.brandLogoUrl}` 
          : brand.brandLogoUrl;
        
        setBrandLogoUrl(logoUrl);
        
        // The brandName is handled directly in the PreviewContainer with a lookup
        // No need to set a separate state variable for it
      }
    }
  }, [selectedCustomerId, customers]);
  
  // Load campaign data when in edit mode
  useEffect(() => {
    if (campaign && campaignFormats?.length > 0) {
      // We have campaign data and at least one format, use the first format to populate the form
      const format = campaignFormats[0];
      
      // Set campaign name
      setCampaignName(campaign.name);
      
      // Set form fields from format
      if (format.title) setTitle(format.title);
      if (format.description) setDescription(format.description);
      if (format.formatType) setFormatType(format.formatType as "richCard" | "carousel");
      if (format.cardOrientation) setCardOrientation(format.cardOrientation as "vertical" | "horizontal");
      if (format.mediaHeight) setMediaHeight(format.mediaHeight as "short" | "medium" | "tall");
      if (format.lockAspectRatio !== null) setLockAspectRatio(!!format.lockAspectRatio);
      if (format.verificationSymbol !== null) setVerificationSymbol(!!format.verificationSymbol);
      
      // Set selected customer ID if available
      if (campaign.customerId) {
        setSelectedCustomerId(campaign.customerId.toString());
      }
      
      // Set actions if available
      if (format.actions) {
        try {
          const parsedActions = Array.isArray(format.actions) 
            ? format.actions 
            : (typeof format.actions === 'string' ? JSON.parse(format.actions) : []);
          setActions(parsedActions);
        } catch (e) {
          console.error("Error parsing actions:", e);
        }
      }
      
      // Handle brand logo URL
      if (format.brandLogoUrl) {
        const logoUrl = format.brandLogoUrl.startsWith('/') 
          ? `http://localhost:5000${format.brandLogoUrl}` 
          : format.brandLogoUrl;
        setBrandLogoUrl(logoUrl);
      }
      
      // Set campaign activation settings
      if (campaign.isActive) {
        setIsActiveCampaign(true);
        
        // Set target phone numbers if available
        if (campaign.targetPhoneNumbers) {
          try {
            const phoneNumbers = Array.isArray(campaign.targetPhoneNumbers) 
              ? campaign.targetPhoneNumbers
              : (typeof campaign.targetPhoneNumbers === 'string' ? JSON.parse(campaign.targetPhoneNumbers) : []);
              
            setTargetPhoneNumbers(phoneNumbers.join(', '));
          } catch (e) {
            console.error("Error parsing target phone numbers:", e);
          }
        }
        
        // Set scheduled date if available
        if (campaign.scheduledDate) {
          setScheduledDate(new Date(campaign.scheduledDate));
        }
      }
      
      // Fetch images from imageUrls if available - this is a bit tricky since we need to load files
      // Could add image preview from saved URLs as a future enhancement
      
      // Set page title to indicate edit mode
      document.title = `Edit Campaign: ${campaign.name}`;
    }
  }, [campaign, campaignFormats]);

  // Process images temporarily for preview
  const processedImageUrls = selectedImages.map(file => URL.createObjectURL(file));

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Save RCS format mutation
  const saveFormatMutation = useMutation({
    mutationFn: async (campaignFormatData = {}) => {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append each image
      selectedImages.forEach((file, index) => {
        formData.append('images', file);
      });
      
      // Find selected brand information
      const selectedBrand = customers?.find(c => c.id.toString() === selectedCustomerId);
      
      // Handle brand logo - if it's a blob URL, we need to upload it with the images
      let finalBrandLogoUrl = brandLogoUrl;
      if (brandLogoUrl && brandLogoUrl.startsWith('blob:')) {
        // For blob URLs, we need to retrieve the actual file from the browser
        try {
          const response = await fetch(brandLogoUrl);
          const blob = await response.blob();
          const brandLogoFile = new File([blob], 'brand_logo.jpg', { type: blob.type });
          formData.append('brandLogo', brandLogoFile);
          finalBrandLogoUrl = 'PENDING_UPLOAD'; // Will be replaced by the server
        } catch (error) {
          console.error('Error retrieving brand logo blob:', error);
          // Fall back to the actual URL or empty string
          finalBrandLogoUrl = selectedBrand?.brandLogoUrl || '';
        }
      } else if (selectedBrand?.brandLogoUrl && !brandLogoUrl) {
        // If no logo is set but the brand has one, use the brand's logo
        finalBrandLogoUrl = selectedBrand.brandLogoUrl;
      }
      
      // In case we have issues with file upload, also include the processedImageUrls as a backup
      const newFormatData = {
        formatType,
        cardOrientation,
        mediaHeight,
        lockAspectRatio,
        brandLogoUrl: finalBrandLogoUrl,
        verificationSymbol,
        title,
        description,
        actions,
        customerId: selectedCustomerId || null,
        campaignId: campaignId ? parseInt(campaignId) : null, // Use the campaign ID from the URL if available
        brandName: selectedBrand?.name || "Business Name", // Store brand name
        campaignName: campaignName || title || "Untitled Campaign", // Use campaign name from dialog
        processedImageUrls, // Include the already processed image URLs as backup
        imageUrls: processedImageUrls, // Also include directly to help with validation requirements
        // Add campaign activation data if provided
        ...campaignFormatData
      };
      
      // Update the formatData state
      setFormatData(newFormatData);
      
      formData.append('formatData', JSON.stringify(newFormatData));
      
      // Log the data being sent to help with debugging
      console.log("Saving RCS format with data:", newFormatData);
      
      // Make API request
      const res = await fetch('/api/rcs-formats', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorText = errorData ? JSON.stringify(errorData) : await res.text();
        throw new Error(errorText || res.statusText);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: campaignId ? "Format updated successfully" : "Format saved successfully",
        description: campaignId 
          ? "Your RCS format has been updated."
          : "Your RCS format has been saved.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/rcs-formats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      
      // If we're editing a campaign, also invalidate the campaign formats query
      if (campaignId) {
        queryClient.invalidateQueries({ queryKey: ["/api/campaign", campaignId, "formats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save format",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Export format
  const handleExport = async (exportType: 'json' | 'image' | 'both' = 'json') => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setExporting(true);
      
      // Get the active platform from the current tab
      const activePlatform = activePreviewTab as 'android' | 'ios';
      
      // Find selected brand information
      const selectedBrand = customers?.find(c => c.id.toString() === selectedCustomerId);
      
      // Process and export the images
      await processImages(
        selectedImages, 
        {
          title,
          description,
          actions,
          formatType,
          cardOrientation,
          mediaHeight,
          lockAspectRatio,
          brandLogoUrl,
          verificationSymbol,
          brandName: selectedBrand?.name || "Business Name", // Include brand name
          campaignName: campaignName || title || "Untitled Campaign" // Include campaign name
        },
        exportType,
        activePlatform
      );
      
      const exportTypeText = 
        exportType === 'json' ? 'JSON configuration' : 
        exportType === 'image' ? 'preview image' : 
        'JSON configuration and preview image';
      
      toast({
        title: "Export successful",
        description: `Your RCS format has been exported as ${exportTypeText}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedImages([]);
    setTitle("");
    setDescription("");
    setFormatType("richCard");
    setCardOrientation("vertical");
    setMediaHeight("medium");
    setLockAspectRatio(false);
    setBrandLogoUrl("");
    setVerificationSymbol(true);
    setActions([]);
    setSelectedCustomerId("");
    
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

  // State for campaign dialog
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [isActiveCampaign, setIsActiveCampaign] = useState(false);
  const [targetPhoneNumbers, setTargetPhoneNumbers] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  
  // Handle save
  const handleSave = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image.",
        variant: "destructive",
      });
      return;
    }
    
    // If we're in edit mode and already have a campaign name, use it
    if (campaignId && campaign?.name) {
      // Skip dialog and save directly using existing campaign name
      saveFormatMutation.mutate();
    } else {
      // Open dialog to ask for campaign name
      setCampaignName(title || ""); // Pre-fill with title
      setIsCampaignDialogOpen(true);
    }
  };
  
  // Create a shared formatData state to use in save and campaign confirmation
  const [formatData, setFormatData] = useState<any>({});
  
  // Handle campaign name confirmation
  const handleCampaignNameConfirm = () => {
    setIsCampaignDialogOpen(false);
    
    // Create a copy of the current formatData
    const updatedFormatData = {...formatData};
    
    // Update format data with campaign activation settings
    if (isActiveCampaign) {
      updatedFormatData.isActive = true;
      updatedFormatData.targetPhoneNumbers = targetPhoneNumbers.split(',').map(num => num.trim());
      
      if (scheduledDate) {
        updatedFormatData.scheduledDate = scheduledDate;
        updatedFormatData.status = "scheduled";
      } else {
        updatedFormatData.status = "active";
        updatedFormatData.activatedAt = new Date();
      }
    }
    
    // Update the formatData state
    setFormatData(updatedFormatData);
    
    // Call the save mutation
    saveFormatMutation.mutate(updatedFormatData);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page Title */}
              <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  {campaignId 
                    ? `Edit Campaign: ${campaign?.name || "Loading..."}`
                    : "RCS Message Format"
                  }
                </h1>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handleReset}
                    disabled={saveFormatMutation.isPending}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handleSave}
                    disabled={saveFormatMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Format
                  </Button>
                  <div className="relative inline-block">
                    <Button 
                      onClick={() => handleExport('json')}
                      disabled={saveFormatMutation.isPending || exporting}
                      className="mr-2"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export JSON
                    </Button>
                    <Button 
                      onClick={() => handleExport('image')}
                      disabled={saveFormatMutation.isPending || exporting}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload and Format Selection */}
                <Card className="lg:col-span-1">
                  <CardContent className="p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Brand & Images</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Brand
                      </label>
                      <Select 
                        value={selectedCustomerId} 
                        onValueChange={(value) => {
                          setSelectedCustomerId(value);
                          // Automatically set the brand logo URL when a brand is selected
                          const selectedBrand = customers?.find(c => c.id.toString() === value);
                          if (selectedBrand?.brandLogoUrl) {
                            // Make sure to properly format the URL for server-stored images
                            const logoUrl = selectedBrand.brandLogoUrl.startsWith('/') 
                              ? `http://localhost:5000${selectedBrand.brandLogoUrl}` 
                              : selectedBrand.brandLogoUrl;
                            
                            setBrandLogoUrl(logoUrl);
                            console.log("Set brand logo URL to:", logoUrl);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCustomers ? (
                            <div className="p-2 text-center text-sm text-gray-500">Loading brands...</div>
                          ) : customers?.length ? (
                            customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id.toString()}>
                                <div className="flex items-center">
                                  {customer.brandLogoUrl && (
                                    <div className="w-5 h-5 mr-2">
                                      <img 
                                        src={customer.brandLogoUrl && customer.brandLogoUrl.startsWith('/') 
                                          ? `http://localhost:5000${customer.brandLogoUrl}` 
                                          : customer.brandLogoUrl} 
                                        alt="" 
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                  {customer.name}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center text-sm text-gray-500">No brands available</div>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-gray-500">
                        Brand logo will be displayed in the RCS message header
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Images
                      </label>
                      <ImageUploader 
                        onImagesSelected={setSelectedImages} 
                        maxImages={formatType === "carousel" ? 10 : 1}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <FormatOptions 
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        formatType={formatType}
                        setFormatType={setFormatType}
                        cardOrientation={cardOrientation}
                        setCardOrientation={setCardOrientation}
                        mediaHeight={mediaHeight}
                        setMediaHeight={setMediaHeight}
                        lockAspectRatio={lockAspectRatio}
                        setLockAspectRatio={setLockAspectRatio}
                        brandLogoUrl={brandLogoUrl}
                        setBrandLogoUrl={setBrandLogoUrl}
                        verificationSymbol={verificationSymbol}
                        setVerificationSymbol={setVerificationSymbol}
                        actions={actions}
                        setActions={setActions}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Previews */}
                <div className="lg:col-span-2">
                  <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="android">Android Preview</TabsTrigger>
                      <TabsTrigger value="ios">iOS Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="android">
                      <EnhancedPreviewContainer
                        platform="android"
                        title={title}
                        description={description}
                        imageUrls={processedImageUrls}
                        actions={actions}
                        formatType={formatType}
                        cardOrientation={cardOrientation}
                        mediaHeight={mediaHeight}
                        lockAspectRatio={lockAspectRatio}
                        brandLogoUrl={brandLogoUrl}
                        verificationSymbol={verificationSymbol}
                        brandName={customers?.find(c => c.id.toString() === selectedCustomerId)?.name || "Business Name"}
                      />
                    </TabsContent>
                    
                    <TabsContent value="ios">
                      <EnhancedPreviewContainer
                        platform="ios"
                        title={title}
                        description={description}
                        imageUrls={processedImageUrls}
                        actions={actions}
                        formatType={formatType}
                        cardOrientation={cardOrientation}
                        mediaHeight={mediaHeight}
                        lockAspectRatio={lockAspectRatio}
                        brandLogoUrl={brandLogoUrl}
                        verificationSymbol={verificationSymbol}
                        brandName={customers?.find(c => c.id.toString() === selectedCustomerId)?.name || "Business Name"}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p className="mb-2"><strong>RCS Format Requirements:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Rich Cards: Single image with vertical or horizontal layout</li>
                      <li>Carousels: Up to 10 images with shared title and actions</li>
                      <li>Title: Maximum 200 characters</li>
                      <li>Description: Maximum 2000 characters (iOS may truncate to ~144 chars)</li>
                      <li>Media Height: Short (112 DP), Medium (168 DP), Tall (264 DP)</li>
                      <li>Image Requirements: Max 1500x1000 pixels, under 1.8MB, JPEG/PNG only</li>
                      <li>Actions: Maximum 4 actions (URL links, phone numbers, or calendar events)</li>
                      <li>iOS Compatibility: No GIF support, JPEG recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Campaign Name Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{campaignId ? "Update Campaign" : "Enter Campaign Name"}</DialogTitle>
            <DialogDescription>
              {campaignId 
                ? "Update the campaign information for this RCS format."
                : "Provide a name for your campaign. This will help you organize your RCS formats."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaign-name" className="text-right">
                Name
              </Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Active Campaign
              </Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active-campaign" 
                    checked={isActiveCampaign}
                    onCheckedChange={(checked) => {
                      setIsActiveCampaign(checked === true);
                    }}
                  />
                  <Label htmlFor="active-campaign" className="font-normal">
                    Activate this campaign for RCS messaging
                  </Label>
                </div>
              </div>
            </div>
            
            {isActiveCampaign && (
              <>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="target-numbers" className="text-right pt-2">
                    Target Numbers
                  </Label>
                  <Textarea
                    id="target-numbers"
                    value={targetPhoneNumbers}
                    onChange={(e) => setTargetPhoneNumbers(e.target.value)}
                    placeholder="Enter phone numbers separated by commas"
                    className="col-span-3 h-24"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="scheduled-date" className="text-right">
                    Schedule Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleCampaignNameConfirm}
              disabled={!campaignName.trim()}
            >
              {campaignId ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}