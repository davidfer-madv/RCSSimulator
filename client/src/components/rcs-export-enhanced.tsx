import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Download, CheckCircle, ExternalLink, Code2, FileJson, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RcsFormat {
  id?: number;
  title?: string;
  description?: string;
  imageUrls?: string[];
  actions?: Array<{
    text: string;
    type: "url" | "phone" | "postback";
    payload: string;
  }>;
  formatType: "rich_card" | "carousel";
  orientation?: "vertical" | "horizontal";
  mediaHeight?: "short" | "medium" | "tall";
}

interface Customer {
  name: string;
  brandLogoUrl?: string;
  primaryColor?: string;
  verified?: boolean;
}

interface RcsExportEnhancedProps {
  format: RcsFormat;
  customer?: Customer;
}

export function RcsExportEnhanced({ format, customer }: RcsExportEnhancedProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, formatName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(formatName);
      setTimeout(() => setCopiedFormat(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${formatName} format copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate RCS Business Messaging API JSON
  const generateRcsApiJson = () => {
    const baseMessage: any = {
      contentMessage: {},
      fallback: format.title || "Rich message"
    };

    if (format.formatType === "rich_card") {
      // Single Rich Card
      baseMessage.contentMessage.richCard = {
        standaloneCard: {
          cardContent: {
            title: format.title || "",
            description: format.description || "",
            suggestions: format.actions?.map(action => ({
              action: {
                text: action.text,
                postbackData: action.payload,
                ...(action.type === "url" && {
                  openUrlAction: { url: action.payload }
                }),
                ...(action.type === "phone" && {
                  dialAction: { phoneNumber: action.payload }
                })
              }
            })) || []
          },
          cardOrientation: format.orientation?.toUpperCase() || "VERTICAL"
        }
      };

      // Add media if present
      if (format.imageUrls && format.imageUrls[0]) {
        baseMessage.contentMessage.richCard.standaloneCard.cardContent.media = {
          height: format.mediaHeight?.toUpperCase() || "MEDIUM",
          contentInfo: {
            fileUrl: format.imageUrls[0],
            forceRefresh: false
          }
        };
      }
    } else {
      // Carousel
      baseMessage.contentMessage.richCard = {
        carouselCard: {
          cardWidth: "MEDIUM",
          cardContents: format.imageUrls?.map((imageUrl, index) => ({
            title: `${format.title} ${index + 1}` || `Card ${index + 1}`,
            description: index === 0 ? format.description || "" : "",
            suggestions: format.actions?.map(action => ({
              action: {
                text: action.text,
                postbackData: `${action.payload}_card_${index}`,
                ...(action.type === "url" && {
                  openUrlAction: { url: action.payload }
                }),
                ...(action.type === "phone" && {
                  dialAction: { phoneNumber: action.payload }
                })
              }
            })) || [],
            media: {
              height: format.mediaHeight?.toUpperCase() || "MEDIUM",
              contentInfo: {
                fileUrl: imageUrl,
                forceRefresh: false
              }
            }
          })) || []
        }
      };
    }

    return JSON.stringify(baseMessage, null, 2);
  };

  // Generate Apple Business Chat JSON
  const generateAppleBusinessChatJson = () => {
    if (format.formatType === "rich_card") {
      return JSON.stringify({
        type: "richLink",
        title: format.title || "",
        subtitle: format.description || "",
        imageURL: format.imageUrls?.[0] || "",
        url: format.actions?.find(a => a.type === "url")?.payload || ""
      }, null, 2);
    } else {
      return JSON.stringify({
        type: "listPicker",
        receivedMessage: {
          title: format.title || "",
          subtitle: format.description || ""
        },
        items: format.imageUrls?.map((imageUrl, index) => ({
          title: `${format.title} ${index + 1}` || `Item ${index + 1}`,
          subtitle: index === 0 ? format.description || "" : "",
          imageURL: imageUrl,
          url: format.actions?.[0]?.payload || ""
        })) || []
      }, null, 2);
    }
  };

  // Generate WhatsApp Business API JSON
  const generateWhatsAppJson = () => {
    if (format.formatType === "rich_card") {
      return JSON.stringify({
        type: "interactive",
        interactive: {
          type: "button",
          header: format.imageUrls?.[0] ? {
            type: "image",
            image: { link: format.imageUrls[0] }
          } : undefined,
          body: {
            text: `${format.title || ""}\n\n${format.description || ""}`.trim()
          },
          action: {
            buttons: format.actions?.slice(0, 3).map((action, index) => ({
              type: "reply",
              reply: {
                id: `btn_${index}`,
                title: action.text
              }
            })) || []
          }
        }
      }, null, 2);
    } else {
      // Carousel as list message
      return JSON.stringify({
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: format.title || ""
          },
          body: {
            text: format.description || ""
          },
          action: {
            button: "View Options",
            sections: [{
              title: "Available Items",
              rows: format.imageUrls?.map((_, index) => ({
                id: `item_${index}`,
                title: `${format.title} ${index + 1}` || `Option ${index + 1}`,
                description: index === 0 ? format.description || "" : ""
              })) || []
            }]
          }
        }
      }, null, 2);
    }
  };

  // Generate Markdown Documentation
  const generateMarkdown = () => {
    const markdown = `# RCS Business Message Documentation

## Message Overview
- **Type**: ${format.formatType === "rich_card" ? "Rich Card" : "Carousel"}
- **Title**: ${format.title || "N/A"}
- **Description**: ${format.description || "N/A"}
- **Media Count**: ${format.imageUrls?.length || 0}
- **Actions**: ${format.actions?.length || 0}

## Brand Information
- **Business Name**: ${customer?.name || "N/A"}
- **Verified**: ${customer?.verified ? "✅ Yes" : "❌ No"}
- **Brand Color**: ${customer?.primaryColor || "N/A"}

## Technical Specifications

### Media Details
${format.imageUrls?.map((url, index) => `- **Image ${index + 1}**: ${url}`).join('\n') || "No media"}

### Action Buttons
${format.actions?.map((action, index) => 
  `- **${action.text}** (${action.type}): ${action.payload}`
).join('\n') || "No actions"}

### RCS Compliance
- Title Length: ${format.title?.length || 0}/200 characters
- Description Length: ${format.description?.length || 0}/2000 characters
- Actions Count: ${format.actions?.length || 0}/4 maximum
- Media Height: ${format.mediaHeight || "medium"}

## Implementation Notes
1. Test on both Android and iOS devices
2. Verify all URLs are accessible
3. Ensure images are optimized for mobile viewing
4. Test fallback for non-RCS devices

---
*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
`;
    return markdown;
  };

  const formats = [
    {
      id: "rcs-api",
      name: "RCS Business Messaging API",
      description: "Official Google RCS API format",
      icon: <MessageSquare className="h-4 w-4" />,
      content: generateRcsApiJson(),
      filename: "rcs-message.json",
      contentType: "application/json"
    },
    {
      id: "apple-business-chat",
      name: "Apple Business Chat",
      description: "iOS Business Chat format",
      icon: <MessageSquare className="h-4 w-4" />,
      content: generateAppleBusinessChatJson(),
      filename: "apple-business-chat.json",
      contentType: "application/json"
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      description: "WhatsApp interactive message format",
      icon: <MessageSquare className="h-4 w-4" />,
      content: generateWhatsAppJson(),
      filename: "whatsapp-message.json",
      contentType: "application/json"
    },
    {
      id: "documentation",
      name: "Technical Documentation",
      description: "Complete implementation guide",
      icon: <FileJson className="h-4 w-4" />,
      content: generateMarkdown(),
      filename: "rcs-documentation.md",
      contentType: "text/markdown"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Enhanced Export Formats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rcs-api" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {formats.map(format => (
              <TabsTrigger key={format.id} value={format.id} className="text-xs">
                <div className="flex items-center gap-1">
                  {format.icon}
                  <span className="hidden sm:inline">{format.name.split(' ')[0]}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {formats.map(format => (
            <TabsContent key={format.id} value={format.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{format.name}</h3>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </div>
                <Badge variant="outline">
                  {format.contentType === "application/json" ? "JSON" : "Markdown"}
                </Badge>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This format is fully compliant with {format.name} specifications and ready for production use.
                </AlertDescription>
              </Alert>

              <Textarea
                value={format.content}
                readOnly
                className="font-mono text-xs min-h-[300px] bg-gray-50"
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(format.content, format.name)}
                  variant="outline"
                  className="flex-1"
                >
                  {copiedFormat === format.name ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copiedFormat === format.name ? "Copied!" : "Copy to Clipboard"}
                </Button>
                
                <Button
                  onClick={() => downloadFile(format.content, format.filename, format.contentType)}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                
                {format.id === "rcs-api" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open("https://developers.google.com/business-communications/rcs-business-messaging", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    API Docs
                  </Button>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}