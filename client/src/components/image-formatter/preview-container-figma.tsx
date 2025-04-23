import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import { BadgeCheck, Battery, ChevronLeft, Info, Mic, Paperclip, Plus, Signal, SmilePlus, Wifi } from "lucide-react";
import verificationBadge from "@/assets/verification_badge.svg";
import { useEffect } from "react";

// Import Figma assets
import iOSStatusBar from "@/assets/figma/ios/status_bar.svg";
import iOSHeader from "@/assets/figma/ios/header.svg";
import iOSMessageBubble from "@/assets/figma/ios/message_bubble.svg";
import androidStatusBar from "@/assets/figma/android/status_bar.svg";
import androidHeader from "@/assets/figma/android/header.svg";
import androidMessageBubble from "@/assets/figma/android/message_bubble.svg";

interface PreviewContainerProps {
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

export function PreviewContainerFigma({
  platform,
  title,
  description,
  imageUrls,
  actions,
  cardOrientation = "vertical",
  mediaHeight = "medium",
  formatType = "richCard",
  lockAspectRatio = true,
  brandLogoUrl = "",
  verificationSymbol = false,
  brandName = "Business Name"
}: PreviewContainerProps) {
  const previewImage = imageUrls.length > 0 ? imageUrls[0] : null;
  
  // Add event listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll('.options-dropdown:not(.hidden)');
      
      dropdowns.forEach(dropdown => {
        // Check if click is outside of this dropdown
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
  
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short":
        return "h-28"; // 112 DP
      case "medium":
        return "h-40"; // 168 DP
      case "tall":
        return "h-56"; // 264 DP
      default:
        return "h-40";
    }
  };

  return (
    <Card className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <CardTitle className="text-lg font-medium text-gray-900 mb-4">
        {platform === "android" ? "Android Preview" : "iOS Preview"}
      </CardTitle>
      
      <CardContent className="p-0">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mx-auto" style={{ maxWidth: "300px" }}>
          {/* Status Bar - Using Figma SVG */}
          <div className="w-full">
            <img 
              src={platform === "android" ? androidStatusBar : iOSStatusBar} 
              alt="Status Bar" 
              className="w-full"
            />
          </div>
          
          {/* Messaging App Header - Using Figma SVG */}
          <div className="w-full relative">
            <img 
              src={platform === "android" ? androidHeader : iOSHeader} 
              alt="Message Header" 
              className="w-full"
            />
            
            {/* Brand Logo - Overlaid on the header */}
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 flex items-center">
              <div className="flex-shrink-0 h-8 w-8 z-10">
                {brandLogoUrl ? (
                  <div className="h-8 w-8 rounded-full bg-white overflow-hidden flex items-center justify-center border border-gray-200">
                    <img 
                      src={brandLogoUrl.startsWith('/') ? `http://localhost:5000${brandLogoUrl}` : brandLogoUrl} 
                      alt="Brand logo" 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        console.log("Error loading brand logo:", brandLogoUrl);
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">B</span>
                  </div>
                )}
              </div>
              
              {/* Brand name and verification */}
              <div className="ml-2 absolute left-9">
                <div className={`text-sm font-medium ${platform === "android" ? "text-white" : "text-gray-900"} flex items-center`}>
                  <span>{brandName}</span>
                  {verificationSymbol && (
                    <span className="ml-1 inline-flex items-center">
                      <img 
                        src={verificationBadge} 
                        alt="Verified" 
                        className="h-4 w-4"
                        style={{ 
                          filter: platform === "android" ? "brightness(2) invert(1)" : "brightness(0.7)"
                        }}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Message Thread */}
          <div className={`p-3 ${platform === "android" ? "bg-gray-50" : "bg-white"} h-64 overflow-y-auto`}>
            <div className="mb-3 flex justify-start">
              <div className="relative">
                <img 
                  src={platform === "android" ? androidMessageBubble : iOSMessageBubble} 
                  alt="Message Bubble" 
                  className="max-w-[85%]"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center p-4">
                  <p className="text-sm text-gray-800">Welcome to our business messaging!</p>
                </div>
              </div>
            </div>
            
            {/* RCS Rich Card or iOS Adaptation */}
            {previewImage && (
              <div className="mb-3 flex justify-start">
                {platform === "android" ? (
                  <div id="android-preview-container" className="bg-white rounded-lg overflow-hidden max-w-[85%] shadow-sm">
                    {cardOrientation === "horizontal" ? (
                      <div className="flex">
                        <img 
                          src={typeof previewImage === 'string' && previewImage.startsWith('/') ? `http://localhost:5000${previewImage}` : previewImage} 
                          alt="Product" 
                          className={`w-1/2 ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'}`} 
                        />
                        <div className="p-3 flex-1">
                          <h4 className="font-semibold text-base">{title || "Check-in for your flight"}</h4>
                          <p className="text-sm text-gray-700 mt-2">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM. What would you like to do?"}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={typeof previewImage === 'string' && previewImage.startsWith('/') ? `http://localhost:5000${previewImage}` : previewImage} 
                          alt="Product" 
                          className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'}`} 
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-base">{title || "Check-in for your flight"}</h4>
                          <p className="text-sm text-gray-700 mt-2">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM. What would you like to do?"}</p>
                        </div>
                      </>
                    )}
                    {actions.length > 0 && (
                      <div className="border-t border-gray-200">
                        {actions.map((action, index) => (
                          <button 
                            key={index} 
                            className="flex w-full items-center px-4 py-3 text-blue-600 hover:bg-blue-50 border-b border-gray-200 last:border-b-0"
                          >
                            {action.type === "text" && <span className="mr-2">💬</span>}
                            {action.type === "url" && <span className="mr-2">⚡</span>}
                            {action.type === "phone" && <span className="mr-2">📞</span>}
                            {action.type === "calendar" && <span className="mr-2">🕒</span>}
                            <span className="font-medium">{action.text}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div id="ios-preview-container" className="max-w-[85%]">
                    {cardOrientation === "horizontal" ? (
                      <div className="flex flex-col">
                        <div className="flex bg-gray-200 rounded-t-2xl p-3">
                          <img 
                            src={typeof previewImage === 'string' && previewImage.startsWith('/') ? `http://localhost:5000${previewImage}` : previewImage} 
                            alt="Product" 
                            className={`w-1/2 rounded-lg ${getImageHeight().replace('h-', 'max-h-')} ${lockAspectRatio ? 'object-contain' : 'object-cover'}`} 
                          />
                          <div className="ml-2 flex-1">
                            <h4 className="font-medium text-base text-black">{title || "Check-in for your flight"}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM."}</p>
                          </div>
                        </div>
                        {actions.length > 0 && (
                          <div className="bg-gray-200 rounded-b-2xl p-3 pt-1 mt-0">
                            {/* Text actions */}
                            <div className="flex flex-wrap gap-1">
                              {actions.filter(a => a.type === "text").map((action, index) => (
                                <button 
                                  key={index} 
                                  className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                >
                                  {action.text}
                                </button>
                              ))}
                              
                              {/* Single URL/Phone/Calendar action */}
                              {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length === 1 && 
                                actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, index) => (
                                  <button 
                                    key={index} 
                                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                  >
                                    {action.text}
                                  </button>
                                ))
                              }
                            </div>
                            
                            {/* Multiple URL/Phone/Calendar actions - Options button on new line */}
                            {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length > 1 && (
                              <div className="mt-2">
                                <div className="relative dropdown-container">
                                  <button 
                                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium options-btn"
                                    onClick={(e) => {
                                      // Toggle dropdown visibility when clicked
                                      const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (dropdown) {
                                        dropdown.classList.toggle('hidden');
                                      }
                                      e.stopPropagation();
                                    }}
                                  >
                                    Options
                                  </button>
                                  {/* Dropdown that shows on click */}
                                  <div className="absolute left-0 mt-1 w-48 bg-gray-200 shadow-md rounded-lg overflow-hidden z-10 hidden options-dropdown">
                                    {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, idx) => (
                                      <button 
                                        key={idx}
                                        className="block w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-300 border-b border-gray-300 last:border-b-0"
                                      >
                                        {action.text}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <img 
                          src={typeof previewImage === 'string' && previewImage.startsWith('/') ? `http://localhost:5000${previewImage}` : previewImage} 
                          alt="Product" 
                          className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} rounded-lg mb-1`} 
                        />
                        <div className="bg-gray-200 rounded-2xl p-3">
                          <h4 className="font-medium text-base text-black">{title || "Check-in for your flight"}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM."}</p>
                          
                          {actions.length > 0 && (
                            <>
                              {/* Text actions and single URL action */}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {actions.filter(a => a.type === "text").map((action, index) => (
                                  <button 
                                    key={index} 
                                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                  >
                                    {action.text}
                                  </button>
                                ))}
                                
                                {/* Single URL/Phone/Calendar action */}
                                {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length === 1 && 
                                  actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, index) => (
                                    <button 
                                      key={index} 
                                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                    >
                                      {action.text}
                                    </button>
                                  ))
                                }
                              </div>
                              
                              {/* Multiple URL/Phone/Calendar actions - Options button */}
                              {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length > 1 && (
                                <div className="mt-2">
                                  <div className="relative dropdown-container">
                                    <button 
                                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium options-btn"
                                      onClick={(e) => {
                                        // Toggle dropdown visibility when clicked
                                        const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (dropdown) {
                                          dropdown.classList.toggle('hidden');
                                        }
                                        e.stopPropagation();
                                      }}
                                    >
                                      Options
                                    </button>
                                    {/* Dropdown that shows on click */}
                                    <div className="absolute left-0 mt-1 w-48 bg-gray-200 shadow-md rounded-lg overflow-hidden z-10 hidden options-dropdown">
                                      {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, idx) => (
                                        <button 
                                          key={idx}
                                          className="block w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-300 border-b border-gray-300 last:border-b-0"
                                        >
                                          {action.text}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className={`${platform === "android" ? "bg-white border-t border-gray-200" : "bg-gray-100"} p-2 flex items-center`}>
            <div className="flex items-center space-x-2 flex-grow">
              {platform === "android" ? (
                <>
                  <SmilePlus className="text-gray-400 h-5 w-5" />
                  <div className="flex-grow p-2 bg-gray-100 rounded-full text-sm text-gray-500">
                    Message
                  </div>
                  <Mic className="text-gray-400 h-5 w-5" />
                </>
              ) : (
                <>
                  <Plus className="text-blue-500 h-5 w-5" />
                  <div className="flex-grow p-2 bg-white border border-gray-300 rounded-full text-sm text-gray-500">
                    Message
                  </div>
                  <Mic className="text-blue-500 h-5 w-5" />
                  <Paperclip className="text-blue-500 h-5 w-5" />
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}