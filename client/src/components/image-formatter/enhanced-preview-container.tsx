import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import { FigmaPreviewContainer } from "./figma-preview-container";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import { 
  AndroidStatusBar, 
  AndroidHeader, 
  AndroidMessageBubble, 
  AndroidInputBar, 
  AndroidRichCard,
  AndroidCarousel,
  iOSStatusBar, 
  iOSHeader, 
  iOSMessageBubble, 
  iOSInputBar,
  IOSRichCard,
  IOSCarousel
} from "./rcs-authentic-ui";

interface EnhancedPreviewContainerProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  imageUrls: string[];
  actions: Action[];
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  formatType?: "richCard" | "carousel";
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

  // Use the Figma UI components directly for better rendering quality
  const selectedCustomer = props.brandName ? {
    name: props.brandName,
    brandLogoUrl: props.brandLogoUrl,
    verified: props.verificationSymbol
  } : null;

  const deviceStyle = isMobile ? "max-w-sm mx-auto" : "max-w-md mx-auto";

  return (
    <div ref={previewRef} className={deviceStyle}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        {/* Status Bar */}
        {props.platform === "android" ? <AndroidStatusBar /> : <iOSStatusBar />}
        
        {/* Header */}
        {props.platform === "android" ? (
          <AndroidHeader 
            brandName={props.brandName || "Business Name"}
            brandLogoUrl={props.brandLogoUrl}
            verificationSymbol={props.verificationSymbol}
          />
        ) : (
          <iOSHeader 
            brandName={props.brandName || "Business Name"}
            brandLogoUrl={props.brandLogoUrl}
            verificationSymbol={props.verificationSymbol}
          />
        )}
        
        {/* Message Area */}
        <div className="bg-gray-50 p-4 min-h-[400px]">
          {/* Previous message */}
          {props.platform === "android" ? (
            <AndroidMessageBubble message="Hi! I'd like to see your latest products" />
          ) : (
            <iOSMessageBubble message="Hi! I'd like to see your latest products" />
          )}
          
          {/* RCS Card */}
          <div className="mb-4">
            {props.formatType === "carousel" && props.imageUrls?.length > 1 ? (
              props.platform === "android" ? (
                <AndroidCarousel
                  items={props.imageUrls.map((imageUrl, index) => ({
                    title: index === 0 ? props.title : `${props.title} ${index + 1}`,
                    description: index === 0 ? props.description : "",
                    imageUrl,
                    actions: props.actions.map(action => ({
                      type: action.type as "url" | "phone" | "postback",
                      text: action.text,
                      payload: 'value' in action ? action.value || action.text : action.text
                    }))
                  }))}
                  mediaHeight={props.mediaHeight || "medium"}
                  lockAspectRatio={props.lockAspectRatio !== false}
                />
              ) : (
                <IOSCarousel
                  items={props.imageUrls.map((imageUrl, index) => ({
                    title: index === 0 ? props.title : `${props.title} ${index + 1}`,
                    description: index === 0 ? props.description : "",
                    imageUrl,
                    actions: props.actions.map(action => ({
                      type: action.type as "url" | "phone" | "postback",
                      text: action.text,
                      payload: 'value' in action ? action.value || action.text : action.text
                    }))
                  }))}
                  mediaHeight={props.mediaHeight || "medium"}
                  lockAspectRatio={props.lockAspectRatio !== false}
                />
              )
            ) : (
              props.platform === "android" ? (
                <AndroidRichCard
                  title={props.title || "Card Title"}
                  description={props.description || "Card description"}
                  imageUrl={props.imageUrls?.[0]}
                  cardOrientation={props.cardOrientation || "vertical"}
                  mediaHeight={props.mediaHeight || "medium"}
                  lockAspectRatio={props.lockAspectRatio !== false}
                  actions={props.actions.map(action => ({
                    type: action.type as "url" | "phone" | "postback",
                    text: action.text,
                    payload: 'value' in action ? action.value || action.text : action.text
                  }))}
                />
              ) : (
                <IOSRichCard
                  title={props.title || "Card Title"}
                  description={props.description || "Card description"}
                  imageUrl={props.imageUrls?.[0]}
                  cardOrientation={props.cardOrientation || "vertical"}
                  mediaHeight={props.mediaHeight || "medium"}
                  lockAspectRatio={props.lockAspectRatio !== false}
                  actions={props.actions.map(action => ({
                    type: action.type as "url" | "phone" | "postback",
                    text: action.text,
                    payload: 'value' in action ? action.value || action.text : action.text
                  }))}
                />
              )
            )}
          </div>
        </div>
        
        {/* Input Bar */}
        {props.platform === "android" ? <AndroidInputBar /> : <iOSInputBar />}
      </div>
    </div>
  );
}