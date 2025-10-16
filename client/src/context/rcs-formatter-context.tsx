import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { Action, SuggestedReply } from "@shared/schema";

// Define the shape of our RCS formatter context
type RcsFormatterState = {
  selectedImages: File[];
  title: string;
  description: string;
  messageText: string;
  formatType: "message" | "richCard" | "carousel";
  cardOrientation: "vertical" | "horizontal";
  mediaHeight: "short" | "medium" | "tall";
  lockAspectRatio: boolean;
  brandLogoUrl: string;
  verificationSymbol: boolean;
  actions: Action[];
  replies: SuggestedReply[];
  selectedCustomerId: string;
  processedImageUrls: string[];
};

type RcsFormatterContextType = {
  state: RcsFormatterState;
  updateState: (newState: Partial<RcsFormatterState>) => void;
  resetState: () => void;
};

// Default state
const defaultState: RcsFormatterState = {
  selectedImages: [],
  title: "",
  description: "",
  messageText: "",
  formatType: "richCard",
  cardOrientation: "vertical", 
  mediaHeight: "medium",
  lockAspectRatio: false,
  brandLogoUrl: "",
  verificationSymbol: true,
  actions: [],
  replies: [],
  selectedCustomerId: "",
  processedImageUrls: [],
};

// Create the context
const RcsFormatterContext = createContext<RcsFormatterContextType | null>(null);

// Provider component
export function RcsFormatterProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [state, setState] = useState<RcsFormatterState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('rcsFormatterState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // We can't store File objects in localStorage, so we need to handle that separately
          return { ...parsedState, selectedImages: [], processedImageUrls: [] };
        } catch (error) {
          console.error("Error parsing saved RCS formatter state:", error);
        }
      }
    }
    return defaultState;
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create a version of the state without File objects that can be stored in localStorage
      const stateForStorage = {
        ...state,
        selectedImages: [], // Can't store File objects
        processedImageUrls: [], // Don't store temporary URLs
      };
      localStorage.setItem('rcsFormatterState', JSON.stringify(stateForStorage));
    }
  }, [state]);

  // Update state function
  const updateState = (newState: Partial<RcsFormatterState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  // Reset state function
  const resetState = () => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rcsFormatterState');
    }
  };

  // Create context value
  const contextValue = {
    state,
    updateState,
    resetState,
  };

  return (
    <RcsFormatterContext.Provider value={contextValue}>
      {children}
    </RcsFormatterContext.Provider>
  );
}

// Hook to use the context
export function useRcsFormatter() {
  const context = useContext(RcsFormatterContext);
  
  if (!context) {
    throw new Error("useRcsFormatter must be used within a RcsFormatterProvider");
  }
  
  return context;
}