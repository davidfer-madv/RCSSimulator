/**
 * Platform Logic Engine
 * Validates content against iOS and Android RCS specifications
 * Provides warnings and recommendations for optimal cross-platform delivery
 */

export interface ValidationWarning {
  severity: 'error' | 'warning' | 'info';
  platform: 'ios' | 'android' | 'both';
  message: string;
  recommendation?: string;
}

export interface PlatformValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  iosSpecific: ValidationWarning[];
  androidSpecific: ValidationWarning[];
}

/**
 * Validate title length for iOS rich cards and carousels
 * iOS limitation: Max 102 characters before line break causes truncation
 */
export function validateIOSTitleLength(title: string): ValidationWarning | null {
  if (!title) return null;
  
  const titleLength = title.length;
  
  if (titleLength > 102) {
    return {
      severity: 'warning',
      platform: 'ios',
      message: `Title exceeds iOS limit (${titleLength}/102 characters)`,
      recommendation: 'iOS will truncate or break title to multiple lines. Keep under 102 characters for single-line display on iOS rich cards and carousels.'
    };
  }
  
  if (titleLength > 60) {
    return {
      severity: 'info',
      platform: 'ios',
      message: `Title may wrap to 2 lines on iOS (${titleLength} characters)`,
      recommendation: 'For optimal iOS display, keep titles under 60 characters for single-line presentation.'
    };
  }
  
  return null;
}

/**
 * Validate description length for iOS (truncates at ~144 characters / 3 lines)
 */
export function validateIOSDescriptionLength(description: string): ValidationWarning | null {
  if (!description) return null;
  
  const descLength = description.length;
  
  if (descLength > 144) {
    return {
      severity: 'warning',
      platform: 'ios',
      message: `Description will be truncated on iOS (${descLength} characters, ~${Math.ceil(descLength / 48)} lines)`,
      recommendation: 'iOS displays max 3 lines (~144 characters) with ellipsis. Keep descriptions concise for iOS users.'
    };
  }
  
  return null;
}

/**
 * Validate image format compatibility
 */
export function validateImageFormat(fileName: string, mimeType: string): ValidationWarning | null {
  const isGif = mimeType === 'image/gif' || fileName.toLowerCase().endsWith('.gif');
  const isWebP = mimeType === 'image/webp' || fileName.toLowerCase().endsWith('.webp');
  
  if (isGif) {
    return {
      severity: 'warning',
      platform: 'ios',
      message: 'GIF format not supported on iOS',
      recommendation: 'iOS does not support GIF images (animated or static). This image will not display on iOS devices. Use JPEG or PNG for cross-platform compatibility.'
    };
  }
  
  if (isWebP) {
    return {
      severity: 'info',
      platform: 'ios',
      message: 'WebP may have limited iOS support',
      recommendation: 'While WebP is supported on newer iOS versions, JPEG is recommended for maximum compatibility.'
    };
  }
  
  return null;
}

/**
 * Validate image aspect ratio (recommended: 2:1 for RCS)
 */
export function validateImageAspectRatio(width: number, height: number): ValidationWarning | null {
  const aspectRatio = width / height;
  const targetRatio = 2.0; // 2:1 recommended for RCS
  const tolerance = 0.1; // 10% tolerance
  
  if (Math.abs(aspectRatio - targetRatio) > tolerance) {
    return {
      severity: 'info',
      platform: 'both',
      message: `Image aspect ratio is ${(aspectRatio).toFixed(2)}:1 (recommended: 2:1)`,
      recommendation: 'Images may be cropped differently on Android (object-cover) vs iOS (object-contain). Preview both platforms to check display.'
    };
  }
  
  return null;
}

/**
 * Validate image dimensions for RCS compliance
 */
export function validateImageDimensions(width: number, height: number): ValidationWarning | null {
  const maxWidth = 1500;
  const maxHeight = 1000;
  
  if (width > maxWidth || height > maxHeight) {
    return {
      severity: 'error',
      platform: 'both',
      message: `Image exceeds RCS limits (${width}×${height}px, max: 1500×1000px)`,
      recommendation: 'Image will be automatically scaled down. For best quality, resize before upload.'
    };
  }
  
  // Warn if image is too small
  if (width < 300 || height < 150) {
    return {
      severity: 'warning',
      platform: 'both',
      message: `Image may appear pixelated (${width}×${height}px)`,
      recommendation: 'For Medium height cards, use at least 680×340px. For Tall cards, use 1060×530px.'
    };
  }
  
  return null;
}

/**
 * Validate number of CTAs for iOS (iOS prefers single CTA to avoid dropdown)
 */
export function validateIOSCTACount(actionCount: number): ValidationWarning | null {
  if (actionCount === 0) return null;
  
  if (actionCount > 1) {
    return {
      severity: 'info',
      platform: 'ios',
      message: `${actionCount} actions will show as dropdown on iOS`,
      recommendation: 'iOS displays multiple actions in a collapsible list. For best UX, use 1 primary CTA. If multiple CTAs needed, prioritize the most important one first.'
    };
  }
  
  return null;
}

