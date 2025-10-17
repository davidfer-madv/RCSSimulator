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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CarouselOptionsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
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

export function CarouselOptions({
  title,
  setTitle,
  description,
  setDescription,
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
}: CarouselOptionsProps) {
  const titleCharCount = title?.length || 0;
  const descriptionCharCount = description?.length || 0;
  const titleLimit = 200;
  const descriptionLimit = 2000;
  const titleExceeded = titleCharCount > titleLimit;
  const descriptionExceeded = descriptionCharCount > descriptionLimit;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Carousel:</strong> A horizontal scrollable collection of 2-10 rich cards. Each card will use the same title, description, and actions.
        </p>
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
                Each carousel card uses the same height. Prepare images accordingly.
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
          <Label htmlFor="card-title">Card Title (For All Cards)</Label>
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
          data-testid="input-card-title"
        />
        {titleExceeded && (
          <p className="text-xs text-red-500 mt-1">Title exceeds the maximum of {titleLimit} characters</p>
        )}
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="card-description">Card Description (For All Cards)</Label>
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
          data-testid="textarea-card-description"
        />
        {descriptionExceeded && (
          <p className="text-xs text-red-500 mt-1">
            Card description exceeds maximum of {descriptionLimit} characters
          </p>
        )}
      </div>

      <SuggestedActionsBuilder 
        actions={actions} 
        setActions={setActions} 
        maxActions={4} 
      />

      <SuggestedRepliesBuilder 
        replies={replies} 
        setReplies={setReplies} 
        maxReplies={11} 
      />
    </div>
  );
}
