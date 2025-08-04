import React from 'react';
import verificationBadgeImg from '@/assets/verification_badge.svg';

// ============================================================================
// AUTHENTIC RCS UI COMPONENTS BASED ON GOOGLE'S OFFICIAL SPECIFICATIONS
// Updated for 2025 RCS Standards with proper dimensions and styling
// ============================================================================

// Action button interface matching RCS standards
interface RcsAction {
  type: "url" | "phone" | "postback";
  text: string;
  payload: string;
}

// Media height mapping according to RCS specifications
const getMediaHeight = (mediaHeight: "short" | "medium" | "tall") => {
  switch (mediaHeight) {
    case "short": return "h-28"; // 112 DP
    case "medium": return "h-42"; // 168 DP  
    case "tall": return "h-66"; // 264 DP
    default: return "h-42";
  }
};

// ============================================================================
// ANDROID MESSAGING UI COMPONENTS
// ============================================================================

export const AndroidStatusBar: React.FC = () => (
  <div className="bg-black px-4 py-1 flex items-center justify-between">
    <div className="text-white text-sm font-medium">9:41</div>
    <div className="flex items-center space-x-2">
      {/* Signal strength */}
      <div className="flex space-x-0.5">
        <div className="w-1 h-2 bg-white rounded-sm"></div>
        <div className="w-1 h-3 bg-white rounded-sm"></div>
        <div className="w-1 h-4 bg-white rounded-sm"></div>
        <div className="w-1 h-5 bg-white rounded-sm"></div>
      </div>
      {/* WiFi icon */}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8c3.5-3 8.5-3 12 0l-1.5 1.5c-2.5-2-5.5-2-8 0L2 8z"/>
        <path d="M4.5 10.5c2-1.5 5-1.5 7 0l-1.5 1.5c-1-1-2.5-1-3.5 0l-2-1.5z"/>
      </svg>
      {/* Battery */}
      <div className="flex items-center">
        <div className="w-6 h-3 border border-white rounded-sm flex items-center px-0.5">
          <div className="w-4 h-1.5 bg-white rounded-sm"></div>
        </div>
        <div className="w-0.5 h-1 bg-white rounded-r ml-0.5"></div>
      </div>
    </div>
  </div>
);

