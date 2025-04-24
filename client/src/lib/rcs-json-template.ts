/**
 * RCS JSON Template for RBM API
 * This file provides a template for generating RCS JSON payloads
 * compatible with the Google RCS Business Messaging API
 */
import { Action } from "@shared/schema";

interface RichCardParams {
  title: string;
  description: string;
  imageUrl: string;
  mediaHeight?: string;
  orientation?: string;
  suggestions?: Action[];
  brandDisplayName?: string;
  verificationStatus?: boolean;
  msisdn?: string;
}

interface CarouselCardContent {
  title: string;
  description: string;
  imageUrl: string;
  mediaHeight?: string;
  suggestions?: Action[];
}

interface CarouselParams {
  cards: CarouselCardContent[];
  cardWidth?: string;
  suggestions?: Action[];
  brandDisplayName?: string;
  verificationStatus?: boolean;
  msisdn?: string;
}

/**
 * Generate a Rich Card JSON payload for RBM API
 * @param param0 Card parameters
 * @returns RBM API compatible JSON object
 */
export function generateRichCardJson({
  title,
  description,
  imageUrl,
  mediaHeight = 'MEDIUM',
  orientation = 'VERTICAL',
  suggestions = [],
  brandDisplayName = '',
  verificationStatus = true,
  msisdn = '+12223334444' // Default recipient phone number
}: RichCardParams) {
  // Convert our action types to RBM suggestion types
  const rbmSuggestions = suggestions.map(action => {
    if (action.type === 'text') {
      return {
        reply: {
          text: action.text,
          postbackData: `reply_${action.text}`,
        }
      };
    } else if (action.type === 'url') {
      return {
        action: {
          text: action.text,
          postbackData: `action_url_${action.text}`,
          openUrlAction: {
            url: action.value
          }
        }
      };
    } else if (action.type === 'phone') {
      return {
        action: {
          text: action.text,
          postbackData: `action_phone_${action.text}`,
          dialAction: {
            phoneNumber: action.value
          }
        }
      };
    } else if (action.type === 'calendar') {
      // Parse date value into event details
      // This is simplified; in a real implementation, you would parse the date properly
      return {
        action: {
          text: action.text,
          postbackData: `action_calendar_${action.text}`,
          createCalendarEventAction: {
            startTime: action.value,
            endTime: action.value, // Simplification
            title: `Event: ${action.text}`
          }
        }
      };
    }
    
    // Default fallback
    return {
      reply: {
        text: action.text,
        postbackData: `suggestion_${action.text}`,
      }
    };
  });

  // Create the RBM API compatible JSON
  return {
    rbmApiHelper: {
      sendRichCard: {
        params: {
          messageText: title,
          messageDescription: description,
          msisdn: msisdn,
          suggestions: rbmSuggestions,
          imageUrl: imageUrl,
          height: mediaHeight.toUpperCase(),
          orientation: orientation.toUpperCase(),
          brandDisplayName: brandDisplayName,
          isVerified: verificationStatus
        }
      }
    }
  };
}

/**
 * Generate a Carousel JSON payload for RBM API
 * @param param0 Carousel parameters
 * @returns RBM API compatible JSON object
 */
export function generateCarouselJson({
  cards = [],
  cardWidth = 'MEDIUM',
  suggestions = [],
  brandDisplayName = '',
  verificationStatus = true,
  msisdn = '+12223334444' // Default recipient phone number
}: CarouselParams) {
  // Convert cards to RBM card content
  const rbmCards = cards.map(card => ({
    title: card.title,
    description: card.description,
    media: {
      height: card.mediaHeight?.toUpperCase() || 'MEDIUM',
      contentInfo: {
        fileUrl: card.imageUrl,
        forceRefresh: true
      }
    },
    suggestions: card.suggestions || []
  }));

  // Create the RBM API compatible JSON
  return {
    rbmApiHelper: {
      sendCarousel: {
        params: {
          msisdn: msisdn,
          cardWidth: cardWidth.toUpperCase(),
          cardContents: rbmCards,
          suggestions: suggestions,
          brandDisplayName: brandDisplayName,
          isVerified: verificationStatus
        }
      }
    }
  };
}