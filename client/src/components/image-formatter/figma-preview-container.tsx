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
  IOSCarousel,
  AndroidChipList,
  IOSChipList
} from "./figma-message-ui";

interface FigmaPreviewContainerProps {
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

export function FigmaPreviewContainer({
  platform,
  title,
  description,
  messageText = "",
  imageUrls,
  actions,
  replies = [],
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
          <div className={`p-3 ${platform === "android" ? "bg-[#F5F5F5]" : "bg-white"} h-[500px] overflow-y-auto`}>
            {/* Welcome Message */}
            {platform === "android" ? (
              <AndroidMessageBubble message="Welcome to our business messaging!" />
            ) : (
              <>{iOSMessageBubble({ message: "Welcome to our business messaging!" })}</>
            )}
            
            {/* RCS Content */}
            {formatType === "message" ? (
              <div className="mb-3 flex justify-start">
                {platform === "android" ? (
                  <AndroidMessageBubble message={messageText || "Your message will appear here..."} />
                ) : (
                  <>{iOSMessageBubble({ message: messageText || "Your message will appear here..." })}</>
                )}
              </div>
            ) : formatType === "chip" ? (
              <div className="mb-3 flex justify-start">
                {platform === "android" ? (
                  <AndroidChipList 
                    messageText={messageText || "Your message will appear here..."}
                    actions={actions}
                    replies={replies}
                  />
                ) : (
                  <IOSChipList 
                    messageText={messageText || "Your message will appear here..."}
                    actions={actions}
                    replies={replies}
                  />
                )}
              </div>
            ) : formatType === "richCard" && imageUrls.length > 0 ? (
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
      
      {/* Platform-Specific Behavior Guide */}
      <div className="mt-4 space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
          <p className="font-semibold text-sm text-gray-900 mb-2">
            {platform === "android" ? "📱 Android" : "🍎 iOS"} Platform Behaviors:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            {platform === "android" ? (
              <>
                <li><strong>Actions:</strong> Displayed as Material Design 3 chips (inline, pill-shaped buttons)</li>
                <li><strong>Line Breaks:</strong> Respects all line breaks in description text</li>
                <li><strong>Title Length:</strong> Up to 200 characters displayed</li>
                <li><strong>Description:</strong> Up to 2000 characters, scrollable if needed</li>
                <li><strong>Image Format:</strong> JPEG, PNG, GIF (animated), WebP supported</li>
                <li><strong>Media Cropping:</strong> object-cover by default, object-contain if locked</li>
                <li><strong>Font Size:</strong> Title 16px, Description 14px</li>
                <li><strong>Chips vs Replies:</strong> Chips shown as filled buttons, replies as outlined</li>
              </>
            ) : (
              <>
                <li><strong>Actions:</strong> Displayed as list items with chevrons (tap to expand)</li>
                <li><strong>Line Breaks:</strong> May compress multiple line breaks to single space</li>
                <li><strong>Title Length:</strong> Truncates after ~60 characters (2 lines max)</li>
                <li><strong>Description:</strong> Truncates after ~144 characters (3 lines, line-clamp-3)</li>
                <li><strong>Image Format:</strong> JPEG, PNG only - NO GIF support (static or animated)</li>
                <li><strong>Media Cropping:</strong> object-contain preferred for best iOS display</li>
                <li><strong>Font Size:</strong> Title 15px, Description 13px (iOS standard)</li>
                <li><strong>Chips vs Replies:</strong> Both shown as white rounded buttons with borders</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-semibold text-sm text-gray-900 mb-2">⚠️ Key Differences:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            <li><strong>CTA Display:</strong> {platform === "android" ? "Android shows all actions inline as chips" : "iOS shows actions in a vertical list with chevrons"}</li>
            <li><strong>Link Previews:</strong> {platform === "android" ? "Rich card format with image + text" : "Compact card with smaller thumbnail"}</li>
            <li><strong>Image Scaling:</strong> {platform === "android" ? "Fills width, crops height to match mediaHeight DP" : "Contains image within bounds, may letterbox"}</li>
            <li><strong>Max Actions:</strong> Both platforms support up to 4 suggested actions + 11 replies</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}