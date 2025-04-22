import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, X } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  onImagesSelected,
  maxImages = 10,
}: ImageUploaderProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; reason: string }[] = [];

    for (const file of files) {
      // Check file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        invalidFiles.push({ file, reason: "Invalid file type. Only JPG, PNG, and WebP are supported." });
        continue;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push({ file, reason: "File too large. Maximum size is 10MB." });
        continue;
      }

      validFiles.push(file);
    }

    return { validFiles, invalidFiles };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      processFiles(filesArray);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      processFiles(filesArray);
    }
  };

  const processFiles = (filesArray: File[]) => {
    // Check if we're exceeding the max number of images
    if (selectedImages.length + filesArray.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can upload a maximum of ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    const { validFiles, invalidFiles } = validateFiles(filesArray);

    if (invalidFiles.length > 0) {
      // Show toast for invalid files
      toast({
        title: `${invalidFiles.length} file(s) not added`,
        description: invalidFiles.map(item => `${item.file.name}: ${item.reason}`).join(", "),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      const newImages = [...selectedImages, ...validFiles];
      setSelectedImages(newImages);
      onImagesSelected(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    onImagesSelected(newImages);
  };

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex justify-center px-6 pt-5 pb-6 border-2 ${
          dragActive ? "border-primary" : "border-gray-300"
        } border-dashed rounded-md h-40 relative`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2 text-center flex flex-col items-center justify-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none"
            >
              <span onClick={onButtonClick}>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {selectedImages.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full z-10"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-2">
                <div className="h-24 w-full overflow-hidden rounded-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