export const AndroidHeader: React.FC<{
  brandName: string;
  brandLogoUrl?: string;
  verificationSymbol?: boolean;
}> = ({ brandName, brandLogoUrl, verificationSymbol = true }) => (
  <div className="bg-blue-600 px-4 py-3 flex items-center shadow-sm">
    {/* Back arrow */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="mr-3">
      <path d="M15.5 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    {/* Brand logo */}
    <div className="flex-shrink-0 h-10 w-10 mr-3">
      {brandLogoUrl ? (
        <div className="h-10 w-10 rounded-full bg-white overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
          <img 
            src={brandLogoUrl} 
            alt="Brand logo" 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-sm">
          <span className="text-blue-600 text-lg font-bold">{brandName.charAt(0)}</span>
        </div>
      )}
    </div>
    
    {/* Brand name and verification */}
    <div className="flex-grow">
      <div className="flex items-center">
        <h1 className="text-white text-lg font-medium mr-2">{brandName}</h1>
        {verificationSymbol && (
          <img 
            src={verificationBadgeImg} 
            alt="Verified business" 
            className="h-5 w-5"
          />
        )}
      </div>
      <p className="text-blue-100 text-sm">RCS Business Messaging</p>
    </div>
    
    {/* Menu dots */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="5" r="2"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="12" cy="19" r="2"/>
    </svg>
  </div>
);

export const AndroidMessageBubble: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-4 flex justify-end">
    <div className="bg-blue-500 rounded-2xl rounded-tr-md py-3 px-4 max-w-[85%] shadow-sm">
      <p className="text-white text-base">{message}</p>
      <p className="text-blue-100 text-xs mt-1">9:41 AM</p>
    </div>
  </div>
);

export const AndroidInputBar: React.FC = () => (
  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
    <div className="flex items-center space-x-3">
      {/* Attachment icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#666" className="flex-shrink-0">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49"/>
      </svg>
      
      {/* Text input */}
      <div className="flex-grow bg-white rounded-full px-4 py-2 border border-gray-300 shadow-sm">
        <input 
          type="text" 
          placeholder="Text message"
          className="w-full text-base text-gray-700 bg-transparent outline-none"
          disabled
        />
      </div>
      
      {/* Send button */}
      <div className="bg-blue-500 rounded-full p-2 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M22 2L11 13"/>
          <path d="M22 2L15 22L11 13L2 9L22 2z"/>
        </svg>
      </div>
    </div>
  </div>
);

// ============================================================================
// RCS RICH CARD COMPONENT - COMPLIANT WITH GOOGLE SPECIFICATIONS
// ============================================================================

export const AndroidRichCard: React.FC<{
  title: string;
  description?: string;
  imageUrl?: string;
  cardOrientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
  lockAspectRatio?: boolean;
  actions: RcsAction[];
}> = ({
  title,
  description,
  imageUrl,
  cardOrientation = "vertical",
  mediaHeight = "medium",
  lockAspectRatio = true,
  actions
}) => {
  const mediaHeightClass = getMediaHeight(mediaHeight);
  
  return (
    <div className="mb-4 flex justify-start">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-[85%] min-w-[280px]">
        {/* Media section for vertical cards */}
        {cardOrientation === "vertical" && imageUrl && (
          <div className={`w-full ${mediaHeightClass} overflow-hidden`}>
            <img 
              src={imageUrl}
              alt={title}
              className={`w-full h-full ${lockAspectRatio ? 'object-cover' : 'object-contain'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Content section */}
        <div className={`${cardOrientation === "horizontal" ? "flex" : ""}`}>
          {/* Media section for horizontal cards */}
          {cardOrientation === "horizontal" && imageUrl && (
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
              <img 
                src={imageUrl}
                alt={title}
                className={`w-full h-full ${lockAspectRatio ? 'object-cover' : 'object-contain'}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Text content */}
          <div className="p-4 flex-grow">
            {/* Title - RCS spec: max 200 characters, 16SP font */}
            <h3 className="text-gray-900 text-lg font-semibold mb-2 leading-tight">
              {title.length > 200 ? `${title.substring(0, 197)}...` : title}
            </h3>
            
            {/* Description - RCS spec: max 2000 characters */}
            {description && (
              <p className="text-gray-700 text-base mb-4 leading-relaxed">
                {description.length > 2000 ? `${description.substring(0, 1997)}...` : description}
              </p>
            )}
            
            {/* Action buttons - RCS spec: max 4 buttons per card */}
            {actions.length > 0 && (
              <div className="space-y-2">
                {actions.slice(0, 4).map((action, index) => (
                  <RcsActionButton 
                    key={index}
                    action={action}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RCS ACTION BUTTON COMPONENT - AUTHENTIC STYLING
// ============================================================================

const RcsActionButton: React.FC<{
  action: RcsAction;
  isFirst?: boolean;
}> = ({ action, isFirst = false }) => {
  const getButtonIcon = () => {
    switch (action.type) {
      case "url":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"/>
          </svg>
        );
      case "phone":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        );
      case "postback":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const buttonStyle = isFirst
    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";

  return (
    <button className={`
      w-full flex items-center justify-center px-4 py-3 rounded-lg 
      text-sm font-medium transition-colors duration-200
      ${buttonStyle}
    `}>
      {getButtonIcon()}
      <span className="truncate">
        {action.text.length > 25 ? `${action.text.substring(0, 22)}...` : action.text}
      </span>
    </button>
  );
};

// ============================================================================
// RCS CAROUSEL COMPONENT - 2025 SPECIFICATIONS
// ============================================================================

export const AndroidCarousel: React.FC<{
  items: Array<{
    title: string;
    description?: string;
    imageUrl?: string;
    actions: RcsAction[];
  }>;
  mediaHeight?: "short" | "medium" | "tall";
  lockAspectRatio?: boolean;
}> = ({ items, mediaHeight = "medium", lockAspectRatio = true }) => {
  // RCS spec: Max 10 cards per carousel
  const carouselItems = items.slice(0, 10);
  
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-[85%]">
        {/* Carousel container - Medium carousel: 296 DP width */}
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide" style={{ width: '296px' }}>
          {carouselItems.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <AndroidRichCard
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                cardOrientation="vertical"
                mediaHeight={mediaHeight}
                lockAspectRatio={lockAspectRatio}
                actions={item.actions}
              />
            </div>
          ))}
        </div>
        
        {/* Carousel indicator dots */}
        {carouselItems.length > 1 && (
          <div className="flex justify-center space-x-2 mt-2">
            {carouselItems.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// iOS MESSAGING UI COMPONENTS (Updated for RCS compliance)
// ============================================================================

export const iOSStatusBar: React.FC = () => (
  <div className="bg-black px-4 py-1 flex items-center justify-between">
    <div className="text-white text-sm font-medium">9:41</div>
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

export const iOSHeader: React.FC<{
  brandName: string;
  brandLogoUrl?: string;
  verificationSymbol?: boolean;
}> = ({ brandName, brandLogoUrl, verificationSymbol = true }) => (
  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
    <div className="flex items-center">
      <div className="text-blue-500 mr-3">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14L2 8L8 2" stroke="#007AFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="flex-shrink-0 h-10 w-10 mr-3">
        {brandLogoUrl ? (
          <div className="h-10 w-10 rounded-full bg-white overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
            <img 
              src={brandLogoUrl} 
              alt="Brand logo" 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
            <span className="text-lg font-medium text-gray-700">{brandName.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="text-lg font-medium text-gray-900 flex items-center">
          <span>{brandName}</span>
          {verificationSymbol && (
            <img 
              src={verificationBadgeImg} 
              alt="Verified" 
              className="h-5 w-5 ml-2"
            />
          )}
        </div>
        <p className="text-sm text-gray-500">Business</p>
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
  <div className="mb-4 flex justify-end">
    <div className="bg-blue-500 rounded-2xl rounded-tr-md py-3 px-4 max-w-[85%] shadow-sm">
      <p className="text-white text-base">{message}</p>
      <p className="text-blue-100 text-xs mt-1">9:41 AM</p>
    </div>
  </div>
);

export const iOSInputBar: React.FC = () => (
  <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
    <div className="flex items-center space-x-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 12H19" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      
      <div className="flex-grow p-3 bg-white border border-gray-300 rounded-full shadow-sm">
        <input 
          type="text" 
          placeholder="Text Message - RCS"
          className="w-full text-base text-gray-700 bg-transparent outline-none"
          disabled
        />
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
    </div>
  </div>
);

// iOS Rich Card (using same component as Android for consistency)
export const IOSRichCard = AndroidRichCard;
export const IOSCarousel = AndroidCarousel;