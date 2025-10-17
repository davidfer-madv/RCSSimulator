import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { ValidationWarning } from "@/lib/platform-validation";

interface ValidationPanelProps {
  warnings: ValidationWarning[];
  iosWarnings: ValidationWarning[];
  androidWarnings: ValidationWarning[];
}

export function ValidationPanel({ warnings, iosWarnings, androidWarnings }: ValidationPanelProps) {
  const errors = warnings.filter(w => w.severity === 'error');
  const warningItems = warnings.filter(w => w.severity === 'warning');
  const infoItems = warnings.filter(w => w.severity === 'info');
  
  const hasIssues = warnings.length > 0;
  
  if (!hasIssues) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">All validations passed!</p>
              <p className="text-sm text-green-700">Your format is optimized for both Android and iOS.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          Platform Validation
          {errors.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {errors.length} Error{errors.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {warningItems.length > 0 && (
            <Badge variant="default" className="text-xs bg-amber-500">
              {warningItems.length} Warning{warningItems.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {infoItems.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {infoItems.length} Info
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Errors */}
        {errors.map((warning, index) => (
          <Alert key={`error-${index}`} variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold flex items-center gap-2">
              {warning.message}
              {warning.platform !== 'both' && (
                <Badge variant="outline" className="text-xs">
                  {warning.platform === 'ios' ? '🍎 iOS' : '📱 Android'}
                </Badge>
              )}
            </AlertTitle>
            {warning.recommendation && (
              <AlertDescription className="text-xs mt-1">
                <strong>Fix:</strong> {warning.recommendation}
              </AlertDescription>
            )}
          </Alert>
        ))}
        
        {/* Warnings */}
        {warningItems.map((warning, index) => (
          <Alert key={`warning-${index}`} className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-sm font-semibold flex items-center gap-2 text-amber-900">
              {warning.message}
              {warning.platform !== 'both' && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${warning.platform === 'ios' ? 'border-blue-300 text-blue-700' : 'border-green-300 text-green-700'}`}
                >
                  {warning.platform === 'ios' ? '🍎 iOS Only' : '📱 Android Only'}
                </Badge>
              )}
            </AlertTitle>
            {warning.recommendation && (
              <AlertDescription className="text-xs mt-1 text-amber-800">
                <strong>Recommendation:</strong> {warning.recommendation}
              </AlertDescription>
            )}
          </Alert>
        ))}
        
        {/* Info */}
        {infoItems.map((warning, index) => (
          <Alert key={`info-${index}`} className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-sm font-semibold flex items-center gap-2 text-blue-900">
              {warning.message}
              {warning.platform !== 'both' && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${warning.platform === 'ios' ? 'border-blue-400 text-blue-700' : 'border-green-400 text-green-700'}`}
                >
                  {warning.platform === 'ios' ? '🍎 iOS' : '📱 Android'}
                </Badge>
              )}
            </AlertTitle>
            {warning.recommendation && (
              <AlertDescription className="text-xs mt-1 text-blue-800">
                {warning.recommendation}
              </AlertDescription>
            )}
          </Alert>
        ))}
        
        {/* Platform-Specific Summary */}
        {(iosWarnings.length > 0 || androidWarnings.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Platform-Specific Issues:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <p className="text-xs font-medium text-blue-900">
                  🍎 iOS: {iosWarnings.length} issue{iosWarnings.length !== 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-blue-700 mt-1">
                  {iosWarnings.length === 0 
                    ? 'Optimized for iOS' 
                    : 'Check iOS preview for display'}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-xs font-medium text-green-900">
                  📱 Android: {androidWarnings.length} issue{androidWarnings.length !== 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-green-700 mt-1">
                  {androidWarnings.length === 0 
                    ? 'Optimized for Android' 
                    : 'Check Android preview'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

