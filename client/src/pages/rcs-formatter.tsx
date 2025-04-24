import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRcsFormatter } from "@/context/rcs-formatter-context";
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
  const { state, updateState, resetState } = useRcsFormatter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const campaignId = params?.campaignId;
  
  // Get all the state values from context - we'll use them directly
  
  // Local state variables with their setters
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
    selectedCustomerId
  ]);
  
  // Local state not stored in context
  const [activePreviewTab, setActivePreviewTab] = useState<string>("android");
  const [exporting, setExporting] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  
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
        try {
          // Update the brand logo URL - making sure it's properly prefixed for server-stored images
          let logoUrl = brand.brandLogoUrl;
          
          // Handle server-side stored images with absolute paths
          if (logoUrl.startsWith('/')) {
            logoUrl = `http://localhost:5000${logoUrl}`;
          }
          
          // Set the brand logo URL
          setBrandLogoUrl(logoUrl);
          console.log("Set brand logo URL from useEffect:", logoUrl);
          
          // The brandName is handled directly in the PreviewContainer with a lookup
          // No need to set a separate state variable for it
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
            logoUrl = `http://localhost:5000${logoUrl}`;
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
      
      // Fetch images from imageUrls if available - this is a bit tricky since we need to load files
      // Could add image preview from saved URLs as a future enhancement
      
      // Set page title to indicate edit mode
      document.title = `Edit Campaign: ${campaign.name}`;
    }
  }, [campaign, campaignFormats]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  // Export format
  const handleExport = async (exportType: 'json' | 'image' | 'both' | 'device-image' | 'raw-image' = 'json', platform: 'android' | 'ios' | 'both' = 'android') => {
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
        platform
      );
      
      const exportTypeText = 
        exportType === 'json' ? 'JSON configuration' : 
        exportType === 'image' ? 'preview image' : 
        exportType === 'device-image' ? 'device preview image' :
        exportType === 'raw-image' ? 'reformatted image' :
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
      // For edit mode, still show the dialog to allow setting/updating active campaign settings
      setCampaignName(campaign.name);
      
      // If campaign is already active, pre-fill activation settings
      if (campaign.isActive) {
        setIsActiveCampaign(true);
        
        // Set target phone numbers from campaign data if available
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
      
      setIsCampaignDialogOpen(true);
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
                    : "RCS Formatter"
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
                    Save Campaign
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
                    
                    {/* Export Image Dropdown */}
                    <div className="relative inline-block">
                      <Button 
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        disabled={saveFormatMutation.isPending || exporting}
                        variant="outline"
                        className="relative"
                        data-export-menu-button
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Image
                      </Button>
                      
                      {exportMenuOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                             role="menu" aria-orientation="vertical"
                             data-export-menu>
                          <div className="py-1" role="none">
                            {/* Device Image Export */}
                            <div className="px-4 py-2 border-b">
                              <h3 className="text-sm font-medium text-gray-900">Export Device Image</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Export full device preview with message bubble, rich card, etc.
                              </p>
                              <div className="flex mt-2 space-x-2">
                                <Button
                                  onClick={() => {
                                    handleExport('device-image', 'android');
                                    setExportMenuOpen(false);
                                  }}
                                  disabled={saveFormatMutation.isPending || exporting}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                >
                                  Android
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleExport('device-image', 'ios');
                                    setExportMenuOpen(false);
                                  }}
                                  disabled={saveFormatMutation.isPending || exporting}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                >
                                  iOS
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleExport('device-image', 'both');
                                    setExportMenuOpen(false);
                                  }}
                                  disabled={saveFormatMutation.isPending || exporting}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                >
                                  Both
                                </Button>
                              </div>
                            </div>
                            
                            {/* Raw Image Export */}
                            <div className="px-4 py-2">
                              <h3 className="text-sm font-medium text-gray-900">Export Reformatted Image</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Export just the processed image for use in real RCS campaigns
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <Button
                                  onClick={() => {
                                    const formatEl = document.getElementById('raw-image-format');
                                    if (formatEl) formatEl.setAttribute('data-format', 'jpeg');
                                    handleExport('raw-image');
                                    setExportMenuOpen(false);
                                  }}
                                  disabled={saveFormatMutation.isPending || exporting}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                >
                                  JPEG
                                </Button>
                                <Button
                                  onClick={() => {
                                    const formatEl = document.getElementById('raw-image-format');
                                    if (formatEl) formatEl.setAttribute('data-format', 'png');
                                    handleExport('raw-image');
                                    setExportMenuOpen(false);
                                  }}
                                  disabled={saveFormatMutation.isPending || exporting}
                                  variant="secondary"
                                  size="sm"
                                  className="text-xs"
                                >
                                  PNG
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Hidden element to store the raw image format */}
                      <div id="raw-image-format" data-format="png" className="hidden"></div>
                    </div>
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
                            try {
                              // Make sure to properly format the URL for server-stored images
                              let logoUrl = selectedBrand.brandLogoUrl;
                              
                              // Handle server-side stored images with absolute paths
                              if (logoUrl.startsWith('/')) {
                                logoUrl = `http://localhost:5000${logoUrl}`;
                              }
                              
                              // Set the brand logo URL
                              setBrandLogoUrl(logoUrl);
                              console.log("Set brand logo URL to:", logoUrl);
                            } catch (error) {
                              console.error("Error loading brand logo:", selectedBrand.brandLogoUrl);
                            }
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
                                        alt={`${customer.name} logo`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          console.error("Error loading brand logo in dropdown:", customer.brandLogoUrl);
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
                        imageUrls={state.processedImageUrls}
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
                        imageUrls={state.processedImageUrls}
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Campaign Name Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{campaignId ? "Update Campaign Settings" : "Campaign Settings"}</DialogTitle>
            <DialogDescription>
              {campaignId 
                ? "Update campaign information and activation settings for this RCS format."
                : "Name your campaign and configure activation settings. You can activate it now or schedule it for later."}
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
                  <div className="col-span-3">
                    <Textarea
                      id="target-numbers"
                      value={targetPhoneNumbers}
                      onChange={(e) => setTargetPhoneNumbers(e.target.value)}
                      placeholder="Enter phone numbers separated by commas"
                      className="h-24 w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter phone numbers in international format (e.g., +12025550123) separated by commas.
                    </p>
                  </div>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-500 mt-1">
                      {scheduledDate ? 
                        `Campaign will activate on ${format(scheduledDate, "PPP")}` : 
                        "Leave empty to activate immediately, or select a future date to schedule."}
                    </p>
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