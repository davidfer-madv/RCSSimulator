/**
 * Media Size Converter
 * Converts DP → PX for Android and iOS
 * Supports mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi (Android)
 * Supports @1x, @2x, @3x Retina (iOS)
 */

export const androidDensities = {
  mdpi: 160,
  hdpi: 240,
  xhdpi: 320,
  xxhdpi: 480,
  xxxhdpi: 640
} as const;

export const iosDensities = {
  '@1x': 163,
  '@2x': 326,
  '@3x': 458
} as const;

export type AndroidDensity = keyof typeof androidDensities;
export type IOSDensity = keyof typeof iosDensities;

/**
 * Convert DP to PX for a given DPI
 * @param dp - Density-independent pixels
 * @param dpi - Dots per inch (default: 160 for mdpi baseline)
 * @returns Pixel value
 */
export function convertDpToPx(dp: number, dpi: number = 160): number {
  return Math.round(dp * (dpi / 160));
}

/**
 * Get pixel values for all Android densities
 * @param dp - Density-independent pixels
 * @returns Object with pixel values for each Android density
 */
export function getAndroidPx(dp: number): Record<AndroidDensity, number> {
  const result: Partial<Record<AndroidDensity, number>> = {};
  for (const [label, dpi] of Object.entries(androidDensities)) {
    result[label as AndroidDensity] = convertDpToPx(dp, dpi);
  }
  return result as Record<AndroidDensity, number>;
}

/**
 * Get pixel values for all iOS densities (Retina displays)
 * @param dp - Density-independent pixels (points in iOS terminology)
 * @returns Object with pixel values for each iOS density
 */
export function getIOSPx(dp: number): Record<IOSDensity, number> {
  const result: Partial<Record<IOSDensity, number>> = {};
  for (const [label, ppi] of Object.entries(iosDensities)) {
    result[label as IOSDensity] = convertDpToPx(dp, ppi);
  }
  return result as Record<IOSDensity, number>;
}

/**
 * Preview media sizes for RCS standard heights
 * Returns DP→PX conversions for Short, Medium, and Tall card heights
 */
export function previewMediaSizes() {
  const dpValues = [112, 168, 264]; // Short, Medium, Tall card heights
  const labels = ['Short', 'Medium', 'Tall'];

  return dpValues.map((dp, index) => ({
    label: labels[index],
    dp,
    android: getAndroidPx(dp),
    ios: getIOSPx(dp)
  }));
}

/**
 * Get recommended pixel dimensions for a specific density
 * @param dp - DP value
 * @param platform - 'android' or 'ios'
 * @param density - Specific density key
 * @returns Pixel value
 */
export function getRecommendedPx(
  dp: number, 
  platform: 'android' | 'ios', 
  density: AndroidDensity | IOSDensity
): number {
  if (platform === 'android') {
    const dpi = androidDensities[density as AndroidDensity];
    return convertDpToPx(dp, dpi);
  } else {
    const ppi = iosDensities[density as IOSDensity];
    return convertDpToPx(dp, ppi);
  }
}

/**
 * Calculate aspect ratio for RCS images
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns Aspect ratio as string (e.g., "16:9", "2:1")
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Get RCS-compliant dimensions
 * @param originalWidth - Original image width
 * @param originalHeight - Original image height
 * @returns Scaled dimensions within RCS limits (1500x1000 max)
 */
export function getRcsCompliantDimensions(originalWidth: number, originalHeight: number): {
  width: number;
  height: number;
  scaled: boolean;
} {
  const maxWidth = 1500;
  const maxHeight = 1000;
  
  let width = originalWidth;
  let height = originalHeight;
  let scaled = false;
  
  // Scale down if exceeds maximum
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * ratio);
    scaled = true;
  }
  
  if (height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = Math.round(width * ratio);
    scaled = true;
  }
  
  return { width, height, scaled };
}

