import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import { Battery, ChevronLeft, Info, Mic, Paperclip, Plus, Signal, SmilePlus, Wifi } from "lucide-react";

interface PreviewContainerProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  imageUrls: string[];
  actions: Action[];
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  formatType?: "richCard" | "carousel";
}

export function PreviewContainer({
  platform,
  title,
  description,
  imageUrls,
  actions,
  cardOrientation = "vertical",
  mediaHeight = "medium",
  formatType = "richCard"
}: PreviewContainerProps) {
  const previewImage = imageUrls.length > 0 ? imageUrls[0] : null;
  
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
          {/* Phone Frame */}
          <div className={`${platform === "android" ? "bg-gray-800" : "bg-black"} p-2 flex items-center justify-between ${platform === "ios" ? "rounded-t-lg" : ""}`}>
            <div className="text-white text-xs">9:41</div>
            {platform === "ios" && <div className="w-16 h-5 bg-black rounded-full"></div>}
            <div className="flex space-x-1">
              <Wifi className="text-white h-3 w-3" />
              <Signal className="text-white h-3 w-3" />
              <Battery className="text-white h-3 w-3" />
            </div>
          </div>
          
          {/* Messaging App Header */}
          <div className={`${platform === "android" ? "bg-blue-600" : "bg-gray-100"} p-2`}>
            <div className="flex items-center">
              <ChevronLeft className={`${platform === "android" ? "text-white" : "text-blue-500"} mr-2 h-4 w-4`} />
              <div className="flex-shrink-0 h-8 w-8">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">B</span>
                </div>
              </div>
              <div className="ml-2">
                <div className={`text-sm font-medium ${platform === "android" ? "text-white" : "text-gray-900"}`}>Business Name</div>
                {platform === "android" && <div className="text-xs text-blue-200">Online</div>}
              </div>
              {platform === "ios" && (
                <div className="ml-auto">
                  <Info className="text-blue-500 h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          
          {/* Message Thread */}
          <div className={`p-3 ${platform === "android" ? "bg-gray-100" : "bg-white"} h-64 overflow-y-auto`}>
            <div className="mb-3 flex justify-start">
              <div className={`${platform === "android" ? "bg-white" : "bg-gray-200"} ${platform === "ios" ? "rounded-2xl" : "rounded-lg"} py-2 px-3 max-w-[85%] ${platform === "android" ? "shadow-sm" : ""}`}>
                <p className="text-sm text-gray-800">Welcome to our business messaging!</p>
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
                          src={previewImage} 
                          alt="Product" 
                          className={`w-1/2 ${getImageHeight()} object-cover`} 
                        />
                        <div className="p-3 flex-1">
                          <h4 className="font-semibold text-base">{title || "Check-in for your flight"}</h4>
                          <p className="text-sm text-gray-700 mt-2">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM. What would you like to do?"}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={previewImage} 
                          alt="Product" 
                          className={`w-full ${getImageHeight()} object-cover`} 
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
                            src={previewImage} 
                            alt="Product" 
                            className={`w-1/2 rounded-lg ${getImageHeight().replace('h-', 'max-h-')} object-cover`} 
                          />
                          <div className="ml-2 flex-1">
                            <h4 className="font-medium text-base">{title || "Check-in for your flight"}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM."}</p>
                          </div>
                        </div>
                        {actions.length > 0 && (
                          <div className="bg-gray-200 rounded-b-2xl p-3 pt-1 mt-0">
                            <div className="flex flex-wrap gap-1">
                              {/* Show text actions directly */}
                              {actions.filter(a => a.type !== "url" && a.type !== "phone" && a.type !== "calendar").map((action, index) => (
                                <button 
                                  key={index} 
                                  className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                >
                                  {action.text}
                                </button>
                              ))}
                              
                              {/* For URL/Phone/Calendar actions */}
                              {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length === 1 ? (
                                // If there's only one URL/Phone/Calendar action, show it
                                actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, index) => (
                                  <button 
                                    key={index} 
                                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                  >
                                    {action.text}
                                  </button>
                                ))
                              ) : actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length > 1 ? (
                                // If there are multiple URL/Phone/Calendar actions, show Options button
                                <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium">
                                  Options
                                </button>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <img 
                          src={previewImage} 
                          alt="Product" 
                          className={`w-full ${getImageHeight()} object-cover rounded-lg mb-1`} 
                        />
                        <div className="bg-gray-200 rounded-2xl p-3">
                          <h4 className="font-medium text-base">{title || "Check-in for your flight"}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Happy morning, Jo! Check-in is now open for your flight from London to Mumbai on May 23 at 2:00PM."}</p>
                          
                          {actions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {/* Show text actions directly */}
                              {actions.filter(a => a.type !== "url" && a.type !== "phone" && a.type !== "calendar").map((action, index) => (
                                <button 
                                  key={index} 
                                  className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                >
                                  {action.text}
                                </button>
                              ))}
                              
                              {/* For URL/Phone/Calendar actions */}
                              {actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length === 1 ? (
                                // If there's only one URL/Phone/Calendar action, show it
                                actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").map((action, index) => (
                                  <button 
                                    key={index} 
                                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                                  >
                                    {action.text}
                                  </button>
                                ))
                              ) : actions.filter(a => a.type === "url" || a.type === "phone" || a.type === "calendar").length > 1 ? (
                                // If there are multiple URL/Phone/Calendar actions, show Options button
                                <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium">
                                  Options
                                </button>
                              ) : null}
                            </div>
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
          {platform === "android" ? (
            <div className="bg-white p-2 flex items-center border-t border-gray-200">
              <SmilePlus className="text-gray-400 mx-2 h-5 w-5" />
              <input type="text" placeholder="Message" className="flex-1 border-none text-sm focus:ring-0" />
              <Paperclip className="text-gray-400 mx-2 h-5 w-5" />
              <Mic className="text-gray-400 mx-2 h-5 w-5" />
            </div>
          ) : (
            <div className="bg-gray-100 p-2 flex items-center">
              <button className="bg-gray-200 rounded-full p-2 mr-2">
                <Plus className="text-gray-600 h-5 w-5" />
              </button>
              <input type="text" placeholder="Message" className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm" />
              <button className="ml-2 text-blue-500">
                <Mic className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
