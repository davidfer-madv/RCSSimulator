import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SuggestedReply, Action, Customer } from "@shared/schema";
import { SuggestedRepliesBuilder } from "./suggested-replies-builder";
import { SuggestedActionsBuilder } from "./suggested-actions-builder";
import { Info, Loader2 } from "lucide-react";
import { convertDpToPx } from "@/lib/media-size-converter";
import { validateIOSTitleLength, validateIOSDescriptionLength, getSafeZoneGuidance, isTextInSafeZone } from "@/lib/platform-validation";
import { CharacterCounter, SafeZoneIndicator, InlineValidationFeedback } from "./inline-validation-feedback";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichCardOptionsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  cardOrientation: "vertical" | "horizontal";
  setCardOrientation: (orientation: "vertical" | "horizontal") => void;
  mediaHeight: "short" | "medium" | "tall";
  setMediaHeight: (height: "short" | "medium" | "tall") => void;
  lockAspectRatio: boolean;
  setLockAspectRatio: (lock: boolean) => void;
  verificationSymbol: boolean;
  setVerificationSymbol: (verified: boolean) => void;
  actions: Action[];
  setActions: (actions: Action[]) => void;
  replies: SuggestedReply[];
  setReplies: (replies: SuggestedReply[]) => void;
  customers: Customer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  isLoadingCustomers?: boolean;
}

