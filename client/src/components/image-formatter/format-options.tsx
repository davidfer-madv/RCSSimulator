import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Action } from "@shared/schema";
import { PlusCircle, Info } from "lucide-react";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
  actions,
  setActions,
}: FormatOptionsProps) {
  const [newActionText, setNewActionText] = useState("");
  const [newActionType, setNewActionType] = useState<"url" | "phone" | "calendar">("url");
  const [newActionValue, setNewActionValue] = useState("");

  const addAction = () => {
    if (!newActionText || !newActionValue) return;

    const newAction: Action = {
      text: newActionText,
      type: newActionType,
      value: newActionValue,
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
                  onValueChange={(value) => setNewActionType(value as "url" | "phone" | "calendar")}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
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
                <Button
                  type="button"
                  size="sm"
                  onClick={addAction}
                  className="inline-flex items-center text-xs"
                  disabled={!newActionText || !newActionValue}
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Action
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
