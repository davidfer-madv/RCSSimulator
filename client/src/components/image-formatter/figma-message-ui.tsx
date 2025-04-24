import React from 'react';

// iOS UI Components
export const iOSStatusBar: React.FC = () => (
  <div className="bg-black p-2 flex items-center justify-between rounded-t-lg">
    <div className="text-white text-xs">9:41</div>
    <div className="w-16 h-5 bg-black rounded-full"></div>
    <div className="flex space-x-1">
      <div className="text-white">
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5.5C1 3.01472 3.01472 1 5.5 1C7.98528 1 10 3.01472 10 5.5C10 7.98528 7.98528 10 5.5 10C3.01472 10 1 7.98528 1 5.5Z" stroke="white" strokeWidth="2"/>
          <path d="M5.5 3V8" stroke="white" strokeWidth="2"/>
          <path d="M3 5.5H8" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="text-white">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V9C15 10.1046 14.1046 11 13 11H3C1.89543 11 1 10.1046 1 9V3Z" stroke="white" strokeWidth="2"/>
          <path d="M1 3L8 7L15 3" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="text-white">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="1" width="20" height="10" rx="2" stroke="white" strokeWidth="2"/>
          <rect x="4" y="3" width="14" height="6" rx="1" fill="white"/>
        </svg>
      </div>
    </div>
  </div>
);

export const iOSHeader: React.FC<{ brandName: string; brandLogoUrl?: string; verificationBadgeUrl?: string; verificationSymbol?: boolean }> = ({ 
  brandName, 
  brandLogoUrl, 
  verificationBadgeUrl,
  verificationSymbol = false
}) => (
  <div className="bg-gray-100 p-2">
    <div className="flex items-center">
      <div className="text-blue-500 mr-2">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14L2 8L8 2" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-shrink-0 h-8 w-8">
        {brandLogoUrl ? (
          <div className="h-8 w-8 rounded-full bg-white overflow-hidden flex items-center justify-center border border-gray-200">
            <img 
              src={brandLogoUrl.startsWith('/') ? `http://localhost:5000${brandLogoUrl}` : brandLogoUrl} 
              alt="Brand logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                console.log("Error loading brand logo:", brandLogoUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">B</span>
          </div>
        )}
      </div>
      <div className="ml-2 flex-grow">
        <div className="text-sm font-medium text-gray-900 flex items-center">
          <span>{brandName}</span>
          {verificationSymbol && (
            <span className="ml-1 inline-flex items-center">
              <img 
                src={verificationBadgeUrl || '/assets/verification_icon.svg'} 
                alt="Verified" 
                className="h-5 w-5"
              />
            </span>
          )}
        </div>
      </div>
      <div className="ml-auto">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="#007AFF" strokeWidth="2"/>
          <path d="M8 5V8" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="8" cy="11" r="1" fill="#007AFF"/>
        </svg>
      </div>
    </div>
  </div>
);

export const iOSMessageBubble: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-3 flex justify-start">
    <div className="bg-gray-200 rounded-2xl py-2 px-3 max-w-[85%]">
      <p className="text-sm text-gray-800">{message}</p>
    </div>
  </div>
);

export const iOSInputBar: React.FC = () => (
  <div className="bg-gray-100 p-2 flex items-center border-t border-gray-200">
    <div className="flex items-center space-x-2 flex-grow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 12H19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div className="flex-grow p-2 bg-white border border-gray-300 rounded-full text-sm text-gray-500">
        Text Message - RCS
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="#007AFF" strokeWidth="2"/>
        <path d="M5 12H3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 12H19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 5V3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 21V19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7.05029 7.05029L5.63608 5.63608" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.364 18.364L16.9497 16.9497" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7.05029 16.9497L5.63608 18.364" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.364 5.63608L16.9497 7.05029" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L6 18" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 8V18" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 4V18" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  </div>
);

// Android UI Components
export const AndroidStatusBar: React.FC = () => (
  <div className="bg-gray-800 p-2 flex items-center justify-between">
    <div className="text-white text-xs">9:41</div>
    <div className="flex space-x-1">
      <div className="text-white">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 6C1 3.79086 2.79086 2 5 2C7.20914 2 9 3.79086 9 6C9 8.20914 7.20914 10 5 10C2.79086 10 1 8.20914 1 6Z" stroke="white" strokeWidth="2"/>
          <path d="M5 4V8" stroke="white" strokeWidth="2"/>
          <path d="M3 6H7" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="text-white">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V9C15 10.1046 14.1046 11 13 11H3C1.89543 11 1 10.1046 1 9V3Z" stroke="white" strokeWidth="2"/>
          <path d="M1 3L8 7L15 3" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      <div className="text-white">
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="1" width="20" height="10" rx="2" stroke="white" strokeWidth="2"/>
          <rect x="4" y="3" width="14" height="6" rx="1" fill="white"/>
        </svg>
      </div>
    </div>
  </div>
);

