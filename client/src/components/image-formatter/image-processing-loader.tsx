import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { ProcessingStage } from "@/lib/image-processing";

type ImageProcessingLoaderProps = {
  isLoading: boolean;
  stage?: ProcessingStage;
  progress?: number;
  message?: string;
};

export const ImageProcessingLoader: React.FC<ImageProcessingLoaderProps> = ({ 
  isLoading, 
  stage = ProcessingStage.INIT,
  progress = 0,
  message
}) => {
  if (!isLoading) return null;

  // Use the provided message or fall back to the stage message
  const displayMessage = message || stage;
  
  // Determine if there was an error
  const isError = stage === ProcessingStage.ERROR;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-md"
    >
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-sm w-full mx-auto text-center">
        {!isError ? (
          <Spinner size="lg" className="mb-4" />
        ) : (
          <div className="w-16 h-16 mx-auto mb-4 text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        )}
        
        {!isError && (
          <motion.div
            className="w-full bg-secondary h-2 rounded-full overflow-hidden my-4"
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut"
              }}
              className="h-full bg-primary rounded-full"
            />
          </motion.div>
        )}
        
        <h3 className={`text-xl font-semibold mb-2 ${isError ? 'text-destructive' : ''}`}>
          {isError ? 'Processing Error' : 'Image Processing'}
        </h3>
        <p className="text-muted-foreground">{displayMessage}</p>
        
        {isError && (
          <button 
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
};