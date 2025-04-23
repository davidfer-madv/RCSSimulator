import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Action } from "@shared/schema";
import { PlusCircle, Info, BadgeCheck, Upload } from "lucide-react";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface FormatOptionsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formatType: "richCard" | "carousel";
  setFormatType: (formatType: "richCard" | "carousel") => void;
  cardOrientation: "vertical" | "horizontal";
  setCardOrientation: (orientation: "vertical" | "horizontal") => void;
  mediaHeight: "short" | "medium" | "tall";
  setMediaHeight: (height: "short" | "medium" | "tall") => void;
  lockAspectRatio?: boolean;
  setLockAspectRatio?: (lock: boolean) => void;
  brandLogoUrl?: string;
  setBrandLogoUrl?: (url: string) => void;
  verificationSymbol?: boolean;
  setVerificationSymbol?: (verified: boolean) => void;
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export function FormatOptions({
  title,
  setTitle,
  description,
  setDescription,
  formatType,
  setFormatType,
  cardOrientation,
  setCardOrientation,
  mediaHeight,
  setMediaHeight,
  lockAspectRatio = true,
  setLockAspectRatio = () => {},
  brandLogoUrl = "",
  setBrandLogoUrl = () => {},
  verificationSymbol = false,
  setVerificationSymbol = () => {},
  actions,
  setActions,
}: FormatOptionsProps) {
  const [newActionText, setNewActionText] = useState("");
  const [newActionType, setNewActionType] = useState<"url" | "phone" | "calendar" | "text">("url");
  const [newActionValue, setNewActionValue] = useState("");

  const addAction = () => {
    if (!newActionText) return;
    
    // For text type actions, value is optional
    if (newActionType !== 'text' && !newActionValue) return;

    const newAction: Action = {
      text: newActionText,
      type: newActionType,
      value: newActionType === 'text' ? '' : newActionValue,
    };

    setActions([...actions, newAction]);
    setNewActionText("");
    setNewActionValue("");
  };

  const removeAction = (index: number) => {
    const newActions = [...actions];
    newActions.splice(index, 1);
    setActions(newActions);
  };

  // Calculate character count and limit warnings
  const titleCharCount = title?.length || 0;
  const descriptionCharCount = description?.length || 0;
  const titleLimit = 200;
  const descriptionLimit = 2000;
  const titleExceeded = titleCharCount > titleLimit;
  const descriptionExceeded = descriptionCharCount > descriptionLimit;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="format-type">RCS Format Type</Label>
        <Select 
          value={formatType}
          onValueChange={(value) => setFormatType(value as "richCard" | "carousel")}
        >
          <SelectTrigger id="format-type" className="mt-1">
            <SelectValue placeholder="Select format type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="richCard">Rich Card (Single Image)</SelectItem>
            <SelectItem value="carousel">Carousel (Multiple Images)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formatType === "richCard" && (
        <div>
          <Label htmlFor="card-orientation">Card Orientation</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center">
                  <Info className="ml-1 h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>Vertical cards have the image on top with text below. Horizontal cards have the image on one side with text on the other.</p>
                <p className="text-xs mt-1">For consistency with iOS, vertical rich cards with horizontal media images are recommended.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select 
            value={cardOrientation}
            onValueChange={(value) => setCardOrientation(value as "vertical" | "horizontal")}
          >
            <SelectTrigger id="card-orientation" className="mt-1">
              <SelectValue placeholder="Select card orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical (Recommended)</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="media-height">Media Height</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center">
                <Info className="ml-1 h-4 w-4 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <p>Following Google RCS standards:</p>
              <p>- Short: 112 DP</p>
              <p>- Medium: 168 DP</p>
              <p>- Tall: 264 DP</p>
              <p className="text-xs mt-1">Recommended image size: Max 1500x1000 pixels, ~1.8MB in JPEG format</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Select 
          value={mediaHeight}
          onValueChange={(value) => setMediaHeight(value as "short" | "medium" | "tall")}
        >
          <SelectTrigger id="media-height" className="mt-1">
            <SelectValue placeholder="Select media height" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (112 DP)</SelectItem>
            <SelectItem value="medium">Medium (168 DP)</SelectItem>
            <SelectItem value="tall">Tall (264 DP)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="lock-aspect-ratio"
            checked={lockAspectRatio}
            onCheckedChange={setLockAspectRatio}
          />
          <Label htmlFor="lock-aspect-ratio">Lock Aspect Ratio</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center">
                  <Info className="ml-1 h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>When enabled, images will maintain their original proportions within RCS format constraints.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div>
        <div className="flex items-center">
          <Label htmlFor="brand-logo" className="mb-1">Brand Logo</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center">
                  <Info className="ml-1 h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>Brand logo displays in the header section of RCS cards. Recommended size: Square, 224x224 pixels.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-10 h-10 border rounded-md overflow-hidden">
              {brandLogoUrl ? (
                <img 
                  src={brandLogoUrl} 
                  alt="Brand logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-medium">Upload or enter URL</div>
              <div className="text-xs text-gray-500">Square image recommended (224x224px)</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              id="brand-logo"
              type="url"
              value={brandLogoUrl}
              onChange={(e) => setBrandLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="flex-1"
            />
            <div className="relative">
              <input
                type="file"
                id="logo-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const objectUrl = URL.createObjectURL(file);
                    setBrandLogoUrl(objectUrl);
                  }
                }}
              />
              <Button type="button" size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-1" />
                Browse
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="card-title">Card Title</Label>
          <span className={`text-xs ${titleExceeded ? 'text-red-500' : 'text-gray-500'}`}>
            {titleCharCount}/{titleLimit}
          </span>
        </div>
        <Input
          id="card-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product name or promotion"
          className={`mt-1 ${titleExceeded ? 'border-red-500' : ''}`}
          maxLength={titleLimit}
        />
        {titleExceeded && (
          <p className="text-xs text-red-500 mt-1">Title exceeds the maximum of {titleLimit} characters</p>
        )}
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="card-description">Card Description</Label>
          <span className={`text-xs ${descriptionExceeded ? 'text-red-500' : 'text-gray-500'}`}>
            {descriptionCharCount}/{descriptionLimit}
          </span>
        </div>
        <Textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description..."
          className={`mt-1 ${descriptionExceeded ? 'border-red-500' : ''}`}
          rows={3}
          maxLength={descriptionLimit}
        />
        {descriptionExceeded && (
          <p className="text-xs text-red-500 mt-1">Description exceeds the maximum of {descriptionLimit} characters</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Note: While the limit is 2000 characters, iOS might truncate to around 144 characters (3 lines).
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Label className="block">Suggested Actions</Label>
          <Badge variant="outline" className="ml-2">
            {actions.length} of 4 max
          </Badge>
        </div>
        <div className="space-y-2 mt-2">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={action.text} disabled className="flex-1" />
              <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                {action.type.toUpperCase()}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500"
                onClick={() => removeAction(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {actions.length < 4 && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  placeholder="Action button text"
                  className="flex-1"
                />
                <Select
                  value={newActionType}
                  onValueChange={(value) => setNewActionType(value as "url" | "phone" | "calendar" | "text")}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                {newActionType !== 'text' && (
                  <Input
                    value={newActionValue}
                    onChange={(e) => setNewActionValue(e.target.value)}
                    placeholder={
                      newActionType === "url"
                        ? "https://example.com"
                        : newActionType === "phone"
                        ? "+1234567890"
                        : "2023-10-25T10:00:00"
                    }
                    className="flex-1"
                  />
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={addAction}
                  className="inline-flex items-center text-xs"
                  disabled={
                    !newActionText || 
                    (newActionType !== 'text' && !newActionValue)
                  }
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  {newActionType === 'text' ? 'Add Reply' : 'Add Action'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
