import React from 'react';
import verificationBadgeImg from '@/assets/verification_badge.svg';

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
  verificationSymbol = true
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
              src={brandLogoUrl} 
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
                src={verificationBadgeUrl || verificationBadgeImg} 
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
  verificationSymbol = true
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
              src={brandLogoUrl} 
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
                src={verificationBadgeUrl || verificationBadgeImg} 
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
  // Calculate image styling based on RCS specifications
  const getImageStyle = () => {
    // For vertical cards, follow specific RCS aspect ratios
    if (cardOrientation === "vertical") {
      // Height based on the mediaHeight parameter
      let heightClass = "";
      
      switch (mediaHeight) {
        case "short": 
          heightClass = "h-28"; // 112 DP
          break;
        case "medium": 
          heightClass = "h-42"; // 168 DP
          break;
        case "tall": 
          heightClass = "h-66"; // 264 DP
          break;
        default: 
          heightClass = "h-42"; // Default to medium
      }
      
      // For vertical cards, use proper aspect ratios per RCS specifications
      let aspectRatioClass = "";
      if (lockAspectRatio) {
        aspectRatioClass = "aspect-[2/1]"; // Default to 2:1 ratio, could also use 16:9 (aspect-video) or 7:3
      }
      
      return `w-full ${heightClass} ${aspectRatioClass} bg-gray-100 ${lockAspectRatio ? 'object-cover' : 'object-contain'}`;
    } 
    // For horizontal cards, width is fixed at 128 DP (w-32 in tailwind)
    else {
      return "w-32 h-full bg-gray-100 object-cover"; // Height scales with content
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-[85%] shadow-sm border border-gray-200">
      {cardOrientation === "horizontal" ? (
        <div className="flex">
          {imageUrl && (
            <div className="w-32 overflow-hidden"> {/* Fixed 128 DP width (w-32) */}
              <img 
                src={imageUrl} 
                alt="Content" 
                className="w-full h-full object-cover bg-gray-100" 
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <h4 className="font-semibold text-base text-gray-900">{title || "Card Title"}</h4>
            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{description || "Card description text would appear here."}</p>
          </div>
        </div>
      ) : (
        <>
          {imageUrl && (
            <div className="w-full overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Content" 
                className={
                  lockAspectRatio 
                    ? `w-full ${mediaHeight === "short" ? "h-28" : mediaHeight === "medium" ? "h-42" : "h-66"} aspect-[2/1] object-contain bg-gray-100`
                    : `w-full ${mediaHeight === "short" ? "h-28" : mediaHeight === "medium" ? "h-42" : "h-66"} object-cover bg-gray-100`
                }
              />
            </div>
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
              {action.type === "text" && <span className="flex-shrink-0 mr-2 text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73232 18.9121L2.45 21.4424C2.25115 21.6619 2.29644 22 2.56299 22H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </span>}
              {action.type === "url" && <span className="flex-shrink-0 mr-2 text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13.5C10.8284 14.3284 12.1716 14.3284 13 13.5L17.5 9C18.3284 8.17157 18.3284 6.82843 17.5 6C16.6716 5.17157 15.3284 5.17157 14.5 6L13 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 10.5C13.1716 9.67157 11.8284 9.67157 11 10.5L6.5 15C5.67157 15.8284 5.67157 17.1716 6.5 18C7.32843 18.8284 8.67157 18.8284 9.5 18L11 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>}
              {action.type === "phone" && <span className="flex-shrink-0 mr-2 text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 2C15 2 18 2 18 5V19C18 19 18 22 15 22H9C9 22 6 22 6 19V5C6 5 6 2 9 2H15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18.5H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>}
              {action.type === "calendar" && <span className="flex-shrink-0 mr-2 text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 13V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>}
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
  // Calculate image height based on mediaHeight (iOS uses slightly smaller sizes)
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-24"; 
      case "medium": return "h-36";
      case "tall": return "h-52";
      default: return "h-36";
    }
  };

  // iOS action display rules:
  // 1. If there's only one URL action, show its text directly
  // 2. If there are multiple URL actions, show "Options" button with dropdown
  // 3. Text actions show as individual buttons (like Android)
  const textActions = actions.filter(a => a.type === "text");
  const urlActions = actions.filter(a => a.type === "url");
  const otherActions = actions.filter(a => a.type !== "text" && a.type !== "url");
  
  // For URL actions: single URL shows directly, multiple URLs show as "Options"
  const showSingleUrlButton = urlActions.length === 1;
  const showUrlOptionsButton = urlActions.length > 1;
  
  // For other actions (phone, calendar): single shows directly, multiple show as "Options"
  const showSingleOtherButton = otherActions.length === 1;
  const showOtherOptionsButton = otherActions.length > 1;

  return (
    <div className="max-w-[85%]">
      {cardOrientation === "horizontal" ? (
        <div className="flex flex-col">
          <div className="flex bg-gray-100 rounded-t-3xl p-3">
            {imageUrl && (
              <div className="flex-shrink-0 w-5/12 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Content" 
                  className={`w-full rounded-xl ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-white`} 
                />
              </div>
            )}
            <div className="ml-3 flex-1">
              <h4 className="font-medium text-base text-black">{title || "Card Title"}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description || "Card description text would appear here."}</p>
            </div>
          </div>
          
          {/* iOS buttons for horizontal layout are inside the card */}
          {actions.length > 0 && (
            <div className="bg-gray-100 rounded-b-3xl px-3 pb-3 pt-0.5">
              <div className="flex flex-wrap gap-2">
                {/* Text actions - always show individually */}
                {textActions.map((action, index) => (
                  <button 
                    key={`text-${index}`} 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {action.text}
                  </button>
                ))}
                
                {/* Single URL action - show directly */}
                {showSingleUrlButton && (
                  <button 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {urlActions[0].text}
                  </button>
                )}
                
                {/* Multiple URL actions - show Options button */}
                {showUrlOptionsButton && (
                  <div className="relative">
                    <button 
                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown?.classList.toggle('hidden');
                      }}
                    >
                      <span>Options</span>
                      <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {urlActions.map((action, index) => (
                        <button 
                          key={`url-${index}`}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Single other action (phone, calendar) - show directly */}
                {showSingleOtherButton && (
                  <button 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {otherActions[0].text}
                  </button>
                )}
                
                {/* Multiple other actions - show Options button */}
                {showOtherOptionsButton && (
                  <div className="relative">
                    <button 
                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown?.classList.toggle('hidden');
                      }}
                    >
                      <span>Options</span>
                      <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {otherActions.map((action, index) => (
                        <button 
                          key={`other-${index}`}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Vertical layout similar to example */}
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Content" 
              className={`w-full rounded-2xl ${getImageHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} mb-2 bg-white`} 
            />
          )}
          <div className="bg-gray-100 rounded-3xl p-3">
            <h4 className="font-medium text-base text-black">{title || "Card Title"}</h4>
            <p className="text-sm text-gray-600 mt-1 mb-2">{description || "Card description text would appear here."}</p>
            
            {/* Actions for vertical layout */}
            {actions.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
                {/* Text actions - always show individually */}
                {textActions.map((action, index) => (
                  <button 
                    key={`text-${index}`} 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {action.text}
                  </button>
                ))}
                
                {/* Single URL action - show directly */}
                {showSingleUrlButton && (
                  <button 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {urlActions[0].text}
                  </button>
                )}
                
                {/* Multiple URL actions - show Options button */}
                {showUrlOptionsButton && (
                  <div className="relative">
                    <button 
                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown?.classList.toggle('hidden');
                      }}
                    >
                      <span>Options</span>
                      <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {urlActions.map((action, index) => (
                        <button 
                          key={`url-${index}`}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Single other action (phone, calendar) - show directly */}
                {showSingleOtherButton && (
                  <button 
                    className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                  >
                    {otherActions[0].text}
                  </button>
                )}
                
                {/* Multiple other actions - show Options button */}
                {showOtherOptionsButton && (
                  <div className="relative">
                    <button 
                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown?.classList.toggle('hidden');
                      }}
                    >
                      <span>Options</span>
                      <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {otherActions.map((action, index) => (
                        <button 
                          key={`other-${index}`}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          {action.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const AndroidCarousel: React.FC<{
  items: Array<{
    title: string;
    description: string;
    imageUrl?: string | null;
    actions: { type: string; text: string; value?: string }[];
  }>;
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
}> = ({ items, mediaHeight, lockAspectRatio }) => {
  // If no items, return nothing
  if (!items || items.length === 0) return null;

  // Per RCS specs: carousel cards can be either small (120 DP) or medium (232 DP) width
  // Maximum height is 592 DP but usually matches tallest card content
  // We'll use w-30 for small (120dp) and w-58 for medium (232dp)
  // Default to medium width for better visibility
  const cardWidth = "w-58"; // 232 DP medium width
  
  // For carousel items, we use a standard height with some flexibility based on mediaHeight
  const getCarouselItemStyle = () => {
    let heightClass = "";
    
    switch (mediaHeight) {
      case "short": heightClass = "h-36"; break; // ~144 DP
      case "medium": heightClass = "h-64"; break; // ~256 DP
      case "tall": heightClass = "h-80"; break; // ~320 DP (below max 592 DP)
      default: heightClass = "h-64"; // Default to medium
    }
    
    return heightClass;
  };

  return (
    <div className="max-w-[85%] relative">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 snap-x snap-mandatory">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 ${cardWidth} bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 snap-start`}
          >
            {item.imageUrl && (
              <div className="w-full overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={`Carousel item ${index + 1}`} 
                  className={`w-full ${getCarouselItemStyle()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} bg-gray-100`}
                />
              </div>
            )}
            <div className="p-3">
              <h4 className="font-semibold text-base text-gray-900 line-clamp-1">{item.title}</h4>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{item.description}</p>
            </div>
            {item.actions.length > 0 && (
              <div className="border-t border-gray-200">
                {item.actions.slice(0, 1).map((action, actionIndex) => (
                  <button 
                    key={actionIndex} 
                    className="flex w-full items-center px-4 py-3 text-blue-600 hover:bg-blue-50"
                  >
                    {action.type === "text" && <span className="flex-shrink-0 mr-2 text-blue-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73232 18.9121L2.45 21.4424C2.25115 21.6619 2.29644 22 2.56299 22H12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </span>}
                    {action.type === "url" && <span className="flex-shrink-0 mr-2 text-blue-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13.5C10.8284 14.3284 12.1716 14.3284 13 13.5L17.5 9C18.3284 8.17157 18.3284 6.82843 17.5 6C16.6716 5.17157 15.3284 5.17157 14.5 6L13 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 10.5C13.1716 9.67157 11.8284 9.67157 11 10.5L6.5 15C5.67157 15.8284 5.67157 17.1716 6.5 18C7.32843 18.8284 8.67157 18.8284 9.5 18L11 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>}
                    {action.type === "phone" && <span className="flex-shrink-0 mr-2 text-blue-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 2C15 2 18 2 18 5V19C18 19 18 22 15 22H9C9 22 6 22 6 19V5C6 5 6 2 9 2H15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 18.5H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>}
                    {action.type === "calendar" && <span className="flex-shrink-0 mr-2 text-blue-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M21 13V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V19C3 20.1046 3.89543 21 5 21H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>}
                    <span className="font-medium">{action.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Carousel indicators */}
      <div className="flex justify-center mt-2 space-x-1">
        {items.map((_, index) => (
          <div key={index} className={`h-1.5 rounded-full ${index === 0 ? 'w-3 bg-blue-600' : 'w-1.5 bg-gray-300'}`}></div>
        ))}
      </div>
    </div>
  );
};

export const IOSCarousel: React.FC<{
  items: Array<{
    title: string;
    description: string;
    imageUrl?: string | null;
    actions: { type: string; text: string; value?: string }[];
  }>;
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
}> = ({ items, mediaHeight, lockAspectRatio }) => {
  // If no items, return nothing
  if (!items || items.length === 0) return null;

  // For iOS carousels, we'll match the specifications while adapting to iOS design principles
  // We'll use the medium width from Android (232 DP) which translates well for iOS
  const cardWidth = "w-56"; // Slightly narrower than Android to match iOS style
  
  // Determine height based on mediaHeight setting
  const getIOSCarouselHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-32"; // iOS uses slightly smaller sizes
      case "medium": return "h-48";
      case "tall": return "h-64";
      default: return "h-48";
    }
  };

  return (
    <div className="max-w-[85%] relative mb-2">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 snap-x snap-mandatory">
        {items.map((item, index) => {
          // iOS action display rules (same as rich card)
          const textActions = item.actions.filter(a => a.type === "text");
          const urlActions = item.actions.filter(a => a.type === "url");
          const otherActions = item.actions.filter(a => a.type !== "text" && a.type !== "url");
          
          // For URL actions: single URL shows directly, multiple URLs show as "Options"
          const showSingleUrlButton = urlActions.length === 1;
          const showUrlOptionsButton = urlActions.length > 1;
          
          // For other actions (phone, calendar): single shows directly, multiple show as "Options"
          const showSingleOtherButton = otherActions.length === 1;
          const showOtherOptionsButton = otherActions.length > 1;
          
          return (
            <div 
              key={index} 
              className={`flex-shrink-0 ${cardWidth} snap-start`}
            >
              {/* Image is displayed separately and above text in iOS */}
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={`Carousel item ${index + 1}`} 
                  className={`w-full rounded-2xl ${getIOSCarouselHeight()} ${lockAspectRatio ? 'object-contain' : 'object-cover'} mb-2 bg-white`} 
                />
              )}
              
              {/* Text content in a rounded rectangle */}
              <div className="bg-gray-100 rounded-3xl p-3">
                <h4 className="font-medium text-base text-black line-clamp-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                
                {/* Actions */}
                {item.actions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap gap-2">
                    {/* Text actions - always show individually */}
                    {textActions.map((action, actionIndex) => (
                      <button 
                        key={`text-${actionIndex}`} 
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                      >
                        {action.text}
                      </button>
                    ))}
                    
                    {/* Single URL action - show directly */}
                    {showSingleUrlButton && (
                      <button 
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                      >
                        {urlActions[0].text}
                      </button>
                    )}
                    
                    {/* Multiple URL actions - show Options button */}
                    {showUrlOptionsButton && (
                      <div className="relative">
                        <button 
                          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const dropdown = e.currentTarget.nextElementSibling;
                            dropdown?.classList.toggle('hidden');
                          }}
                        >
                          <span>Options</span>
                          <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          {urlActions.map((action, actionIndex) => (
                            <button 
                              key={`url-${actionIndex}`}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Single other action (phone, calendar) - show directly */}
                    {showSingleOtherButton && (
                      <button 
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                      >
                        {otherActions[0].text}
                      </button>
                    )}
                    
                    {/* Multiple other actions - show Options button */}
                    {showOtherOptionsButton && (
                      <div className="relative">
                        <button 
                          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium flex items-center options-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const dropdown = e.currentTarget.nextElementSibling;
                            dropdown?.classList.toggle('hidden');
                          }}
                        >
                          <span>Options</span>
                          <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="options-dropdown hidden absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          {otherActions.map((action, actionIndex) => (
                            <button 
                              key={`other-${actionIndex}`}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                            >
                              {action.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Carousel indicators (iOS style) */}
      <div className="flex justify-center mt-2 space-x-1">
        {items.map((_, index) => (
          <div key={index} className={`h-1.5 rounded-full ${index === 0 ? 'w-3 bg-blue-500' : 'w-1.5 bg-gray-300'}`}></div>
        ))}
      </div>
    </div>
  );
};