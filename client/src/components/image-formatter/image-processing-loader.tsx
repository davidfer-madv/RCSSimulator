import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

type ImageProcessingLoaderProps = {
  isLoading: boolean;
  message?: string;
};

export const ImageProcessingLoader: React.FC<ImageProcessingLoaderProps> = ({ 
  isLoading, 
  message = "Processing image..." 
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-md"
    >
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-sm w-full mx-auto text-center">
        <Spinner size="lg" className="mb-4" />
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="h-1 bg-primary rounded-full my-4"
        />
        
        <h3 className="text-xl font-semibold mb-2">Image Processing</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
};