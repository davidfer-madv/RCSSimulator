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
  brandName?: string;
  campaignName?: string;
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
    value?: string;
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
  exportType: 'json' | 'image' | 'both' | 'device-image' | 'raw-image' = 'json', 
  platform: 'android' | 'ios' | 'both' = 'android'
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
    
    // Handle device image export (full UI preview)
    if (exportType === 'image' || exportType === 'both' || exportType === 'device-image') {
      const platforms = platform === 'both' ? ['android', 'ios'] : [platform];
      
      for (const plat of platforms) {
        // Find the preview container for the specified platform
        const previewContainerId = plat === 'android' ? 
          'android-preview-container' : 'ios-preview-container';
        
        const previewElement = document.getElementById(previewContainerId);
        
        if (!previewElement) {
          console.error(`Preview container not found for ${plat} platform`);
          continue;
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
        link.download = `rcs_device_${plat}_${options.formatType}_${options.cardOrientation || 'vertical'}_${new Date().getTime()}.png`;
        link.style.display = "none";
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      }
    }
    
    // Handle raw image export (just the processed image without device UI)
    if (exportType === 'raw-image') {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileType = document.getElementById('raw-image-format')?.getAttribute('data-format') || 'png';
        
        // Create a canvas element to process the image
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create object URL from the file
        const imageUrl = URL.createObjectURL(file);
        
        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        
        // Convert to image data URL with the requested format
        const mimeType = fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = fileType === 'jpeg' ? 0.92 : undefined;
        const imageDataUrl = canvas.toDataURL(mimeType, quality);
        
        // Create download link
        const link = document.createElement("a");
        link.href = imageDataUrl;
        
        // Use information in filename
        const timestamp = new Date().getTime();
        link.download = `rcs_image_${i}_${timestamp}.${fileType}`;
        link.style.display = "none";
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(imageUrl);
          document.body.removeChild(link);
        }, 100);
      }
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
