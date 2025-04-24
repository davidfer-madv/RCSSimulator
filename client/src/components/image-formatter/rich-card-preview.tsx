import { Action } from "@shared/schema";

interface RichCardPreviewProps {
  platform: "android" | "ios";
  title: string;
  description: string;
  imageUrl: string | null;
  actions: Action[];
  cardOrientation: "vertical" | "horizontal";
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
}

export function RichCardPreview({
  platform,
  title,
  description,
  imageUrl,
  actions,
  cardOrientation,
  mediaHeight,
  lockAspectRatio
}: RichCardPreviewProps) {
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short":
        return platform === "android" ? "h-28" : "h-24"; // 112 DP for Android, less for iOS
      case "medium":
        return platform === "android" ? "h-40" : "h-36"; // 168 DP for Android, less for iOS
      case "tall":
        return platform === "android" ? "h-56" : "h-52"; // 264 DP for Android, less for iOS
      default:
        return platform === "android" ? "h-40" : "h-36";
    }
  };

  if (platform === "android") {
    return (
      <div className="bg-white rounded-lg overflow-hidden max-w-[85%] shadow-sm border border-gray-200">
        {cardOrientation === "horizontal" ? (
          <div className="flex">
            {imageUrl && (
              <img 
                src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : imageUrl} 
                alt="Content" 
                className={`w-1/2 ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`} 
              />
            )}
            <div className="p-3 flex-1">
              <h4 className="font-semibold text-base text-gray-900">{title || "Card Title"}</h4>
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{description || "Card description text would appear here."}</p>
            </div>
          </div>
        ) : (
          <>
            {imageUrl && (
              <img 
                src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : imageUrl} 
                alt="Content" 
                className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`} 
              />
            )}
            <div className="p-4">
              <h4 className="font-semibold text-base text-gray-900">{title || "Card Title"}</h4>
              <p className="text-sm text-gray-700 mt-2">{description || "Card description text would appear here."}</p>
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
                {action.type === "url" && <span className="mr-2">🔗</span>}
                {action.type === "phone" && <span className="mr-2">📞</span>}
                {action.type === "calendar" && <span className="mr-2">🗓️</span>}
                <span className="font-medium">{action.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // iOS
    return (
      <div id="ios-preview-container" className="max-w-[85%]">
        {cardOrientation === "horizontal" ? (
          <div className="flex flex-col">
            <div className="flex bg-gray-200 rounded-t-2xl p-3">
              {imageUrl && (
                <img 
                  src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : imageUrl} 
                  alt="Content" 
                  className={`w-1/2 rounded-lg ${getImageHeight().replace('h-', 'max-h-')} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`} 
                />
              )}
              <div className="ml-2 flex-1">
                <h4 className="font-medium text-base text-black">{title || "Card Title"}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Card description text would appear here."}</p>
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
            {imageUrl && (
              <img 
                src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : imageUrl} 
                alt="Content" 
                className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} rounded-lg mb-1 bg-gray-100`} 
              />
            )}
            <div className="bg-gray-200 rounded-2xl p-3">
              <h4 className="font-medium text-base text-black">{title || "Card Title"}</h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-3">{description || "Card description text would appear here."}</p>
              
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
    );
  }
}