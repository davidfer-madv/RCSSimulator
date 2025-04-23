import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-formatter/image-uploader";
import { FormatOptions } from "@/components/image-formatter/format-options";
import { PreviewContainer } from "@/components/image-formatter/preview-container";
import { Action, Customer } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, RotateCcw, Save } from "lucide-react";
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

export default function RcsFormatter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for form fields
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formatType, setFormatType] = useState<"richCard" | "carousel">("richCard");
  const [cardOrientation, setCardOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [mediaHeight, setMediaHeight] = useState<"short" | "medium" | "tall">("medium");
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>("");
  const [verificationSymbol, setVerificationSymbol] = useState<boolean>(true); // Always enabled
  const [actions, setActions] = useState<Action[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState<string>("android");
  const [exporting, setExporting] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  
  // Fetch customers data
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Set brand logo URL from selected customer
  useEffect(() => {
    if (selectedCustomerId && customers) {
      const customer = customers.find(c => c.id.toString() === selectedCustomerId);
      if (customer?.brandLogoUrl) {
        setBrandLogoUrl(customer.brandLogoUrl);
      }
    }
  }, [selectedCustomerId, customers]);
  
  // Process images temporarily for preview
  const processedImageUrls = selectedImages.map(file => URL.createObjectURL(file));

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Save RCS format mutation
  const saveFormatMutation = useMutation({
    mutationFn: async () => {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append each image
      selectedImages.forEach((file, index) => {
        formData.append('images', file);
      });
      
      // Append format data as JSON
      const formatData = {
        formatType,
        cardOrientation,
        mediaHeight,
        lockAspectRatio,
        brandLogoUrl,
        verificationSymbol,
        title,
        description,
        actions,
        customerId: selectedCustomerId || null,
        campaignId: null, // Can be set if coming from a campaign
      };
      
      formData.append('formatData', JSON.stringify(formatData));
      
      // Make API request
      const res = await fetch('/api/rcs-formats', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Format saved successfully",
        description: "Your RCS format has been saved.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/rcs-formats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
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
    setLockAspectRatio(true);
    setBrandLogoUrl("");
    setVerificationSymbol(true);
    setActions([]);
    setSelectedCustomerId("");
    
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };

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
    
    saveFormatMutation.mutate();
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
                <h1 className="text-2xl font-bold text-gray-900">RCS Message Format</h1>
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
                      <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
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
                                        src={customer.brandLogoUrl} 
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
                      <PreviewContainer
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
                      <PreviewContainer
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
    </div>
  );
}