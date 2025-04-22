import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-formatter/image-uploader";
import { FormatOptions } from "@/components/image-formatter/format-options";
import { PreviewContainer } from "@/components/image-formatter/preview-container";
import { Action } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, RotateCcw, Save } from "lucide-react";
import { processImages } from "@/lib/image-processing";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RcsFormatter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for form fields
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formatType, setFormatType] = useState<"richCard" | "carousel">("richCard");
  const [actions, setActions] = useState<Action[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState<string>("android");
  
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
        title,
        description,
        actions,
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
  const handleExport = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Process and export the images
      await processImages(selectedImages, {
        title,
        description,
        actions,
        formatType,
      });
      
      toast({
        title: "Export successful",
        description: "Your formatted images have been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedImages([]);
    setTitle("");
    setDescription("");
    setFormatType("richCard");
    setActions([]);
    
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
                  <Button 
                    onClick={handleExport}
                    disabled={saveFormatMutation.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload and Format Selection */}
                <Card className="lg:col-span-1">
                  <CardContent className="p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Upload Images</h3>
                    <ImageUploader 
                      onImagesSelected={setSelectedImages} 
                      maxImages={formatType === "carousel" ? 10 : 1}
                    />
                    
                    <div className="mt-6">
                      <FormatOptions 
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        formatType={formatType}
                        setFormatType={setFormatType}
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
                      />
                    </TabsContent>
                    
                    <TabsContent value="ios">
                      <PreviewContainer
                        platform="ios"
                        title={title}
                        description={description}
                        imageUrls={processedImageUrls}
                        actions={actions}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p className="mb-2"><strong>RCS Format Requirements:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Rich Cards: Single image with title, description, and action buttons</li>
                      <li>Carousels: Up to 10 images with shared title and actions</li>
                      <li>Image Requirements: Recommended 1200x900px, max 10MB per image</li>
                      <li>Actions: URL links, phone numbers, or calendar events</li>
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
