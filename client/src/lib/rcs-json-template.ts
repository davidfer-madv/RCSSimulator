/**
 * RCS JSON Template for RBM API
 * This file provides a template for generating RCS JSON payloads
 * compatible with the Google RCS Business Messaging API
 */
import { Action, SuggestedReply } from "@shared/schema";

interface RichCardParams {
  title: string;
  description: string;
  imageUrl: string;
  mediaHeight?: string;
  orientation?: string;
  actions?: Action[];
  replies?: SuggestedReply[];
  brandDisplayName?: string;
  verificationStatus?: boolean;
  msisdn?: string;
}

interface CarouselCardContent {
  title: string;
  description: string;
  imageUrl: string;
  mediaHeight?: string;
  actions?: Action[];
  replies?: SuggestedReply[];
}

interface CarouselParams {
  cards: CarouselCardContent[];
  cardWidth?: string;
  actions?: Action[];
  replies?: SuggestedReply[];
  brandDisplayName?: string;
  verificationStatus?: boolean;
  msisdn?: string;
}

// Convert our app actions and replies to RBM suggestion objects
function toRbmSuggestions(actions: Action[] = [], replies: SuggestedReply[] = []) {
  const actionSuggestions = actions.map((action) => {
    if (action.type === "url") {
      return {
        action: {
          text: action.text,
          postbackData: action.postbackData ?? `action_url_${action.text}`,
          openUrlAction: {
            url: action.url,
          },
        },
      };
    }

    if (action.type === "dial") {
      return {
        action: {
          text: action.text,
          postbackData: action.postbackData ?? `action_dial_${action.text}`,
          dialAction: {
            phoneNumber: action.phoneNumber,
          },
        },
      };
    }

    if (action.type === "calendar") {
      return {
        action: {
          text: action.text,
          postbackData: action.postbackData ?? `action_calendar_${action.text}`,
          createCalendarEventAction: {
            startTime: action.startTime,
            endTime: action.endTime,
            title: action.title,
            description: action.description ?? undefined,
          },
        },
      };
    }

    if (action.type === "viewLocation") {
      return {
        action: {
          text: action.text,
          postbackData: action.postbackData ?? `action_view_location_${action.text}`,
          viewLocationAction: {
            latitude: action.latitude,
            longitude: action.longitude,
            label: action.label ?? undefined,
          },
        },
      };
    }

    if (action.type === "shareLocation") {
      return {
        action: {
          text: action.text,
          postbackData: action.postbackData ?? `action_share_location_${action.text}`,
          shareLocationAction: {},
        },
      };
    }

    // Fallback
    return {
      action: {
        text: action.text,
        postbackData: action.postbackData ?? `action_${action.text}`,
      },
    };
  });

  const replySuggestions = replies.map((reply) => ({
    reply: {
      text: reply.text,
      postbackData: reply.postbackData ?? `reply_${reply.text}`,
    },
  }));

  return [...actionSuggestions, ...replySuggestions];
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
  actions = [],
  replies = [],
  brandDisplayName = '',
  verificationStatus = true,
  msisdn = '+12223334444' // Default recipient phone number
}: RichCardParams) {
  const suggestions = toRbmSuggestions(actions, replies);

  return {
    rbmApiHelper: {
      sendRichCard: {
        params: {
          messageText: title,
          messageDescription: description,
          msisdn,
          suggestions,
          imageUrl,
          height: mediaHeight.toUpperCase(),
          orientation: orientation.toUpperCase(),
          brandDisplayName,
          isVerified: verificationStatus,
        },
      },
    },
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
  actions = [],
  replies = [],
  brandDisplayName = '',
  verificationStatus = true,
  msisdn = '+12223334444' // Default recipient phone number
}: CarouselParams) {
  const topLevelSuggestions = toRbmSuggestions(actions, replies);

  const rbmCards = cards.map((card) => ({
    title: card.title,
    description: card.description,
    media: {
      height: card.mediaHeight?.toUpperCase() || 'MEDIUM',
      contentInfo: {
        fileUrl: card.imageUrl,
        forceRefresh: true,
      },
    },
    suggestions: toRbmSuggestions(card.actions || [], card.replies || []),
  }));

  return {
    rbmApiHelper: {
      sendCarousel: {
        params: {
          msisdn,
          cardWidth: cardWidth.toUpperCase(),
          cardContents: rbmCards,
          suggestions: topLevelSuggestions,
          brandDisplayName,
          isVerified: verificationStatus,
        },
      },
    },
  };
}