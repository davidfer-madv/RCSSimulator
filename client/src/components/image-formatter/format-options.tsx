import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Action, SuggestedReply, Customer } from "@shared/schema";
import { MessageOptions } from "./message-options";
import { RichCardOptions } from "./rich-card-options";
import { CarouselOptions } from "./carousel-options";

interface FormatOptionsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  formatType: "message" | "richCard" | "carousel";
  setFormatType: (formatType: "message" | "richCard" | "carousel") => void;
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
  replies: SuggestedReply[];
  setReplies: (replies: SuggestedReply[]) => void;
  customers: Customer[];
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  isLoadingCustomers?: boolean;
}

export function FormatOptions({
  title,
  setTitle,
  description,
  setDescription,
  messageText,
  setMessageText,
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
  replies,
  setReplies,
  customers = [],
  selectedCustomerId = "",
  setSelectedCustomerId = () => {},
  isLoadingCustomers = false,
}: FormatOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Format Type Selector - Shared across all formats */}
      <div>
        <Label htmlFor="format-type">RCS Format Type</Label>
        <Select 
          value={formatType}
          onValueChange={(value) => setFormatType(value as "message" | "richCard" | "carousel")}
        >
          <SelectTrigger id="format-type" className="mt-1" data-testid="select-format-type">
            <SelectValue placeholder="Select format type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="message">Simple Message</SelectItem>
            <SelectItem value="richCard">Rich Card (Single Image)</SelectItem>
            <SelectItem value="carousel">Carousel (Multiple Images)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional rendering based on format type */}
      {formatType === "message" && (
        <MessageOptions
          messageText={messageText}
          setMessageText={setMessageText}
          replies={replies}
          setReplies={setReplies}
          actions={actions}
          setActions={setActions}
        />
      )}

      {formatType === "richCard" && (
        <RichCardOptions
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          cardOrientation={cardOrientation}
          setCardOrientation={setCardOrientation}
          mediaHeight={mediaHeight}
          setMediaHeight={setMediaHeight}
          lockAspectRatio={lockAspectRatio}
          setLockAspectRatio={setLockAspectRatio}
          verificationSymbol={verificationSymbol}
          setVerificationSymbol={setVerificationSymbol}
          actions={actions}
          setActions={setActions}
          replies={replies}
          setReplies={setReplies}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          isLoadingCustomers={isLoadingCustomers}
        />
      )}

      {formatType === "carousel" && (
        <CarouselOptions
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          mediaHeight={mediaHeight}
          setMediaHeight={setMediaHeight}
          lockAspectRatio={lockAspectRatio}
          setLockAspectRatio={setLockAspectRatio}
          verificationSymbol={verificationSymbol}
          setVerificationSymbol={setVerificationSymbol}
          actions={actions}
          setActions={setActions}
          replies={replies}
          setReplies={setReplies}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          isLoadingCustomers={isLoadingCustomers}
        />
      )}
    </div>
  );
}