/**
 * Validate carousel card count (recommended: max 3 cards for better UX)
 */
export function validateCarouselCount(imageCount: number): ValidationWarning | null {
  if (imageCount < 2) {
    return {
      severity: 'error',
      platform: 'both',
      message: 'Carousel requires at least 2 images',
      recommendation: 'Upload 2-10 images to create a carousel. For single image, use Rich Card format instead.'
    };
  }
  
  if (imageCount > 3) {
    return {
      severity: 'info',
      platform: 'both',
      message: `${imageCount} cards may cause scroll fatigue`,
      recommendation: 'Best practice: Limit to 3 cards per carousel for better engagement. Users often don\'t scroll beyond the 3rd card.'
    };
  }
  
  if (imageCount > 10) {
    return {
      severity: 'error',
      platform: 'both',
      message: `Too many images (${imageCount}/10 max)`,
      recommendation: 'RCS allows maximum 10 images per carousel. Remove some images or create multiple carousels.'
    };
  }
  
  return null;
}

/**
 * Validate text safe zone for media cropping
 * Ensures important text won't be cut off if image is cropped
 */
export function validateTextSafeZone(
  title: string, 
  description: string, 
  mediaHeight: 'short' | 'medium' | 'tall'
): ValidationWarning | null {
  const titleLength = title?.length || 0;
  const descLength = description?.length || 0;
  
  // For tall media, more text may be hidden above the fold
  if (mediaHeight === 'tall' && (titleLength > 50 || descLength > 100)) {
    return {
      severity: 'info',
      platform: 'both',
      message: 'Tall media may push text below fold on smaller screens',
      recommendation: 'With tall media (264 DP), keep title under 50 chars and description under 100 chars to ensure visibility without scrolling.'
    };
  }
  
  return null;
}

/**
 * Validate line breaks in description (iOS may compress)
 */
export function validateLineBreaks(text: string): ValidationWarning | null {
  if (!text) return null;
  
  const lineBreaks = (text.match(/\n/g) || []).length;
  
  if (lineBreaks > 2) {
    return {
      severity: 'info',
      platform: 'ios',
      message: `Description contains ${lineBreaks} line breaks`,
      recommendation: 'iOS may compress multiple line breaks into single spaces. Text formatting may differ between Android and iOS.'
    };
  }
  
  return null;
}

/**
 * Check for missing OG image tags in URLs (for link previews)
 */
export function validateLinkPreview(url: string): ValidationWarning | null {
  if (!url) return null;
  
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return {
      severity: 'warning',
      platform: 'both',
      message: 'Invalid URL format',
      recommendation: 'Ensure URL is properly formatted (e.g., https://example.com)'
    };
  }
  
  // Note: We can't check og:image tags client-side without CORS issues
  // This is informational
  return {
    severity: 'info',
    platform: 'both',
    message: 'Link preview requires og:image meta tag',
    recommendation: 'Ensure your website has Open Graph meta tags for rich link previews. Add <meta property="og:image" content="image-url"> to the page.'
  };
}

/**
 * Comprehensive validation for a format
 */
export function validateRcsFormat(params: {
  formatType: 'message' | 'richCard' | 'carousel' | 'chip';
  title?: string;
  description?: string;
  messageText?: string;
  images: { name: string; type: string; width?: number; height?: number }[];
  actions: any[];
  mediaHeight?: 'short' | 'medium' | 'tall';
}): PlatformValidationResult {
  const warnings: ValidationWarning[] = [];
  const iosSpecific: ValidationWarning[] = [];
  const androidSpecific: ValidationWarning[] = [];
  
  // Format-specific validations
  if (params.formatType === 'richCard' || params.formatType === 'carousel') {
    // Title validation
    const titleWarning = validateIOSTitleLength(params.title || '');
    if (titleWarning) {
      warnings.push(titleWarning);
      iosSpecific.push(titleWarning);
    }
    
    // Description validation
    const descWarning = validateIOSDescriptionLength(params.description || '');
    if (descWarning) {
      warnings.push(descWarning);
      iosSpecific.push(descWarning);
    }
    
    // Line breaks validation
    const lineBreakWarning = validateLineBreaks(params.description || '');
    if (lineBreakWarning) {
      warnings.push(lineBreakWarning);
      iosSpecific.push(lineBreakWarning);
    }
    
    // Text safe zone validation
    const safeZoneWarning = validateTextSafeZone(
      params.title || '', 
      params.description || '', 
      params.mediaHeight || 'medium'
    );
    if (safeZoneWarning) {
      warnings.push(safeZoneWarning);
    }
    
    // Image validations
    params.images.forEach((image, index) => {
      // Format validation
      const formatWarning = validateImageFormat(image.name, image.type);
      if (formatWarning) {
        warnings.push({
          ...formatWarning,
          message: `Image ${index + 1}: ${formatWarning.message}`
        });
        iosSpecific.push(formatWarning);
      }
      
      // Dimension validation
      if (image.width && image.height) {
        const dimWarning = validateImageDimensions(image.width, image.height);
        if (dimWarning) {
          warnings.push({
            ...dimWarning,
            message: `Image ${index + 1}: ${dimWarning.message}`
          });
        }
        
        // Aspect ratio validation
        const aspectWarning = validateImageAspectRatio(image.width, image.height);
        if (aspectWarning) {
          warnings.push({
            ...aspectWarning,
            message: `Image ${index + 1}: ${aspectWarning.message}`
          });
        }
      }
    });
  }
  
  // Carousel-specific validations
  if (params.formatType === 'carousel') {
    const carouselWarning = validateCarouselCount(params.images.length);
    if (carouselWarning) {
      warnings.push(carouselWarning);
    }
  }
  
  // CTA validations
  const ctaWarning = validateIOSCTACount(params.actions.length);
  if (ctaWarning) {
    warnings.push(ctaWarning);
    iosSpecific.push(ctaWarning);
  }
  
  // URL action validations
  params.actions.forEach((action, index) => {
    if (action.type === 'url' && action.url) {
      const urlWarning = validateLinkPreview(action.url);
      if (urlWarning) {
        warnings.push({
          ...urlWarning,
          message: `Action ${index + 1}: ${urlWarning.message}`
        });
      }
    }
  });
  
  const hasErrors = warnings.some(w => w.severity === 'error');
  
  return {
    isValid: !hasErrors,
    warnings,
    iosSpecific,
    androidSpecific
  };
}

