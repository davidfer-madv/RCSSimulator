import { Action } from "@shared/schema";

interface FormatOptions {
  title: string;
  description: string;
  formatType: "richCard" | "carousel";
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  lockAspectRatio?: boolean;
  brandLogoUrl?: string;
  verificationSymbol?: boolean;
  actions: Action[];
}

interface RcsCardJson {
  formatType: string;
  orientation?: string;
  mediaHeight?: string;
  title: string;
  description: string;
  imagePaths?: string[];
  actions: {
    text: string;
    type: string;
    value: string;
  }[];
}

/**
 * Process images for RCS format and trigger download
 * @param images - Array of image files to process
 * @param options - Format options including title, description, formatType, and actions
 * @param exportType - The type of export to perform (json, image, or both)
 * @param platform - The platform to export for preview capture (android or ios)
 */
export async function processImages(
  images: File[], 
  options: FormatOptions, 
  exportType: 'json' | 'image' | 'both' = 'json', 
  platform: 'android' | 'ios' = 'android'
): Promise<void> {
  // This is a simplified version that would normally involve server-side image processing
  // Here we're just triggering downloads of the original files
  
  try {
    // Create JSON representation of the RCS format
    const rcsJson: RcsCardJson = {
      formatType: options.formatType,
      orientation: options.cardOrientation || "vertical",
      mediaHeight: options.mediaHeight || "medium",
      title: options.title,
      description: options.description,
      imagePaths: images.map(file => file.name),
      actions: options.actions.map(action => ({
        text: action.text,
        type: action.type,
        value: action.value
      }))
    };

    // Handle JSON export if requested
    if (exportType === 'json' || exportType === 'both') {
      // Export JSON file
      const jsonBlob = new Blob([JSON.stringify(rcsJson, null, 2)], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      
      // Download the JSON file
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `rcs_format_${new Date().getTime()}.json`;
      jsonLink.style.display = "none";
      document.body.appendChild(jsonLink);
      jsonLink.click();
  
      // Clean up JSON download
      setTimeout(() => {
        URL.revokeObjectURL(jsonUrl);
        document.body.removeChild(jsonLink);
      }, 100);
    }
    
    // Handle full image export if requested
    if (exportType === 'image' || exportType === 'both') {
      // Find the preview container for the specified platform
      const previewContainerId = platform === 'android' ? 
        'android-preview-container' : 'ios-preview-container';
      
      const previewElement = document.getElementById(previewContainerId);
      
      if (!previewElement) {
        throw new Error(`Preview container not found for ${platform} platform`);
      }
      
      // Use html2canvas to capture the preview as an image
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(previewElement, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert to image data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement("a");
      link.href = imageDataUrl;
      
      // Use information in filename
      link.download = `rcs_card_${platform}_${options.formatType}_${options.cardOrientation || 'vertical'}_${options.mediaHeight || 'medium'}_${new Date().getTime()}.png`;
      link.style.display = "none";
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
    
    // Download original images if JSON export was requested
    if (exportType === 'json' || exportType === 'both') {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const imageUrl = URL.createObjectURL(file);
        
        // Create temporary link for download
        const a = document.createElement("a");
        a.href = imageUrl;
        
        // Add format info to filename
        const fileExtension = file.name.split('.').pop();
        const fileNameBase = file.name.substring(0, file.name.lastIndexOf('.'));
        
        // Include formatting info in the filename
        const formattedName = `${fileNameBase}_${options.formatType}_${options.cardOrientation || 'vertical'}_${options.mediaHeight || 'medium'}${i > 0 ? `_${i}` : ''}.${fileExtension}`;
        
        a.download = formattedName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(imageUrl);
          document.body.removeChild(a);
        }, 100);
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error processing images:", error);
    return Promise.reject(new Error("Failed to process images"));
  }
}