export function RichCardOptions({
  title,
  setTitle,
  description,
  setDescription,
  cardOrientation,
  setCardOrientation,
  mediaHeight,
  setMediaHeight,
  lockAspectRatio,
  setLockAspectRatio,
  verificationSymbol,
  setVerificationSymbol,
  actions,
  setActions,
  replies,
  setReplies,
  customers = [],
  selectedCustomerId = "",
  setSelectedCustomerId = () => {},
  isLoadingCustomers = false,
}: RichCardOptionsProps) {
  const titleCharCount = title?.length || 0;
  const descriptionCharCount = description?.length || 0;
  const titleLimit = 200;
  const descriptionLimit = 2000;
  const titleExceeded = titleCharCount > titleLimit;
  const descriptionExceeded = descriptionCharCount > descriptionLimit;
  
  // iOS-specific validation
  const iosTitleLimit = 102; // iOS rich card title limit before line break
  const iosDescLimit = 144; // iOS description visible characters (~3 lines)
  const titleExceedsIOS = titleCharCount > iosTitleLimit;
  const descExceedsIOS = descriptionCharCount > iosDescLimit;
  
  // Get safe zone guidance
  const safeZone = getSafeZoneGuidance(mediaHeight);
  const titleInSafeZone = isTextInSafeZone(title, safeZone.titleChars, 'ios');
  const descInSafeZone = isTextInSafeZone(description, safeZone.descriptionChars, 'ios');
  
  // Validate title and description
  const titleValidation = validateIOSTitleLength(title);
  const descValidation = validateIOSDescriptionLength(description);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Rich Card:</strong> A standalone card with media, text, and up to 4 actions and 11 replies.
        </p>
      </div>

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
          <SelectTrigger id="card-orientation" className="mt-1" data-testid="select-card-orientation">
            <SelectValue placeholder="Select card orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Vertical (Recommended)</SelectItem>
            <SelectItem value="horizontal">Horizontal</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <p className="font-semibold mb-2">Google RCS Media Heights:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Short:</strong> 112 DP → {convertDpToPx(112, 320)}px @ xhdpi, {convertDpToPx(112, 326)}px @ iOS 2x</p>
                <p><strong>Medium:</strong> 168 DP → {convertDpToPx(168, 320)}px @ xhdpi, {convertDpToPx(168, 326)}px @ iOS 2x</p>
                <p><strong>Tall:</strong> 264 DP → {convertDpToPx(264, 320)}px @ xhdpi, {convertDpToPx(264, 326)}px @ iOS 2x</p>
              </div>
              <p className="text-xs mt-2 text-gray-600">
                Recommended: Prepare images at ~340px height for Medium cards on most devices
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Select 
          value={mediaHeight}
          onValueChange={(value) => setMediaHeight(value as "short" | "medium" | "tall")}
        >
          <SelectTrigger id="media-height" className="mt-1" data-testid="select-media-height">
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
            data-testid="switch-lock-aspect-ratio"
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
        <Label htmlFor="customer-select">Business/Brand</Label>
        <Select 
          value={selectedCustomerId}
          onValueChange={setSelectedCustomerId}
          disabled={isLoadingCustomers}
        >
          <SelectTrigger id="customer-select" className="mt-1" data-testid="select-customer">
            <SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select business or brand"} />
          </SelectTrigger>
          <SelectContent>
            {isLoadingCustomers ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No businesses found</div>
            ) : (
              customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <div className="flex items-center mt-2">
          <Label htmlFor="verification-badge" className="mr-2">Verification Badge</Label>
          <Switch 
            id="verification-badge"
            checked={verificationSymbol}
            onCheckedChange={setVerificationSymbol}
            className="mr-2"
            data-testid="switch-verification"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center">
                  <Info className="ml-1 h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>The verification badge appears next to the business name in the preview.</p>
                <p className="text-xs mt-1">This simulates how officially verified businesses appear in RCS messaging.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="card-title">Card Title</Label>
          <div className="flex items-center gap-2">
            {titleExceedsIOS && (
              <span className="text-xs text-amber-600 font-medium">iOS: {titleCharCount}/102</span>
            )}
            <span className={`text-xs font-mono ${titleExceeded ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
              {titleCharCount}/{titleLimit}
            </span>
          </div>
        </div>
        <Input
          id="card-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product name or promotion"
          className={`mt-1 ${titleExceeded ? 'border-red-500' : titleExceedsIOS ? 'border-amber-400' : ''}`}
          maxLength={titleLimit}
          data-testid="input-card-title"
        />
        {titleExceeded && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            ⚠️ Title exceeds RCS maximum of {titleLimit} characters
          </p>
        )}
        {!titleExceeded && titleValidation && (
          <div className="mt-2">
            <InlineValidationFeedback
              type={titleValidation.severity as any}
              message={titleValidation.message}
              recommendation={titleValidation.recommendation}
              platform="ios"
              compact
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          💡 iOS rich cards: Keep under 102 characters to prevent line breaks
        </p>
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="card-description">Card Description</Label>
          <div className="flex items-center gap-2">
            {descExceedsIOS && (
              <span className="text-xs text-amber-600 font-medium">iOS: {descriptionCharCount}/144</span>
            )}
            <span className={`text-xs font-mono ${descriptionExceeded ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
              {descriptionCharCount}/{descriptionLimit}
            </span>
          </div>
        </div>
        <Textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description..."
          className={`mt-1 ${descriptionExceeded ? 'border-red-500' : descExceedsIOS ? 'border-amber-400' : ''}`}
          rows={3}
          data-testid="textarea-card-description"
        />
        {descriptionExceeded && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            ⚠️ Description exceeds RCS maximum of {descriptionLimit} characters
          </p>
        )}
        {!descriptionExceeded && descValidation && (
          <div className="mt-2">
            <InlineValidationFeedback
              type={descValidation.severity as any}
              message={descValidation.message}
              recommendation={descValidation.recommendation}
              platform="ios"
              compact
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          💡 iOS shows ~3 lines (144 chars) with "..." for longer text. Keep concise for iOS.
        </p>
      </div>

      <SuggestedActionsBuilder 
        actions={actions} 
        setActions={setActions} 
        maxActions={4} 
      />
      
      {/* iOS CTA Display Warning */}
      {actions.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-semibold">🍎 iOS: {actions.length} actions will display as expandable list</p>
              <p className="mt-1">
                On iOS, multiple actions appear in a collapsible menu with chevrons (›). 
                Users must tap to see all options. Place your primary CTA first for best engagement.
              </p>
              <p className="mt-1 font-medium">
                💡 Best practice: Use 1 primary CTA to avoid dropdown friction on iOS
              </p>
            </div>
          </div>
        </div>
      )}

      <SuggestedRepliesBuilder 
        replies={replies} 
        setReplies={setReplies} 
        maxReplies={11} 
      />
    </div>
  );
}
