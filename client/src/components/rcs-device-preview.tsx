import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, MoreHorizontal, ArrowLeft, Share, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RcsFormat {
  id?: number;
  title?: string;
  description?: string;
  imageUrls?: string[];
  actions?: Array<{
    text: string;
    type: "url" | "phone" | "postback";
    payload: string;
  }>;
  formatType: "rich_card" | "carousel";
  orientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
}

interface Customer {
  name: string;
  brandLogoUrl?: string;
  primaryColor?: string;
  verified?: boolean;
}

interface RcsDevicePreviewProps {
  format: RcsFormat;
  customer?: Customer;
  platform?: "android" | "ios";
  showDeviceFrame?: boolean;
}

export function RcsDevicePreview({ 
  format, 
  customer, 
  platform = "android",
  showDeviceFrame = true 
}: RcsDevicePreviewProps) {
  const getMediaHeight = () => {
    switch (format.mediaHeight) {
      case "short": return "h-28"; // 112 DP
      case "medium": return "h-42"; // 168 DP  
      case "tall": return "h-66"; // 264 DP
      default: return "h-42";
    }
  };

  const brandColor = customer?.primaryColor || "#1976D2";
  const isVerified = customer?.verified || false;

  const DeviceContent = () => (
    <div className="bg-white h-full flex flex-col">
      {/* Message Header - Platform specific */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <ArrowLeft className="h-5 w-5 text-gray-600" />
        <div className="flex items-center gap-3 flex-1">
          {customer?.brandLogoUrl ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <img 
                src={customer.brandLogoUrl} 
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              {customer?.name?.[0] || "B"}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {customer?.name || "Business Name"}
              </span>
              {isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {platform === "android" ? "RCS Business Messaging" : "Business Chat"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {platform === "android" && (
            <>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
        <div className="flex justify-end mb-2">
          <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-br-md max-w-xs">
            <div className="text-sm">Hi! I'd like to see your latest products</div>
          </div>
        </div>

        {/* RCS Rich Card/Carousel */}
        <div className="flex justify-start">
          <div className="max-w-sm">
            {format.formatType === "carousel" && format.imageUrls && format.imageUrls.length > 1 ? (
              <RcsCarousel format={format} brandColor={brandColor} platform={platform} />
            ) : (
              <RcsRichCard format={format} brandColor={brandColor} platform={platform} />
            )}
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex justify-start mt-3">
          <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <div className="text-gray-500 text-sm">Type a message...</div>
          </div>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: brandColor }}
          >
            <span className="text-sm">→</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!showDeviceFrame) {
    return <DeviceContent />;
  }

  return (
    <div className="flex justify-center">
      <div className={cn(
        "relative bg-gray-900 rounded-3xl p-2 shadow-2xl",
        platform === "android" ? "w-80 h-[640px]" : "w-80 h-[640px]"
      )}>
        {/* Device Frame */}
        <div className="relative bg-black rounded-2xl overflow-hidden h-full">
          {/* Status Bar */}
          <div className="bg-black text-white px-4 py-1 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <span>9:41</span>
              {platform === "android" && (
                <span className="ml-2 text-gray-400">Messages</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm ml-2">
                <div className="w-4 h-1 bg-white rounded-sm ml-0.5 mt-0.5"></div>
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="h-full bg-white">
            <DeviceContent />
          </div>
        </div>
        
        {/* Platform Badge */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <Badge variant="outline" className="bg-white">
            {platform === "android" ? "Android Messages" : "iOS Messages"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function RcsRichCard({ format, brandColor, platform }: { 
  format: RcsFormat; 
  brandColor: string; 
  platform: string; 
}) {
  const getMediaHeight = () => {
    switch (format.mediaHeight) {
      case "short": return "h-28"; // 112 DP
      case "medium": return "h-42"; // 168 DP  
      case "tall": return "h-66"; // 264 DP
      default: return "h-42";
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden border-0 max-w-sm">
      {/* Media */}
      {format.imageUrls && format.imageUrls[0] && (
        <div className={cn("bg-gray-200 flex items-center justify-center", getMediaHeight())}>
          <img 
            src={format.imageUrls[0]} 
            alt={format.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {format.title && (
          <h3 className="font-semibold text-gray-900 leading-tight">
            {format.title}
          </h3>
        )}
        
        {format.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {format.description}
          </p>
        )}
        
        {/* Actions */}
        {format.actions && format.actions.length > 0 && (
          <div className="space-y-2 pt-2">
            {format.actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full text-left justify-start rounded-full border-2 transition-colors",
                  platform === "android" 
                    ? "hover:bg-blue-50 hover:border-blue-200" 
                    : "hover:bg-gray-50"
                )}
                style={{ 
                  borderColor: platform === "android" ? brandColor : "#E5E7EB",
                  color: platform === "android" ? brandColor : "#374151"
                }}
              >
                {action.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function RcsCarousel({ format, brandColor, platform }: { 
  format: RcsFormat; 
  brandColor: string; 
  platform: string; 
}) {
  const getMediaHeight = () => {
    switch (format.mediaHeight) {
      case "short": return "h-28";
      case "medium": return "h-42";  
      case "tall": return "h-66";
      default: return "h-42";
    }
  };

  const cards = format.imageUrls?.slice(0, 3) || []; // Show first 3 cards

  return (
    <div className="space-y-3">
      {/* Carousel Cards */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map((imageUrl, index) => (
          <Card key={index} className="bg-white shadow-lg rounded-2xl overflow-hidden border-0 min-w-[180px] max-w-[180px]">
            {imageUrl && (
              <div className={cn("bg-gray-200 flex items-center justify-center", getMediaHeight())}>
                <img 
                  src={imageUrl} 
                  alt={`Card ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-3 space-y-2">
              <h4 className="font-medium text-sm text-gray-900 leading-tight">
                {format.title} {index + 1}
              </h4>
              
              {format.description && index === 0 && (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {format.description}
                </p>
              )}
              
              {/* First action only for space */}
              {format.actions && format.actions[0] && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs rounded-full border-2"
                  style={{ 
                    borderColor: platform === "android" ? brandColor : "#E5E7EB",
                    color: platform === "android" ? brandColor : "#374151"
                  }}
                >
                  {format.actions[0].text}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Carousel Indicator */}
      <div className="flex justify-center gap-1">
        {cards.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              index === 0 ? "bg-gray-900" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}