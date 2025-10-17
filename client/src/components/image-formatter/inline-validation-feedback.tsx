import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface InlineValidationFeedbackProps {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  recommendation?: string;
  platform?: 'ios' | 'android' | 'both';
  compact?: boolean;
}

export function InlineValidationFeedback({ 
  type, 
  message, 
  recommendation,
  platform = 'both',
  compact = false 
}: InlineValidationFeedbackProps) {
  const icons = {
    error: <AlertCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />
  };
  
  const colors = {
    error: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-green-200 bg-green-50 text-green-900'
  };
  
  const platformBadge = platform !== 'both' ? (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
      platform === 'ios' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
    }`}>
      {platform === 'ios' ? '🍎 iOS' : '📱 Android'}
    </span>
  ) : null;

  if (compact) {
    return (
      <div className={`flex items-start gap-2 p-2 rounded-md text-xs ${colors[type]}`}>
        {icons[type]}
        <div className="flex-1">
          <p className="font-medium">{message} {platformBadge}</p>
          {recommendation && (
            <p className="text-[11px] mt-0.5 opacity-90">{recommendation}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Alert className={colors[type]}>
      {icons[type]}
      <AlertDescription className="text-xs">
        <p className="font-medium flex items-center gap-2">
          {message}
          {platformBadge}
        </p>
        {recommendation && (
          <p className="mt-1 text-[11px] opacity-90">
            <strong>Tip:</strong> {recommendation}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Character counter with iOS-specific warnings
 */
interface CharacterCounterProps {
  current: number;
  max: number;
  iosMax?: number;
  label: string;
}

export function CharacterCounter({ current, max, iosMax, label }: CharacterCounterProps) {
  const isOverMax = current > max;
  const isOverIOSMax = iosMax && current > iosMax;
  
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        {isOverIOSMax && iosMax && (
          <span className="text-amber-600 font-medium">
            iOS: {current}/{iosMax}
          </span>
        )}
        <span className={`font-mono ${isOverMax ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          {current}/{max}
        </span>
        {isOverMax && <AlertCircle className="h-3 w-3 text-red-600" />}
        {!isOverMax && isOverIOSMax && <AlertTriangle className="h-3 w-3 text-amber-600" />}
      </div>
    </div>
  );
}

/**
 * Safe zone indicator for text placement
 */
interface SafeZoneIndicatorProps {
  inSafeZone: boolean;
  platform: 'ios' | 'android';
}

export function SafeZoneIndicator({ inSafeZone, platform }: SafeZoneIndicatorProps) {
  if (platform === 'android') return null; // Android shows all text
  
  return (
    <div className={`flex items-center gap-2 p-2 rounded-md text-xs ${
      inSafeZone 
        ? 'bg-green-50 text-green-800 border border-green-200' 
        : 'bg-amber-50 text-amber-800 border border-amber-200'
    }`}>
      {inSafeZone ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Text within iOS safe zone - fully visible</span>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          <span>Text may be truncated on iOS with ellipsis (...)</span>
        </>
      )}
    </div>
  );
}

