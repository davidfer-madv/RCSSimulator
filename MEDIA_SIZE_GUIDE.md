# Media Size Converter Guide

## 📐 DP → PX Conversion Reference

### What is DP (Density-Independent Pixels)?
DP (also called DIP) is a virtual pixel unit used in Android and iOS to ensure consistent visual sizing across different screen densities. One DP equals one physical pixel on a 160 DPI screen (mdpi baseline).

---

## 📱 Android Density Categories

| Density | DPI | Scale Factor | Example Devices |
|---------|-----|--------------|-----------------|
| **mdpi** | 160 | 1.0x | Older Android phones |
| **hdpi** | 240 | 1.5x | Legacy devices |
| **xhdpi** | 320 | 2.0x | Most common (Galaxy S, Pixel) |
| **xxhdpi** | 480 | 3.0x | High-end phones (Galaxy S20+) |
| **xxxhdpi** | 640 | 4.0x | Flagship devices (Galaxy S22 Ultra) |

### Formula:
```
PX = DP × (Device DPI ÷ 160)
```

---

## 🍎 iOS Retina Displays

| Display | PPI | Scale Factor | Example Devices |
|---------|-----|--------------|-----------------|
| **@1x** | 163 | 1.0x | Non-Retina (legacy) |
| **@2x** | 326 | 2.0x | iPhone 11, 12, 13, SE, iPad Pro |
| **@3x** | 458 | 2.81x | iPhone 12 Pro, 13 Pro, 14 Pro Max |

### Formula:
```
PX = Points × Scale Factor
```
*Note: iOS uses "Points" (equivalent to DP) converted by the scale factor*

---

## 📊 RCS Standard Media Heights

### Conversion Table

| Size | DP | mdpi | hdpi | xhdpi | xxhdpi | xxxhdpi | @1x | @2x | @3x |
|------|----|----|------|-------|--------|---------|-----|-----|-----|
| **Short** | 112 | 112px | 168px | **224px** | 336px | 448px | 114px | **228px** | 321px |
| **Medium** | 168 | 168px | 252px | **336px** | 504px | 672px | 171px | **342px** | 481px |
| **Tall** | 264 | 264px | 396px | **528px** | 792px | 1056px | 269px | **538px** | 757px |

**Bold values** indicate most common device densities (xhdpi for Android, @2x for iOS)

---

## 🎯 Practical Recommendations

### For Best Cross-Platform Results:

#### 1. **Target Resolution**
Prepare images for:
- **Android:** xhdpi (320 DPI) as baseline
- **iOS:** @2x Retina (326 PPI) as baseline
- These are the most common device densities

#### 2. **Image Dimensions**

**For Medium Height (168 DP):**
```
Recommended: ~340px height
- Android xhdpi: 336px
- iOS @2x: 342px
- Width: Depends on aspect ratio (typically 2:1, so ~680px)
```

**For Tall Height (264 DP):**
```
Recommended: ~530px height
- Android xhdpi: 528px
- iOS @2x: 538px
- Width: ~1060px for 2:1 aspect
```

**For Short Height (112 DP):**
```
Recommended: ~225px height
- Android xhdpi: 224px
- iOS @2x: 228px
- Width: ~450px for 2:1 aspect
```

#### 3. **File Size Optimization**

| Image Height | Recommended File Size | Format | Quality |
|--------------|----------------------|--------|---------|
| Short (~225px) | 50-100 KB | JPEG | 85% |
| Medium (~340px) | 100-200 KB | JPEG | 85% |
| Tall (~530px) | 200-400 KB | JPEG | 85% |

**RCS Limits:**
- Maximum: 1500 × 1000 pixels
- Maximum file size: 1.8MB (soft limit), 10MB (hard limit)
- Recommended: Under 500KB for fast delivery

---

## 🔧 Using the Converter

### In the RCS Formatter:

1. **Automatic Display:**
   - Select any media height (Short/Medium/Tall)
   - Hover over the info icon (ℹ️)
   - See instant DP→PX conversions for common devices

2. **Reference Table:**
   - Scroll to "Media Size Reference" section
   - View complete conversion table
   - Current selection is highlighted

3. **Custom Converter:**
   - Enter any DP value (1-1000)
   - See instant PX conversions for xhdpi and @2x
   - Use for custom image preparation

### Programmatic Usage:

```typescript
import { 
  convertDpToPx, 
  getAndroidPx, 
  getIOSPx,
  previewMediaSizes
} from '@/lib/media-size-converter';

// Convert specific DP to PX
const pixels = convertDpToPx(168, 320); // 168 DP at xhdpi = 336px

// Get all Android densities
const androidSizes = getAndroidPx(168);
// { mdpi: 168, hdpi: 252, xhdpi: 336, xxhdpi: 504, xxxhdpi: 672 }

// Get all iOS densities
const iosSizes = getIOSPx(168);
// { '@1x': 171, '@2x': 342, '@3x': 481 }

// Get RCS standard sizes
const standards = previewMediaSizes();
// [
//   { label: 'Short', dp: 112, android: {...}, ios: {...} },
//   { label: 'Medium', dp: 168, android: {...}, ios: {...} },
//   { label: 'Tall', dp: 264, android: {...}, ios: {...} }
// ]
```

---

## 💡 Real-World Examples

### Example 1: Preparing a Product Image

**Scenario:** Creating a Medium height rich card for a product launch

