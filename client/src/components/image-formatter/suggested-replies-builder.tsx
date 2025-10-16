import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SuggestedReply } from "@shared/schema";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface SuggestedRepliesBuilderProps {
  replies: SuggestedReply[];
  setReplies: (replies: SuggestedReply[]) => void;
  maxReplies?: number;
}

export function SuggestedRepliesBuilder({
  replies,
  setReplies,
  maxReplies = 11,
}: SuggestedRepliesBuilderProps) {
  const [replyText, setReplyText] = useState("");
  const [postbackData, setPostbackData] = useState("");

  const resetForm = () => {
    setReplyText("");
    setPostbackData("");
  };

  const addReply = () => {
    if (!replyText || replyText.length > 25) return;

    const newReply: SuggestedReply = {
      text: replyText,
      postbackData: postbackData || undefined,
    };

    setReplies([...replies, newReply]);
    resetForm();
  };

  const removeReply = (index: number) => {
    const newReplies = [...replies];
    newReplies.splice(index, 1);
    setReplies(newReplies);
  };

  const replyTextExceeded = replyText.length > 25;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="block">Suggested Replies</Label>
        <Badge variant="outline" className="ml-2">
          {replies.length} of {maxReplies} max
        </Badge>
      </div>

      {/* Display existing replies */}
      <div className="space-y-2">
        {replies.map((reply, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <div className="flex-1">
              <div className="font-medium text-sm">{reply.text}</div>
              {reply.postbackData && (
                <div className="text-xs text-gray-500">Postback: {reply.postbackData}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeReply(index)}
              className="h-8 w-8 p-0"
              data-testid={`button-remove-reply-${index}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new reply form */}
      {replies.length < maxReplies && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <Label htmlFor="reply-text">Reply Text</Label>
            <Input
              id="reply-text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Yes, please"
              maxLength={25}
              className={replyTextExceeded ? "border-red-500" : ""}
              data-testid="input-reply-text"
            />
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${replyTextExceeded ? 'text-red-500' : 'text-gray-500'}`}>
                {replyText.length}/25 characters
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="reply-postback">Postback Data (Optional)</Label>
            <Input
              id="reply-postback"
              value={postbackData}
              onChange={(e) => setPostbackData(e.target.value)}
              placeholder="reply_yes"
              maxLength={2048}
              data-testid="input-reply-postback"
            />
            <p className="text-xs text-gray-500 mt-1">
              Data sent back to your server when user selects this reply
            </p>
          </div>

          <Button
            type="button"
            onClick={addReply}
            disabled={!replyText || replyTextExceeded}
            className="w-full"
            data-testid="button-add-reply"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Reply
          </Button>
        </div>
      )}
    </div>
  );
}
