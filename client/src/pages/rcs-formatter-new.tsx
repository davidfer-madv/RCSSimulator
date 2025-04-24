import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { useRcsFormatter } from "@/context/rcs-formatter-context";
import { Loader2 } from "lucide-react";
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
import { processImages, ProcessingStage, ProcessingEventHandler } from "@/lib/image-processing";
import { ImageProcessingLoader } from "@/components/image-formatter/image-processing-loader";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function RcsFormatter() {
  // Auth states must be declared first
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const campaignId = params.campaignId;
  const { toast } = useToast();
  const { state, updateState, resetState } = useRcsFormatter();
  
  // Local state variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>(state.selectedImages || []);
  const [title, setTitle] = useState(state.title || "");
  const [description, setDescription] = useState(state.description || "");
  const [formatType, setFormatType] = useState<"richCard" | "carousel">(state.formatType || "richCard");
  const [cardOrientation, setCardOrientation] = useState<"vertical" | "horizontal">(state.cardOrientation || "vertical");
  const [mediaHeight, setMediaHeight] = useState<"short" | "medium" | "tall">(state.mediaHeight || "medium");
  const [lockAspectRatio, setLockAspectRatio] = useState(state.lockAspectRatio || false);
  const [brandLogoUrl, setBrandLogoUrl] = useState(state.brandLogoUrl || "");
  const [verificationSymbol, setVerificationSymbol] = useState(state.verificationSymbol !== undefined ? state.verificationSymbol : true);
  const [actions, setActions] = useState<Action[]>(state.actions || []);
  const [selectedCustomerId, setSelectedCustomerId] = useState(state.selectedCustomerId || "");
  const [activePreviewTab, setActivePreviewTab] = useState<string>("android");
  const [exporting, setExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage | undefined>(undefined);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [isActiveCampaign, setIsActiveCampaign] = useState(false);
  const [targetPhoneNumbers, setTargetPhoneNumbers] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [formatData, setFormatData] = useState<any>({});

  // API data fetching
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: ["/api/campaigns", campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
    enabled: !!campaignId && !!user,
  });
  
  const { data: campaignFormats = [], isLoading: isLoadingFormats } = useQuery<RcsFormat[]>({
    queryKey: ["/api/campaign", campaignId, "formats"],
    queryFn: async () => {
      const res = await fetch(`/api/campaign/${campaignId}/formats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign formats");
      return res.json();
    },
    enabled: !!campaignId && !!user,
  });
  
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
    enabled: !!user,
  });

  // Save RCS format mutation
  const saveFormatMutation = useMutation({
    mutationFn: async (campaignFormatData: Record<string, any> = {}) => {
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
        processedImageUrls: state.processedImageUrls, // Include the already processed image URLs as backup
        imageUrls: state.processedImageUrls, // Also include directly to help with validation requirements
        // Add campaign activation data if provided
        ...(campaignFormatData as object)
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

  // Helper functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effects
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);

  // Update context when local state changes
  useEffect(() => {
    // When updating images, also update the processed URLs
    const newProcessedUrls = selectedImages.map(file => URL.createObjectURL(file));
    updateState({ 
      selectedImages,
      processedImageUrls: newProcessedUrls,
      title,
      description,
      formatType,
      cardOrientation,
      mediaHeight,
      lockAspectRatio,
      brandLogoUrl,
      verificationSymbol,
      actions,
      selectedCustomerId
    });
  }, [
    selectedImages, 
    title, 
    description, 
    formatType, 
    cardOrientation, 
    mediaHeight, 
    lockAspectRatio, 
    brandLogoUrl, 
    verificationSymbol, 
    actions, 
    selectedCustomerId,
    updateState
  ]);

  // Add click outside handler for export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close export menu when clicking outside
      if (exportMenuOpen) {
        const target = event.target as HTMLElement;
        const exportButton = document.querySelector('[data-export-menu-button]');
        const exportMenu = document.querySelector('[data-export-menu]');
        
        if (!exportButton?.contains(target) && !exportMenu?.contains(target)) {
          setExportMenuOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportMenuOpen]);

  // Set brand logo URL from selected brand
  useEffect(() => {
    if (selectedCustomerId && customers) {
      const brand = customers.find(c => c.id.toString() === selectedCustomerId);
      if (brand && brand.brandLogoUrl) {
        try {
          // Update the brand logo URL - making sure it's properly prefixed for server-stored images
          let logoUrl = brand.brandLogoUrl;
          
          // Handle server-side stored images with absolute paths
          if (logoUrl.startsWith('/')) {
            logoUrl = `${window.location.origin}${logoUrl}`;
          }
          
          // Set the brand logo URL
          setBrandLogoUrl(logoUrl);
          console.log("Set brand logo URL from useEffect:", logoUrl);
        } catch (error) {
          console.error("Error loading brand logo from useEffect:", brand.brandLogoUrl);
        }
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
        try {
          // Make sure to properly format the URL for server-stored images
          let logoUrl = format.brandLogoUrl;
          
          // Handle server-side stored images with absolute paths
          if (logoUrl.startsWith('/')) {
            logoUrl = `${window.location.origin}${logoUrl}`;
          }
          
          // Set the brand logo URL
          setBrandLogoUrl(logoUrl);
          console.log("Set brand logo URL from campaign format:", logoUrl);
        } catch (error) {
          console.error("Error loading brand logo from campaign format:", format.brandLogoUrl);
        }
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
      
      // Set page title to indicate edit mode
      document.title = `Edit Campaign: ${campaign.name}`;
    }
  }, [campaign, campaignFormats]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Only render content if user is authenticated
  if (!user) return null;

  // Handle form submission
  const handleSaveRcsFormat = async () => {
    // Check if we have at least one image (required for RCS format)
    if (selectedImages.length === 0) {
      toast({
        title: "Missing images",
        description: "Please select at least one image for your RCS format.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if title is provided (required for RCS format)
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your RCS format.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the format
    saveFormatMutation.mutate();
  };

  // Handle image export
  const handleExportImages = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images to export",
        description: "Please select at least one image to export.",
        variant: "destructive",
      });
      return;
    }
    
    setExporting(true);
    setProcessingStage(ProcessingStage.PREPARING);
    setProcessingProgress(0);
    
    try {
      const handleProcessingProgress: ProcessingEventHandler = (stage, progress) => {
        setProcessingStage(stage);
        if (progress !== undefined) {
          setProcessingProgress(progress);
        }
      };
      
      const result = await processImages(
        selectedImages,
        {
          formatType,
          cardOrientation,
          mediaHeight,
          lockAspectRatio,
          title,
          description,
          brandLogoUrl,
          actions,
          verificationSymbol,
          brandName: customers?.find(c => c.id.toString() === selectedCustomerId)?.name,
        },
        'json',
        'android',
        handleProcessingProgress
      );
      
      // Success!
      toast({
        title: "Export successful",
        description: "Your images have been exported successfully.",
      });
      
      console.log("Export result:", result);
    } catch (error) {
      console.error("Error exporting images:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export images",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
      setProcessingStage(undefined);
      setProcessingProgress(0);
    }
  };

  // Reset form
  const handleResetForm = () => {
    resetState();
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
    setSelectedImages([]);
    
    toast({
      title: "Form reset",
      description: "The form has been reset to default values.",
    });
  };

  // Open campaign creation dialog
  const handleOpenCampaignDialog = () => {
    // Initialize the dialog with default values
    setCampaignName(title || "Untitled Campaign");
    setIsCampaignDialogOpen(true);
  };

  // Create a new campaign
  const handleCreateCampaign = async () => {
    // Validate campaign name
    if (!campaignName.trim()) {
      toast({
        title: "Missing campaign name",
        description: "Please provide a name for your campaign.",
        variant: "destructive",
      });
      return;
    }
    
    // Parse target phone numbers
    let phoneNumbers: string[] = [];
    if (targetPhoneNumbers.trim()) {
      phoneNumbers = targetPhoneNumbers
        .split(',')
        .map(num => num.trim())
        .filter(Boolean);
    }
    
    // Save format with campaign data
    saveFormatMutation.mutate({
      createCampaign: true,
      campaignName,
      isActive: isActiveCampaign,
      targetPhoneNumbers: phoneNumbers,
      scheduledDate: scheduledDate ? scheduledDate.toISOString() : null,
    });
    
    // Close the dialog
    setIsCampaignDialogOpen(false);
  };

  // Render the UI
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-semibold">
              {campaignId ? "Edit RCS Format" : "RCS Format Builder"}
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetForm}
                title="Reset form"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <div className="relative">
                <Button 
                  data-export-menu-button
                  variant="outline" 
                  size="sm" 
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  title="Export options"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {exportMenuOpen && (
                  <div 
                    data-export-menu
                    className="absolute right-0 mt-2 w-48 bg-background shadow-lg rounded-md border p-1 z-10"
                  >
                    <button
                      className="flex w-full items-center px-3 py-2 text-sm rounded-sm hover:bg-accent"
                      onClick={handleExportImages}
                    >
                      Export as Images
                    </button>
                    <button
                      className="flex w-full items-center px-3 py-2 text-sm rounded-sm hover:bg-accent"
                      onClick={() => {
                        // Toggle menu closed
                        setExportMenuOpen(false);
                        // Open campaign dialog
                        handleOpenCampaignDialog();
                      }}
                    >
                      Save as Campaign
                    </button>
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                onClick={handleSaveRcsFormat}
                disabled={saveFormatMutation.isPending}
                title="Save RCS format"
              >
                {saveFormatMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Format
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left side - Settings */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <ImageUploader 
                      selectedImages={selectedImages} 
                      setSelectedImages={setSelectedImages} 
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormatOptions 
                      formatType={formatType}
                      setFormatType={setFormatType}
                      cardOrientation={cardOrientation}
                      setCardOrientation={setCardOrientation}
                      mediaHeight={mediaHeight}
                      setMediaHeight={setMediaHeight}
                      lockAspectRatio={lockAspectRatio}
                      setLockAspectRatio={setLockAspectRatio}
                      title={title}
                      setTitle={setTitle}
                      description={description}
                      setDescription={setDescription}
                      brandLogoUrl={brandLogoUrl}
                      setBrandLogoUrl={setBrandLogoUrl}
                      verificationSymbol={verificationSymbol}
                      setVerificationSymbol={setVerificationSymbol}
                      customers={customers || []}
                      selectedCustomerId={selectedCustomerId}
                      setSelectedCustomerId={setSelectedCustomerId}
                      actions={actions}
                      setActions={setActions}
                      isLoadingCustomers={isLoadingCustomers}
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* Right side - Preview */}
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="android" value={activePreviewTab} onValueChange={setActivePreviewTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="android">Android Preview</TabsTrigger>
                        <TabsTrigger value="ios">iOS Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="android" className="mt-4">
                        <EnhancedPreviewContainer
                          platform="android"
                          formatType={formatType}
                          cardOrientation={cardOrientation}
                          mediaHeight={mediaHeight}
                          lockAspectRatio={lockAspectRatio}
                          title={title}
                          description={description}
                          imageUrls={state.processedImageUrls || []}
                          brandLogoUrl={brandLogoUrl}
                          verificationSymbol={verificationSymbol}
                          brandName={customers?.find(c => c.id.toString() === selectedCustomerId)?.name || "Business Name"}
                          actions={actions}
                        />
                      </TabsContent>
                      <TabsContent value="ios" className="mt-4">
                        <EnhancedPreviewContainer
                          platform="ios"
                          formatType={formatType}
                          cardOrientation={cardOrientation}
                          mediaHeight={mediaHeight}
                          lockAspectRatio={lockAspectRatio}
                          title={title}
                          description={description}
                          imageUrls={state.processedImageUrls || []}
                          brandLogoUrl={brandLogoUrl}
                          verificationSymbol={verificationSymbol}
                          brandName={customers?.find(c => c.id.toString() === selectedCustomerId)?.name || "Business Name"}
                          actions={actions}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign creation dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Enter campaign details to save this RCS format as a campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActiveCampaign"
                checked={isActiveCampaign}
                onCheckedChange={(checked) => setIsActiveCampaign(!!checked)}
              />
              <Label htmlFor="isActiveCampaign">Activate campaign immediately</Label>
            </div>
            {isActiveCampaign && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="targetPhoneNumbers">Target Phone Numbers (comma-separated)</Label>
                  <Textarea
                    id="targetPhoneNumbers"
                    value={targetPhoneNumbers}
                    onChange={(e) => setTargetPhoneNumbers(e.target.value)}
                    placeholder="e.g. +1234567890, +0987654321"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledDate">Scheduled Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="scheduledDate"
                        variant="outline"
                        className="justify-start text-left font-normal"
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
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsCampaignDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing overlay */}
      {exporting && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <ImageProcessingLoader
            stage={processingStage}
            progress={processingProgress}
            onCancel={() => setExporting(false)}
          />
        </div>
      )}
    </div>
  );
}