/**
 * Get safe zone recommendation based on media height
 */
export function getSafeZoneGuidance(mediaHeight: 'short' | 'medium' | 'tall'): {
  titleChars: number;
  descriptionChars: number;
  descriptionLines: number;
} {
  switch (mediaHeight) {
    case 'short':
      return {
        titleChars: 80,
        descriptionChars: 200,
        descriptionLines: 4
      };
    case 'medium':
      return {
        titleChars: 60,
        descriptionChars: 144,
        descriptionLines: 3
      };
    case 'tall':
      return {
        titleChars: 50,
        descriptionChars: 100,
        descriptionLines: 2
      };
  }
}

/**
 * Calculate if text will fit in safe zone
 */
export function isTextInSafeZone(
  text: string,
  maxChars: number,
  platform: 'ios' | 'android'
): boolean {
  if (platform === 'android') return true; // Android shows all text
  return text.length <= maxChars; // iOS truncates
}

/**
 * Get cropping behavior description
 */
export function getCroppingBehavior(
  aspectRatio: number,
  lockAspectRatio: boolean,
  platform: 'ios' | 'android'
): string {
  if (lockAspectRatio) {
    return platform === 'android' 
      ? 'Image will be contained within card bounds (may show letterboxing)'
      : 'Image will be contained and centered (letterboxing applied)';
  }
  
  return platform === 'android'
    ? 'Image will fill card width and crop to mediaHeight (may cut top/bottom)'
    : 'Image will be contained to preserve aspect ratio';
}

/**
 * Detect if image will be cropped in Messages UI
 */
export function detectImageCropping(
  imageWidth: number,
  imageHeight: number,
  targetDp: number,
  platform: 'ios' | 'android',
  lockAspectRatio: boolean
): {
  willCrop: boolean;
  cropAmount?: { top: number; bottom: number } | { left: number; right: number };
  recommendation: string;
} {
  // Calculate target pixel height (using xhdpi for Android, @2x for iOS)
  const dpi = platform === 'android' ? 320 : 326;
  const targetPx = Math.round(targetDp * (dpi / 160));
  
  // Calculate expected width at target height
  const imageAspect = imageWidth / imageHeight;
  const expectedWidth = targetPx * imageAspect;
  
  if (!lockAspectRatio && platform === 'android') {
    // Android object-cover: Image will be scaled to fill width, height cropped
    const cardWidth = 300; // Approximate card width in preview
    const scaledHeight = cardWidth / imageAspect;
    
    if (scaledHeight > targetPx) {
      const cropPx = scaledHeight - targetPx;
      return {
        willCrop: true,
        cropAmount: { top: cropPx / 2, bottom: cropPx / 2 },
        recommendation: `Image will be cropped by approximately ${Math.round(cropPx)}px (${Math.round((cropPx / scaledHeight) * 100)}% of height). Enable "Lock Aspect Ratio" or adjust image aspect ratio to 2:1.`
      };
    }
  }
  
  return {
    willCrop: false,
    recommendation: 'Image will display without cropping'
  };
}

/**
 * Get iOS CTA display mode based on action count
 */
export function getIOSCTADisplayMode(actionCount: number): {
  mode: 'inline' | 'dropdown' | 'list';
  description: string;
} {
  if (actionCount === 0) {
    return {
      mode: 'inline',
      description: 'No actions to display'
    };
  }
  
  if (actionCount === 1) {
    return {
      mode: 'inline',
      description: 'Single action will display as inline button'
    };
  }
  
  return {
    mode: 'list',
    description: `${actionCount} actions will display as expandable list with chevrons. User must tap to see all options.`
  };
}

