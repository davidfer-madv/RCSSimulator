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

// Android UI Components (Google Messages)
export const AndroidStatusBar: React.FC = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  
  return (
    <div className="bg-black px-3 py-1 flex items-center justify-between text-white text-xs">
      <div className="font-medium">{timeString}</div>
      <div className="flex items-center space-x-1.5">
        {/* Signal strength */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-90">
          <rect x="0" y="8" width="2" height="4" fill="white"/>
          <rect x="4" y="6" width="2" height="6" fill="white"/>
          <rect x="8" y="4" width="2" height="8" fill="white"/>
          <rect x="12" y="2" width="2" height="10" fill="white"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-90">
          <path d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z" fill="white"/>
          <path d="M4 6C5.5 4.5 6.5 4 8 4C9.5 4 10.5 4.5 12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 4C4 2 6 1 8 1C10 1 12 2 14 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {/* Battery */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <rect x="1" y="2" width="18" height="8" rx="1.5" stroke="white" strokeWidth="1" fill="none"/>
          <rect x="2.5" y="3.5" width="13" height="5" rx="0.5" fill="white"/>
          <rect x="19.5" y="4.5" width="1.5" height="3" rx="0.5" fill="white"/>
        </svg>
        {/* 80% text */}
        <span className="text-[10px] opacity-75">80%</span>
      </div>
    </div>
  );
};

