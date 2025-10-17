import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import { FigmaPreviewContainer } from "./figma-preview-container";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";

interface EnhancedPreviewContainerProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  messageText?: string;
  imageUrls: string[];
  actions: Action[];
  replies?: { text: string; postbackData?: string }[];
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  formatType?: "message" | "richCard" | "carousel" | "chip";
  lockAspectRatio?: boolean;
  brandLogoUrl?: string;
  verificationSymbol?: boolean;
  brandName?: string;
}

export function EnhancedPreviewContainer(props: EnhancedPreviewContainerProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Set up the screenshot functionality for exporting
  useEffect(() => {
    // Add this preview container to a global registry for the export function to find
    // This is a simple approach to allow the export function in rcs-formatter.tsx to access this component
    if (previewRef.current) {
      (window as any).currentPreviewContainer = previewRef.current;
    }

    return () => {
      // Cleanup when component unmounts
      delete (window as any).currentPreviewContainer;
    };
  }, []);

  // Method to capture the preview as an image
  const capturePreview = async (): Promise<string> => {
    if (!previewRef.current) return '';
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow cross-origin images
        allowTaint: true, // Allow potentially tainted canvas
        backgroundColor: null, // Transparent background
      });
      
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('Error capturing preview:', err);
      return '';
    }
  };

  // Expose the capture method to the window for external access
  useEffect(() => {
    (window as any).capturePreview = capturePreview;
    
    return () => {
      delete (window as any).capturePreview;
    };
  }, []);

  return (
    <div ref={previewRef}>
      <FigmaPreviewContainer {...props} />
    </div>
  );
}