import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
  thumbnailImageAlignment?: "left" | "right";
  imageAlignment?: "left" | "right";
  mediaHeight?: "short" | "medium" | "tall";
}

interface ComplianceIssue {
  type: "error" | "warning" | "info";
  category: "structure" | "content" | "actions" | "images" | "formatting";
  message: string;
  field?: string;
  suggestion?: string;
}

interface RcsComplianceCheckerProps {
  format: RcsFormat;
  showAllChecks?: boolean;
}

export function RcsComplianceChecker({ format, showAllChecks = false }: RcsComplianceCheckerProps) {
  const issues = validateRcsFormat(format);
  const errors = issues.filter(issue => issue.type === "error");
  const warnings = issues.filter(issue => issue.type === "warning");
  const infos = issues.filter(issue => issue.type === "info");

  const isCompliant = errors.length === 0;

  return (
    <Card className={cn(
      "border-2",
      isCompliant ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isCompliant ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          RCS Specification Compliance
          <Badge variant={isCompliant ? "default" : "destructive"} className="ml-auto">
            {isCompliant ? "Compliant" : `${errors.length} Error${errors.length !== 1 ? 's' : ''}`}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              errors.length === 0 ? "text-green-600" : "text-red-600"
            )}>
              {errors.length}
            </div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              warnings.length === 0 ? "text-green-600" : "text-yellow-600"
            )}>
              {warnings.length}
            </div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {infos.length}
            </div>
            <div className="text-sm text-gray-600">Info</div>
          </div>
        </div>

        {/* Issues List */}
        {(showAllChecks || issues.length > 0) && (
          <div className="space-y-3">
            {errors.map((issue, index) => (
              <Alert key={`error-${index}`} variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="space-y-1">
                  <div className="font-medium">{issue.message}</div>
                  {issue.suggestion && (
                    <div className="text-sm opacity-90">
                      💡 {issue.suggestion}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}

            {warnings.map((issue, index) => (
              <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="space-y-1">
                  <div className="font-medium text-yellow-800">{issue.message}</div>
                  {issue.suggestion && (
                    <div className="text-sm text-yellow-700">
                      💡 {issue.suggestion}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}

            {showAllChecks && infos.map((issue, index) => (
              <Alert key={`info-${index}`} className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="space-y-1">
                  <div className="font-medium text-blue-800">{issue.message}</div>
                  {issue.suggestion && (
                    <div className="text-sm text-blue-700">
                      💡 {issue.suggestion}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Success Message */}
        {isCompliant && !showAllChecks && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your RCS message format meets all compliance requirements and is ready for deployment.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function validateRcsFormat(format: RcsFormat): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Required fields validation
  if (!format.title || format.title.trim().length === 0) {
    issues.push({
      type: "error",
      category: "content",
      message: "Title is required for RCS messages",
      field: "title",
      suggestion: "Add a descriptive title that summarizes your message content"
    });
  }

  // Title length validation
  if (format.title && format.title.length > 200) {
    issues.push({
      type: "error",
      category: "content",
      message: `Title exceeds maximum length (${format.title.length}/200 characters)`,
      field: "title",
      suggestion: "Shorten your title to 200 characters or less"
    });
  }

  // Description length validation
  if (format.description && format.description.length > 2000) {
    issues.push({
      type: "error",
      category: "content",
      message: `Description exceeds maximum length (${format.description.length}/2000 characters)`,
      field: "description",
      suggestion: "Shorten your description to 2000 characters or less"
    });
  }

  // Actions validation
  if (!format.actions || format.actions.length === 0) {
    issues.push({
      type: "error",
      category: "actions",
      message: "At least one action button is required",
      field: "actions",
      suggestion: "Add buttons for users to interact with your message"
    });
  }

  if (format.actions && format.actions.length > 4) {
    issues.push({
      type: "error",
      category: "actions",
      message: `Too many actions (${format.actions.length}/4 maximum)`,
      field: "actions",
      suggestion: "Remove some actions or combine similar ones"
    });
  }

  // Individual action validation
  format.actions?.forEach((action, index) => {
    if (!action.text || action.text.trim().length === 0) {
      issues.push({
        type: "error",
        category: "actions",
        message: `Action ${index + 1}: Button text is required`,
        field: `actions[${index}].text`,
        suggestion: "Add descriptive text for this button"
      });
    }

    if (action.text && action.text.length > 25) {
      issues.push({
        type: "error",
        category: "actions",
        message: `Action ${index + 1}: Button text too long (${action.text.length}/25 characters)`,
        field: `actions[${index}].text`,
        suggestion: "Shorten button text to 25 characters or less"
      });
    }

    if (action.type === "url") {
      if (!action.payload || !isValidUrl(action.payload)) {
        issues.push({
          type: "error",
          category: "actions",
          message: `Action ${index + 1}: Invalid or missing URL`,
          field: `actions[${index}].payload`,
          suggestion: "Provide a valid HTTP or HTTPS URL"
        });
      }
    }

    if (action.type === "phone") {
      if (!action.payload || !isValidPhone(action.payload)) {
        issues.push({
          type: "error",
          category: "actions",
          message: `Action ${index + 1}: Invalid phone number format`,
          field: `actions[${index}].payload`,
          suggestion: "Use international format with country code (e.g., +1234567890)"
        });
      }
    }

    if (action.type === "postback" && (!action.payload || action.payload.length === 0)) {
      issues.push({
        type: "warning",
        category: "actions",
        message: `Action ${index + 1}: Postback payload is empty`,
        field: `actions[${index}].payload`,
        suggestion: "Add a payload to identify this button interaction"
      });
    }
  });

  // Image validation
  if (format.imageUrls && format.imageUrls.length > 0) {
    format.imageUrls.forEach((url, index) => {
      if (!isValidUrl(url)) {
        issues.push({
          type: "error",
          category: "images",
          message: `Image ${index + 1}: Invalid URL format`,
          field: `imageUrls[${index}]`,
          suggestion: "Provide a valid HTTP or HTTPS URL for the image"
        });
      }
    });

    // Carousel specific validation
    if (format.formatType === "carousel") {
      if (format.imageUrls.length < 2) {
        issues.push({
          type: "error",
          category: "structure",
          message: "Carousel requires at least 2 cards",
          field: "imageUrls",
          suggestion: "Add more cards or switch to rich card format"
        });
      }

      if (format.imageUrls.length > 10) {
        issues.push({
          type: "error",
          category: "structure",
          message: `Too many carousel cards (${format.imageUrls.length}/10 maximum)`,
          field: "imageUrls",
          suggestion: "Remove some cards or split into multiple carousels"
        });
      }
    }
  }

  // Format-specific validation
  if (format.formatType === "carousel" && (!format.imageUrls || format.imageUrls.length === 0)) {
    issues.push({
      type: "warning",
      category: "structure",
      message: "Carousel format typically includes images for each card",
      suggestion: "Consider adding images to make your carousel more engaging"
    });
  }

  // Accessibility warnings
  if (format.imageUrls && format.imageUrls.length > 0 && (!format.description || format.description.trim().length === 0)) {
    issues.push({
      type: "warning",
      category: "content",
      message: "Images should have descriptive text for accessibility",
      suggestion: "Add a description that explains what the image shows"
    });
  }

  // Best practices
  if (format.title && format.title.length < 10) {
    issues.push({
      type: "info",
      category: "content",
      message: "Short titles may not provide enough context",
      suggestion: "Consider adding more descriptive text to help users understand the message"
    });
  }

  if (format.actions && format.actions.length === 1) {
    issues.push({
      type: "info",
      category: "actions",
      message: "Single action button - consider adding more interaction options",
      suggestion: "Multiple buttons can improve user engagement"
    });
  }

  return issues;
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidPhone(phone: string): boolean {
  // Basic phone validation - should start with + and contain only digits, spaces, hyphens, parentheses
  const cleanPhone = phone.replace(/\D/g, '');
  return /^\+?[\d\s\-\(\)]+$/.test(phone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
}