export const AndroidHeader: React.FC<{ brandName: string; brandLogoUrl?: string; verificationBadgeUrl?: string; verificationSymbol?: boolean }> = ({ 
  brandName, 
  brandLogoUrl, 
  verificationBadgeUrl,
  verificationSymbol = true
}) => (
  <div className="bg-white border-b border-gray-200 px-2 py-2.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 min-w-0">
        {/* Back arrow */}
        <button className="p-1 mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#5F6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Brand info */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="text-[16px] font-medium text-gray-900 truncate flex items-center">
            {brandName}
            {verificationSymbol && (
              <svg className="ml-1.5 flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#1A73E8"/>
                <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
      </div>
      
      {/* Right icons */}
      <div className="flex items-center space-x-1">
        <button className="p-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="#5F6368" strokeWidth="1.5"/>
            <path d="M10 6V10L13 13" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="p-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="4" r="1.5" fill="#5F6368"/>
            <circle cx="10" cy="10" r="1.5" fill="#5F6368"/>
            <circle cx="10" cy="16" r="1.5" fill="#5F6368"/>
          </svg>
        </button>
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
  // Calculate image height based on RCS specifications (DP values)
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-28";  // 112 DP
      case "medium": return "h-42"; // 168 DP
      case "tall": return "h-64";   // 264 DP
      default: return "h-42";
    }
  };

  const hasActions = actions && actions.length > 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden max-w-full shadow-md border border-gray-200">
      {cardOrientation === "horizontal" ? (
        // Horizontal Layout - Image on left, content on right
        <div className="flex">
          {imageUrl && (
            <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
              <img 
                src={imageUrl} 
                alt="Content" 
                className={`w-full h-full ${lockAspectRatio ? 'object-contain' : 'object-cover'}`}
              />
            </div>
          )}
          <div className="p-3 flex-1 min-w-0">
            <h4 className="font-medium text-[15px] text-gray-900 leading-tight line-clamp-2">{title || "Card Title"}</h4>
            <p className="text-[13px] text-gray-600 mt-1.5 leading-snug line-clamp-2">{description || "Card description"}</p>
          </div>
        </div>
      ) : (
        // Vertical Layout - Full width card matching Google Messages
        <>
          {imageUrl && (
            <div className={`w-full ${getImageHeight()} bg-gray-100 overflow-hidden`}>
              <img 
                src={imageUrl} 
                alt="Content" 
                className={`w-full h-full ${lockAspectRatio ? 'object-contain bg-gray-50' : 'object-cover'}`}
              />
            </div>
          )}
          <div className="p-3">
            <h4 className="font-medium text-[15px] text-gray-900 leading-tight mb-1">{title || "Card Title"}</h4>
            <p className="text-[13px] text-gray-600 leading-[1.4]">{description || "Card description text would appear here with more details."}</p>
          </div>
        </>
      )}
      
      {/* Action Buttons - Outlined style matching Google Messages */}
      {hasActions && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {actions.slice(0, 4).map((action, index) => (
            <button
              key={`action-${index}`}
              className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-colors border border-gray-300 flex items-center justify-center"
            >
              {/* Action type icons */}
              {action.type === "url" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
              {action.type === "dial" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
              {action.type === "calendar" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {action.type === "viewLocation" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {action.type === "shareLocation" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              {action.type === "openApp" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {action.type === "wallet" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )}
              {action.type === "maps" && (
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
              <span>{action.text}</span>
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
  // Calculate image height based on mediaHeight (iOS uses specific heights)
  const getImageHeight = () => {
    switch (mediaHeight) {
      case "short": return "h-28";  // ~112px 
      case "medium": return "h-42"; // ~168px
      case "tall": return "h-64";   // ~264px
      default: return "h-42";
    }
  };

  // iOS renders actions as list items in a tap-to-expand menu for rich cards
  // Following iOS Business Chat / Messages for Business patterns
  const hasActions = actions && actions.length > 0;

  return (
    <div className="max-w-[85%]">
      {cardOrientation === "horizontal" ? (
        // Horizontal Layout - Image on left, content on right
        <div className="flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-200">
          <div className="flex p-3 gap-3">
            {imageUrl && (
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="Content" 
                  className={`w-full h-full ${lockAspectRatio ? 'object-contain' : 'object-cover'}`} 
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[15px] text-black leading-tight line-clamp-2">{title || "Card Title"}</h4>
              <p className="text-[13px] text-gray-600 mt-1 line-clamp-2 leading-tight">{description || "Card description"}</p>
            </div>
          </div>
          
          {/* Action buttons for horizontal layout */}
          {hasActions && (
            <div className="border-t border-gray-200 px-3 py-2.5 flex flex-col gap-1">
              {actions.slice(0, 3).map((action, index) => (
                <button 
                  key={`action-${index}`}
                  className="w-full text-left py-2 px-2 text-[15px] text-blue-500 font-medium hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>{action.text}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              {actions.length > 3 && (
                <button className="w-full text-left py-2 px-2 text-[15px] text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                  See {actions.length - 3} more...
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Vertical Layout - Image on top, content below (Standard iOS RCS format)
        <div className="flex flex-col bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-200">
          {imageUrl && (
            <div className={`w-full ${getImageHeight()} bg-gray-100`}>
              <img 
                src={imageUrl} 
                alt="Content" 
                className={`w-full h-full ${lockAspectRatio ? 'object-contain' : 'object-cover'}`} 
              />
            </div>
          )}
          
          <div className="p-3">
            <h4 className="font-semibold text-[15px] text-black leading-tight">{title || "Card Title"}</h4>
            <p className="text-[13px] text-gray-600 mt-1.5 leading-snug line-clamp-3">{description || "Card description text would appear here with more details about the content."}</p>
          </div>
          
          {/* Action buttons for vertical layout - iOS style list */}
          {hasActions && (
            <div className="border-t border-gray-200 px-3 py-2 flex flex-col gap-0.5">
              {actions.slice(0, 3).map((action, index) => (
                <button 
                  key={`action-${index}`}
                  className="w-full text-left py-2.5 px-2 text-[15px] text-blue-500 font-medium hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>{action.text}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              {actions.length > 3 && (
                <button className="w-full text-left py-2.5 px-2 text-[15px] text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition-colors">
                  See {actions.length - 3} more options...
                </button>
              )}
            </div>
          )}
        </div>
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
    <div className="max-w-full relative mb-2">
      {/* Horizontal scrollable cards - iOS Business Chat style */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 snap-x snap-mandatory px-1">
        {items.map((item, index) => {
          // iOS action display rules (same as rich card)
          const textActions = item.actions.filter(a => a.type === "text");
          const nonTextActions = item.actions.filter(a => a.type !== "text");
          
          // For non-text actions: single shows directly, multiple show as "Options"
          const showSingleNonTextButton = nonTextActions.length === 1;
          const showNonTextOptionsButton = nonTextActions.length > 1;
          
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
                    
                    {/* Single non-text action - show directly */}
                    {showSingleNonTextButton && (
                      <button 
                        className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium"
                      >
                        {nonTextActions[0].text}
                      </button>
                    )}
                    
                    {/* Multiple non-text actions - show Options button */}
                    {showNonTextOptionsButton && (
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
                          {nonTextActions.map((action, actionIndex) => (
                            <button 
                              key={`nontext-${actionIndex}`}
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

// Android Chip List
export const AndroidChipList: React.FC<{
  messageText: string;
  actions: { type: string; text: string; value?: string }[];
  replies: { text: string; postbackData?: string }[];
}> = ({ messageText, actions, replies }) => {
  return (
    <div className="max-w-[85%]">
      {/* Message bubble with text */}
      {messageText && (
        <div className="bg-white rounded-2xl p-3 mb-2 shadow-sm">
          <p className="text-[14px] text-gray-900 leading-relaxed">{messageText}</p>
        </div>
      )}
      
      {/* Suggested Replies as chips */}
      {replies && replies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {replies.map((reply, index) => (
            <button
              key={`reply-${index}`}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-[13px] font-medium border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}
      
      {/* Action chips */}
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.slice(0, 4).map((action, index) => (
            <button
              key={`action-${index}`}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[13px] font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {action.type === "url" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
              {action.type === "dial" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
              {action.type === "calendar" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {action.type === "maps" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              )}
              {action.type === "wallet" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )}
              {action.type === "openApp" && (
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// iOS Chip List
export const IOSChipList: React.FC<{
  messageText: string;
  actions: { type: string; text: string; value?: string }[];
  replies: { text: string; postbackData?: string }[];
}> = ({ messageText, actions, replies }) => {
  return (
    <div className="max-w-[85%]">
      {/* Message bubble with text */}
      {messageText && (
        <div className="bg-gray-200 rounded-2xl p-3 mb-2">
          <p className="text-[14px] text-gray-900 leading-relaxed">{messageText}</p>
        </div>
      )}
      
      {/* Suggested Replies as rounded buttons */}
      {replies && replies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {replies.map((reply, index) => (
            <button
              key={`reply-${index}`}
              className="px-4 py-2 bg-white text-gray-900 rounded-full text-[13px] font-medium border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}
      
      {/* Action list items (iOS style) */}
      {actions && actions.length > 0 && (
        <div className="bg-white rounded-[18px] overflow-hidden shadow-sm border border-gray-200 divide-y divide-gray-200">
          {actions.slice(0, 4).map((action, index) => (
            <button
              key={`action-${index}`}
              className="w-full text-left py-3 px-4 text-[15px] text-blue-500 font-medium hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span>{action.text}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};