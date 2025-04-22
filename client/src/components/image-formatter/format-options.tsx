import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Action } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface FormatOptionsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formatType: "richCard" | "carousel";
  setFormatType: (formatType: "richCard" | "carousel") => void;
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

      <div>
        <Label htmlFor="card-title">Card Title</Label>
        <Input
          id="card-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product name or promotion"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="card-description">Card Description</Label>
        <Textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label className="block mb-2">Suggested Actions</Label>
        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}
