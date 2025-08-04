import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grip, X, Plus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  actions: Array<{
    text: string;
    type: "url" | "phone" | "postback";
    payload: string;
  }>;
}

interface DragDropCardsProps {
  cards: CarouselCard[];
  onCardsChange: (cards: CarouselCard[]) => void;
  onCardEdit: (card: CarouselCard) => void;
  onCardRemove: (cardId: string) => void;
  onAddCard: () => void;
  maxCards?: number;
}

export function DragDropCards({
  cards,
  onCardsChange,
  onCardEdit,
  onCardRemove,
  onAddCard,
  maxCards = 10
}: DragDropCardsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newCards = [...cards];
    const draggedCard = newCards[draggedIndex];
    
    // Remove the dragged card
    newCards.splice(draggedIndex, 1);
    
    // Insert at new position (adjust index if necessary)
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newCards.splice(insertIndex, 0, draggedCard);
    
    onCardsChange(newCards);
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const getComplianceIssues = (card: CarouselCard): string[] => {
    const issues: string[] = [];
    
    if (!card.title || card.title.length < 1) {
      issues.push("Title is required");
    }
    
    if (card.title && card.title.length > 200) {
      issues.push("Title exceeds 200 characters");
    }
    
    if (card.description && card.description.length > 2000) {
      issues.push("Description exceeds 2000 characters");
    }
    
    if (card.actions.length === 0) {
      issues.push("At least one action is required");
    }
    
    if (card.actions.length > 4) {
      issues.push("Maximum 4 actions allowed");
    }
    
    card.actions.forEach((action, index) => {
      if (!action.text || action.text.length === 0) {
        issues.push(`Action ${index + 1}: Text is required`);
      }
      
      if (action.text && action.text.length > 25) {
        issues.push(`Action ${index + 1}: Text exceeds 25 characters`);
      }
      
      if (action.type === "url" && action.payload && !isValidUrl(action.payload)) {
        issues.push(`Action ${index + 1}: Invalid URL format`);
      }
      
      if (action.type === "phone" && action.payload && !isValidPhone(action.payload)) {
        issues.push(`Action ${index + 1}: Invalid phone format`);
      }
    });
    
    return issues;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone: string): boolean => {
    // Basic phone validation - should start with + and contain only digits, spaces, hyphens, parentheses
    return /^\+?[\d\s\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Carousel Cards ({cards.length}/{maxCards})</h3>
        <Button
          onClick={onAddCard}
          disabled={cards.length >= maxCards}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>

      <div className="space-y-3">
        {cards.map((card, index) => {
          const issues = getComplianceIssues(card);
          const hasIssues = issues.length > 0;
          
          return (
            <Card
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "cursor-move transition-all duration-200",
                draggedIndex === index && "opacity-50 scale-95",
                dragOverIndex === index && draggedIndex !== index && "border-blue-500 bg-blue-50/50",
                hasIssues && "border-red-300 bg-red-50/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Grip className="h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Card {index + 1}</span>
                      {hasIssues && (
                        <Badge variant="destructive" className="text-xs">
                          {issues.length} issue{issues.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCardEdit(card)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCardRemove(card.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Card Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {card.imageUrl && (
                      <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                        Image Preview
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">
                        {card.title || "Untitled Card"}
                      </h4>
                      {card.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {card.description}
                        </p>
                      )}
                    </div>
                    
                    {card.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {card.actions.map((action, actionIndex) => (
                          <Badge
                            key={actionIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {action.text || `Action ${actionIndex + 1}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Compliance Issues */}
                  {hasIssues && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-red-800 mb-2">
                        RCS Compliance Issues:
                      </h5>
                      <ul className="space-y-1">
                        {issues.map((issue, issueIndex) => (
                          <li key={issueIndex} className="text-xs text-red-700 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {cards.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 mb-4">No cards added yet</p>
              <Button onClick={onAddCard} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-800">RCS Carousel Guidelines</span>
        </div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Minimum 2 cards, maximum {maxCards} cards per carousel</li>
          <li>• Each card must have a title (max 200 characters)</li>
          <li>• Description is optional (max 2,000 characters)</li>
          <li>• Each card must have 1-4 action buttons</li>
          <li>• Button text limited to 25 characters</li>
          <li>• Drag cards to reorder them in the carousel</li>
        </ul>
      </div>
    </div>
  );
}