**Steps:**
1. Original image: 2000 × 1500 pixels
2. Target: Medium (168 DP)
3. Calculate: 168 DP = 336px @ xhdpi, 342px @ @2x
4. Resize to: ~680 × 340 pixels (2:1 aspect ratio)
5. Compress: JPEG at 85% quality (~150KB)
6. Result: Fast loading on all devices, perfect size

### Example 2: Carousel with Multiple Images

**Scenario:** Creating a Tall carousel with 5 product photos

**Steps:**
1. Original images: Various sizes
2. Target: Tall (264 DP) 
3. Calculate: 264 DP = 528px @ xhdpi, 538px @ @2x
4. Resize all to: ~1060 × 530 pixels (2:1 aspect)
5. Compress: Each under 200KB
6. Upload: 5 images = ~1MB total
7. Result: Smooth scrolling, consistent look

### Example 3: iOS-Optimized Rich Card

**Scenario:** Creating a card primarily for iOS users

**Steps:**
1. Focus on iOS @2x and @3x densities
2. Medium height: 168 DP = 342px @ @2x
3. Prepare image: 684 × 342 pixels (2:1)
4. Format: PNG or JPEG (NO GIF)
5. Use object-contain for proper letterboxing
6. Result: Perfect iOS Business Chat experience

---

## 📱 Device Density Distribution (2025)

### Android:
- **xhdpi (320 DPI):** ~40% of devices
- **xxhdpi (480 DPI):** ~35% of devices
- **xxxhdpi (640 DPI):** ~20% of devices
- **mdpi/hdpi:** <5% (legacy)

**Recommendation:** Target xhdpi as minimum, provide assets at xxhdpi for optimal quality

### iOS:
- **@2x Retina:** ~60% of devices (iPhone 11-14, iPad)
- **@3x Super Retina:** ~40% of devices (iPhone Pro models)
- **@1x:** <1% (obsolete)

**Recommendation:** Target @2x as minimum, assets work well on @3x with upscaling

---

## 🎨 Design Workflow

### Optimal Image Preparation Process:

1. **Design at 2x Resolution:**
   - Medium card: Design at 672 × 336 pixels
   - This works for both xhdpi (Android) and @2x (iOS)

2. **Export Multiple Versions:**
   ```
   Short:
   - @1x: 450 × 225 (legacy)
   - @2x: 456 × 228 (standard) ✓
   - @3x: 642 × 321 (high-end)
   
   Medium:
   - @1x: 684 × 342 (legacy)
   - @2x: 684 × 342 (standard) ✓
   - @3x: 962 × 481 (high-end)
   
   Tall:
   - @1x: 1076 × 538 (legacy)
   - @2x: 1076 × 538 (standard) ✓
   - @3x: 1514 × 757 (exceeds RCS max!)
   ```

3. **RCS Limits:**
   - Max dimensions: 1500 × 1000 pixels
   - For Tall @3x: Reduce to 1500 × 750 pixels

4. **Optimize:**
   - Use JPEG 85-90% quality
   - Target <500KB per image
   - Test on both platforms

---

## 🔍 Troubleshooting

### Issue: Image looks pixelated on high-end devices
**Solution:** Prepare images at xxhdpi (480 DPI) or @3x instead of baseline

### Issue: Image file size too large
**Solution:** 
- Reduce dimensions to actual DP requirements
- Use JPEG instead of PNG
- Compress to 80-85% quality
- Medium height doesn't need 1500px!

### Issue: Image crops differently on iOS vs Android
**Solution:**
- Enable "Lock Aspect Ratio"
- Use object-contain mode
- Test preview on both platforms
- Consider iOS letterboxing behavior

### Issue: Carousel images inconsistent heights
**Solution:**
- All carousel images must use same dimensions
- Pre-process to exact DP target height
- Example: For Medium, resize all to 680 × 340px

---

## 📚 Additional Resources

### Conversion Examples:

```javascript
// Short height (112 DP)
112 DP × (320 ÷ 160) = 224px @ xhdpi ✓
112 DP × (326 ÷ 160) = 228px @ iOS @2x ✓

// Medium height (168 DP)
168 DP × (320 ÷ 160) = 336px @ xhdpi ✓
168 DP × (326 ÷ 160) = 342px @ iOS @2x ✓

// Tall height (264 DP)
264 DP × (320 ÷ 160) = 528px @ xhdpi ✓
264 DP × (326 ÷ 160) = 538px @ iOS @2x ✓
```

### Quick Reference Card Values:

Most common devices use:
- **Android:** xhdpi (2x baseline) = 320 DPI
- **iOS:** @2x Retina = 326 PPI

**Therefore:**
- 168 DP ≈ **336-342 pixels** (safe to use 340px)
- 264 DP ≈ **528-538 pixels** (safe to use 530px)
- 112 DP ≈ **224-228 pixels** (safe to use 225px)

---

## ✅ Best Practices Summary

1. ✓ **Design at xhdpi or @2x** (most common densities)
2. ✓ **Use 2:1 aspect ratio** for RCS rich cards
3. ✓ **Keep file sizes under 500KB** for performance
4. ✓ **Test on both platforms** using the preview
5. ✓ **Use JPEG for photos**, PNG for graphics/logos
6. ✓ **Avoid GIF on iOS** (not supported)
7. ✓ **Check the conversion table** before exporting images
8. ✓ **Enable aspect ratio lock** to prevent unwanted cropping

---

Generated: October 17, 2025
RCS Simulator v2.0

