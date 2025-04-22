import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Action } from "@shared/schema";
import { Battery, ChevronLeft, Info, Mic, Paperclip, Plus, Signal, SmilePlus, Wifi } from "lucide-react";

interface PreviewContainerProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  imageUrls: string[];
  actions: Action[];
}

export function PreviewContainer({
  platform,
  title,
  description,
  imageUrls,
  actions,
}: PreviewContainerProps) {
  const previewImage = imageUrls.length > 0 ? imageUrls[0] : null;

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
                  <div className="bg-white rounded-lg overflow-hidden max-w-[85%] shadow-sm">
                    <img src={previewImage} alt="Product" className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h4 className="font-medium text-sm">{title || "New Product"}</h4>
                      <p className="text-xs text-gray-600 mt-1">{description || "Check out our latest products!"}</p>
                    </div>
                    {actions.length > 0 && (
                      <div className="border-t border-gray-200 p-2 flex flex-wrap gap-1">
                        {actions.map((action, index) => (
                          <button 
                            key={index} 
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-[85%]">
                    <img src={previewImage} alt="Product" className="w-full h-32 object-cover rounded-lg mb-1" />
                    <div className="bg-gray-200 rounded-2xl p-3">
                      <h4 className="font-medium text-sm">{title || "New Product"}</h4>
                      <p className="text-xs text-gray-600 mt-1">{description || "Check out our latest products!"}</p>
                      {actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {actions.map((action, index) => (
                            <button 
                              key={index} 
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full"
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
