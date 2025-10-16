import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestedReply, Action } from "@shared/schema";
import { SuggestedRepliesBuilder } from "./suggested-replies-builder";
import { SuggestedActionsBuilder } from "./suggested-actions-builder";

interface MessageOptionsProps {
  messageText: string;
  setMessageText: (text: string) => void;
  replies: SuggestedReply[];
  setReplies: (replies: SuggestedReply[]) => void;
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export function MessageOptions({
  messageText,
  setMessageText,
  replies,
  setReplies,
  actions,
  setActions,
}: MessageOptionsProps) {
  const messageTextCount = messageText?.length || 0;
  const messageTextLimit = 2000;
  const messageTextExceeded = messageTextCount > messageTextLimit;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Simple Message:</strong> Send a text message with optional suggested replies and actions.
        </p>
      </div>

      <div>
        <div className="flex justify-between">
          <Label htmlFor="message-text">Message Text</Label>
          <span className={`text-xs ${messageTextExceeded ? 'text-red-500' : 'text-gray-500'}`}>
            {messageTextCount}/{messageTextLimit}
          </span>
        </div>
        <Textarea
          id="message-text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message here..."
          className={`mt-1 ${messageTextExceeded ? 'border-red-500' : ''}`}
          rows={5}
          data-testid="textarea-message-text"
        />
        {messageTextExceeded && (
          <p className="text-xs text-red-500 mt-1">
            Message text exceeds the maximum of {messageTextLimit} characters
          </p>
        )}
      </div>

      <SuggestedRepliesBuilder 
        replies={replies} 
        setReplies={setReplies} 
        maxReplies={11} 
      />

      <SuggestedActionsBuilder 
        actions={actions} 
        setActions={setActions} 
        maxActions={4} 
      />
    </div>
  );
}
