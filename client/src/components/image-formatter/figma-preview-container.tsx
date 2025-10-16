import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import verificationBadge from "@/assets/verification_badge.svg";
import verificationIcon from "@/assets/verification_icon.svg";
import { useEffect } from "react";
import { 
  iOSStatusBar, 
  iOSHeader, 
  iOSMessageBubble, 
  iOSInputBar,
  AndroidStatusBar, 
  AndroidHeader, 
  AndroidMessageBubble, 
  AndroidInputBar,
  AndroidRichCard,
  IOSRichCard,
  AndroidCarousel,
  IOSCarousel
} from "./figma-message-ui";

interface FigmaPreviewContainerProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  messageText?: string;
  imageUrls: string[];
  actions: Action[];
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  formatType?: "message" | "richCard" | "carousel";
  lockAspectRatio?: boolean;
  brandLogoUrl?: string;
  verificationSymbol?: boolean;
  brandName?: string;
}

export function FigmaPreviewContainer({
  platform,
  title,
  description,
  messageText = "",
  imageUrls,
  actions,
  cardOrientation = "vertical",
  mediaHeight = "medium",
  formatType = "richCard",
  lockAspectRatio = true,
  brandLogoUrl = "",
  verificationSymbol = true,
  brandName = "Business Name"
}: FigmaPreviewContainerProps) {
  // Close dropdowns when clicking outside of them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.options-dropdown:not(.hidden)');
      
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target as Node) && 
            !(event.target as Element).classList.contains('options-btn')) {
          dropdown.classList.add('hidden');
        }
      });
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Card className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <CardTitle className="text-lg font-medium text-gray-900 mb-4">
        {platform === "android" ? "Android Preview" : "iOS Preview"}
      </CardTitle>
      
      <CardContent className="p-0">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mx-auto" style={{ maxWidth: "300px" }}>
          {/* Status Bar */}
          {platform === "android" ? <AndroidStatusBar /> : <>{iOSStatusBar({})}</>}
          
          {/* Header */}
          {platform === "android" ? (
            <AndroidHeader 
              brandName={brandName} 
              brandLogoUrl={brandLogoUrl} 
              verificationBadgeUrl={verificationIcon} 
              verificationSymbol={verificationSymbol} 
            />
          ) : (
            <>{iOSHeader({ 
              brandName, 
              brandLogoUrl, 
              verificationBadgeUrl: verificationIcon, 
              verificationSymbol 
            })}</>
          )}
          
          {/* Message Thread */}
          <div className={`p-3 ${platform === "android" ? "bg-gray-100" : "bg-white"} h-[400px] overflow-y-auto`}>
            {/* Welcome Message */}
            {platform === "android" ? (
              <AndroidMessageBubble message="Welcome to our business messaging!" />
            ) : (
              <>{iOSMessageBubble({ message: "Welcome to our business messaging!" })}</>
            )}
            
            {/* RCS Content */}
            {formatType === "richCard" && imageUrls.length > 0 ? (
              <div className="mb-3 flex justify-start">
                {platform === "android" ? (
                  <AndroidRichCard
                    title={title}
                    description={description}
                    imageUrl={imageUrls[0]}
                    cardOrientation={cardOrientation}
                    mediaHeight={mediaHeight}
                    lockAspectRatio={lockAspectRatio}
                    actions={actions}
                  />
                ) : (
                  <IOSRichCard
                    title={title}
                    description={description}
                    imageUrl={imageUrls[0]}
                    cardOrientation={cardOrientation}
                    mediaHeight={mediaHeight}
                    lockAspectRatio={lockAspectRatio}
                    actions={actions}
                  />
                )}
              </div>
            ) : formatType === "carousel" && imageUrls.length > 0 ? (
              platform === "android" ? (
                <AndroidCarousel
                  items={imageUrls.map(url => ({
                    title,
                    description,
                    imageUrl: url,
                    actions
                  }))}
                  mediaHeight={mediaHeight}
                  lockAspectRatio={lockAspectRatio}
                />
              ) : (
                <IOSCarousel
                  items={imageUrls.map(url => ({
                    title,
                    description,
                    imageUrl: url,
                    actions
                  }))}
                  mediaHeight={mediaHeight}
                  lockAspectRatio={lockAspectRatio}
                />
              )
            ) : null}
          </div>
          
          {/* Input Area */}
          {platform === "android" ? <AndroidInputBar /> : <>{iOSInputBar({})}</>}
        </div>
      </CardContent>
      
      {/* Format Requirements Reference */}
      <div className="mt-4 text-sm text-gray-500">
        <p className="mb-2"><strong>RCS Format Requirements:</strong></p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
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
    </Card>
  );
}