export const AndroidHeader: React.FC<{ brandName: string; brandLogoUrl?: string; verificationBadgeUrl?: string; verificationSymbol?: boolean }> = ({ 
  brandName, 
  brandLogoUrl, 
  verificationBadgeUrl,
  verificationSymbol = false
}) => (
  <div className="bg-blue-600 p-2">
    <div className="flex items-center">
      <div className="text-white mr-2">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14L2 8L8 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-shrink-0 h-8 w-8">
        {brandLogoUrl ? (
          <div className="h-8 w-8 rounded-full bg-white overflow-hidden flex items-center justify-center border border-gray-200">
            <img 
              src={brandLogoUrl.startsWith('/') ? `http://localhost:5000${brandLogoUrl}` : brandLogoUrl} 
              alt="Brand logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                console.log("Error loading brand logo:", brandLogoUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">B</span>
          </div>
        )}
      </div>
      <div className="ml-2 flex-grow">
        <div className="text-sm font-medium text-white flex items-center">
          <span>{brandName}</span>
          {verificationSymbol && (
            <span className="ml-1 inline-flex items-center">
              <img 
                src={verificationBadgeUrl || '/assets/verification_icon.svg'} 
                alt="Verified" 
                className="h-5 w-5"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const AndroidMessageBubble: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-3 flex justify-start">
    <div className="bg-white rounded-lg py-2 px-3 max-w-[85%] shadow-sm">
      <p className="text-sm text-gray-800">{message}</p>
    </div>
  </div>
);

export const AndroidInputBar: React.FC = () => (
  <div className="bg-white p-2 flex items-center border-t border-gray-200">
    <div className="flex items-center space-x-2 flex-grow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="#9CA3AF" strokeWidth="2"/>
        <path d="M9 9L15 15" stroke="#9CA3AF" strokeWidth="2"/>
        <path d="M15 9L9 15" stroke="#9CA3AF" strokeWidth="2"/>
      </svg>
      <div className="flex-grow p-2 bg-gray-100 rounded-full text-sm text-blue-600">
        RCS Message
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2"/>
        <path d="M5 12H3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 5V3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 21V19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7.05029 7.05029L5.63608 5.63608" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.364 18.364L16.9497 16.9497" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7.05029 16.9497L5.63608 18.364" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.364 5.63608L16.9497 7.05029" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  </div>
);

// RCS Rich Card Containers
export const AndroidRichCard: React.FC<{
  title: string;
  description: string;
  imageUrl?: string | null;
  cardOrientation: "vertical" | "horizontal";
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
  actions: { type: string; text: string; value?: string }[];
}> = ({ 
  title, 
  description, 
  imageUrl, 
  cardOrientation, 
  mediaHeight, 
  lockAspectRatio, 
  actions 
}) => {
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-28"; // 112 DP
      case "medium": return "h-40"; // 168 DP
      case "tall": return "h-56"; // 264 DP
      default: return "h-40";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden max-w-[85%] shadow-sm border border-gray-200">
      {cardOrientation === "horizontal" ? (
        <div className="flex">
          {imageUrl && (
            <img 
              src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
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
              src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
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
};

export const IOSRichCard: React.FC<{
  title: string;
  description: string;
  imageUrl?: string | null;
  cardOrientation: "vertical" | "horizontal";
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
  actions: { type: string; text: string; value?: string }[];
}> = ({ 
  title, 
  description, 
  imageUrl, 
  cardOrientation, 
  mediaHeight, 
  lockAspectRatio, 
  actions 
}) => {
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-24"; // iOS uses slightly smaller sizes
      case "medium": return "h-36";
      case "tall": return "h-52";
      default: return "h-36";
    }
  };

  return (
    <div className="max-w-[85%]">
      {cardOrientation === "horizontal" ? (
        <div className="flex flex-col">
          <div className="flex bg-gray-200 rounded-t-2xl p-3">
            {imageUrl && (
              <img 
                src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
                alt="Content" 
                className={`w-1/2 rounded-lg ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`} 
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
              src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
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
};

// Carousel Components
export const AndroidCarousel: React.FC<{
  title: string;
  description: string;
  imageUrls: string[];
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
  actions: { type: string; text: string; value?: string }[];
}> = ({ 
  title, 
  description, 
  imageUrls, 
  mediaHeight, 
  lockAspectRatio, 
  actions 
}) => {
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-28"; // 112 DP
      case "medium": return "h-40"; // 168 DP
      case "tall": return "h-56"; // 264 DP
      default: return "h-40";
    }
  };

  return (
    <div className="mb-3 w-full">
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2" style={{ width: `${imageUrls.length * 200}px` }}>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="flex-shrink-0 w-48">
              <div className="bg-white rounded-lg overflow-hidden max-w-full shadow-sm border border-gray-200">
                <img 
                  src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
                  alt={`Carousel item ${index + 1}`} 
                  className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`} 
                />
                <div className="p-4">
                  <h4 className="font-semibold text-base text-gray-900">{title || "Card Title"}</h4>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{description || "Card description text would appear here."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Android Carousel Actions - Only shown once for all cards */}
      {actions.length > 0 && (
        <div className="bg-white rounded-lg overflow-hidden max-w-[85%] shadow-sm border border-gray-200 mt-2">
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
        </div>
      )}
    </div>
  );
};

export const IOSCarousel: React.FC<{
  title: string;
  description: string;
  imageUrls: string[];
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
  actions: { type: string; text: string; value?: string }[];
}> = ({ 
  title, 
  description, 
  imageUrls, 
  mediaHeight, 
  lockAspectRatio, 
  actions 
}) => {
  // Calculate image height based on mediaHeight
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-24"; // iOS uses slightly smaller sizes
      case "medium": return "h-36";
      case "tall": return "h-52";
      default: return "h-36";
    }
  };

  return (
    <div className="mb-3 w-full">
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2" style={{ width: `${imageUrls.length * 180}px` }}>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} className="flex-shrink-0 w-44">
              <img 
                src={typeof imageUrl === 'string' && imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl} 
                alt={`Carousel item ${index + 1}`} 
                className={`w-full ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} rounded-lg mb-1 bg-gray-100`} 
              />
              <div className="bg-gray-200 rounded-2xl p-3">
                <h4 className="font-medium text-base text-black">{title || "Card Title"}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description || "Card description text."}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* iOS Carousel Actions - Only shown once for all cards */}
      {actions.length > 0 && (
        <div className="bg-gray-200 rounded-2xl p-3 mt-2 max-w-[85%]">
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
  );
};