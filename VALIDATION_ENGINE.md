# Platform Logic Engine - Validation & Guidance System

## 🎯 Overview

The Platform Logic Engine provides real-time validation, warnings, and recommendations to ensure your RCS messages display correctly on both Android and iOS platforms.

---

## ✅ Validation Rules

### 1. **iOS Title Limit (102 Characters)**

**Rule:** iOS rich cards and carousels break titles after 102 characters onto new lines

**Validation Levels:**
- ✅ **0-60 chars:** Optimal - single line on iOS
- ⚠️ **61-102 chars:** Warning - may wrap to 2 lines on iOS
- 🚫 **103+ chars:** iOS will break into multiple lines, affecting layout

**Visual Feedback:**
```
Title field shows:
- iOS-specific counter: "iOS: 105/102" in amber
- Border color: Amber warning border
- Inline alert: "Title exceeds iOS limit (105/102 characters)"
- Recommendation: "iOS will truncate or break title to multiple lines..."
```

**Example:**
- ✅ Good: "New Summer Collection 2025" (28 chars)
- ⚠️ Acceptable: "Limited Time Offer: 50% Off All Electronics This Weekend Only" (65 chars - may wrap)
- 🚫 Poor: "Amazing Unbelievable Super Duper Mega Sale on All Products Including Electronics, Clothing, and Home Goods!" (108 chars - will break badly)

---

### 2. **iOS Description Truncation (144 Characters / 3 Lines)**

**Rule:** iOS displays maximum 3 lines of description text, truncating with ellipsis (...)

**Validation Levels:**
- ✅ **0-144 chars:** Fully visible on iOS
- ⚠️ **145+ chars:** Will be truncated on iOS with "..."

**Character Per Line:**
- Approximately 48 characters per line
- Line 1: 48 chars
- Line 2: 48 chars  
- Line 3: 48 chars
- Total visible: ~144 chars

**Visual Feedback:**
```
Description field shows:
- iOS counter: "iOS: 180/144" in amber
- Border: Amber warning
- Alert: "Description will be truncated on iOS (180 characters, ~4 lines)"
- Recommendation: "iOS displays max 3 lines (~144 characters) with ellipsis..."
```

---

### 3. **Image Format Compatibility**

**Android Supported:**
- ✅ JPEG / JPG
- ✅ PNG
- ✅ GIF (animated and static)
- ✅ WebP

**iOS Supported:**
- ✅ JPEG / JPG (recommended)
- ✅ PNG
- 🚫 NO GIF (animated or static)
- ⚠️ WebP (limited support on older iOS)

**Visual Warnings:**

Each uploaded image shows compatibility badge:
```
GIF file:
  [!] iOS: Not supported
  
WebP file:
  [i] iOS: Limited support
  
JPEG/PNG file:
  [✓] Cross-platform ✓
```

**Image Thumbnails:**
- Amber border for incompatible formats
- Warning triangle icon overlay
- Platform-specific message below filename

---

### 4. **CTA Display Rules**

**iOS Behavior:**
- **1 CTA:** Displays inline as single button ✓
- **2-4 CTAs:** Displays as expandable list with chevrons (›)
- **User must tap** to see all options

**Android Behavior:**
- **1-4 CTAs:** All display inline as Material Design chips
- **Immediately visible** without user interaction

**Validation Warning:**
```
When actions.length > 1:
  
  [i] iOS: 3 actions will display as expandable list
  
  On iOS, multiple actions appear in a collapsible menu with chevrons (›).
  Users must tap to see all options. Place your primary CTA first for best engagement.
  
  💡 Best practice: Use 1 primary CTA to avoid dropdown friction on iOS
```

---

### 5. **Carousel Best Practices**

**Optimal Configuration:**
- **Number of Cards:** 2-3 cards (max 10 allowed)
- **Media Height:** Tall (264 DP) for best visibility
- **Description:** Max 3 lines to prevent overflow
- **Image Consistency:** All cards should use same dimensions

**Validation Warnings:**
```
2 cards: ✓ Good
3 cards: ✓ Optimal
4-6 cards: ⚠️ "May cause scroll fatigue"
7-10 cards: ⚠️ "Users often don't scroll beyond 3rd card"
>10 cards: 🚫 "Too many images (12/10 max)"
```

**Best Practices Alert:**
```
📋 Carousel Best Practices:
• Max 3 cards recommended for better engagement
• Tall media (264 DP) provides best visibility
• Max 3 lines of description to prevent overflow
• Consistent image sizes for professional appearance
```

---

### 6. **Safe Zone Validation**

**Definition:** Safe zone ensures important text remains visible when media pushes content below the fold

**Safe Zone Limits by Media Height:**

| Media Height | Title Safe Zone | Description Safe Zone | Lines |
|--------------|----------------|----------------------|-------|
| Short (112 DP) | 80 chars | 200 chars | 4 lines |
| Medium (168 DP) | 60 chars | 144 chars | 3 lines |
| Tall (264 DP) | 50 chars | 100 chars | 2 lines |

**Visual Indicator:**
```
Tall media with long text:
  
  [!] Text may be truncated on iOS with ellipsis (...)
  
  ✓ Text within iOS safe zone - fully visible
```

**Recommendation:**
- Tall media: Keep title under 50 chars, description under 100 chars
- Medium media: Keep description under 144 chars
- Short media: More flexibility with text length

---

### 7. **Media Cropping Behavior**

**Android (object-cover):**
- Image fills card width
- Height cropped to match mediaHeight DP
- May cut off top/bottom of image
- Use "Lock Aspect Ratio" to prevent cropping

**iOS (object-contain):**
- Image contained within bounds
- Preserves aspect ratio
- May show letterboxing (black bars)
- Recommended for images with important content at edges

**Validation:**
```
If aspect ratio ≠ 2:1 (recommended):
  
  [i] Image aspect ratio is 1.33:1 (recommended: 2:1)
  
  Images may be cropped differently on Android (object-cover) vs iOS (object-contain).
  Preview both platforms to check display.
```

---

### 8. **Image Dimension Validation**

**RCS Limits:**
- Maximum: 1500 × 1000 pixels
- Recommended: Based on media height

**Warnings:**
```
Image > 1500×1000:
  🚫 Image exceeds RCS limits (2000×1500px, max: 1500×1000px)
  Recommendation: Image will be auto-scaled. Resize before upload for best quality.

Image < 300×150:
  ⚠️ Image may appear pixelated (250×125px)
  Recommendation: For Medium cards, use at least 680×340px
```

---

### 9. **Link Preview Validation**

**For URL Actions:**
```
Missing og:image:
  [i] Link preview requires og:image meta tag
  
  Recommendation: Ensure your website has Open Graph meta tags.
  Add <meta property="og:image" content="image-url"> to the page.
```

**URL Format:**
```
Invalid URL:
  ⚠️ Invalid URL format
  
  Recommendation: Ensure URL is properly formatted (e.g., https://example.com)
```

---

### 10. **Line Break Handling**

**Android:** Respects ALL line breaks in description text

**iOS:** May compress multiple line breaks to single spaces

**Validation:**
```
Description with 4 line breaks:
  
  [i] Description contains 4 line breaks
  
  iOS may compress multiple line breaks into single spaces.
  Text formatting may differ between Android and iOS.
```

**Recommendation:**
- Use 1-2 line breaks maximum
- Test iOS preview to see actual rendering
- Don't rely on line breaks for critical formatting

---

## 🎨 Visual Feedback System

### Character Counters

**Dual Counter Display:**
```
Title Field Header:
┌─────────────────────────────────────────────┐
│ Card Title           iOS: 105/102  105/200  │
│                      ▲ amber      ▲ normal  │
└─────────────────────────────────────────────┘
```

**Color Coding:**
- **Red (Semibold):** Exceeds RCS maximum (200/2000 chars)
- **Amber:** Exceeds iOS recommended limit (102/144 chars)
- **Gray:** Within all limits

### Field Border Indicators

```css
border-red-500    /* RCS limit exceeded */
border-amber-400  /* iOS limit exceeded */
border-gray-300   /* Normal state */
```

### Inline Alerts

**Compact Mode:**
```
┌────────────────────────────────────────────┐
│ ⚠️ Title exceeds iOS limit (105/102 chars) │
│    🍎 iOS Only                              │
│                                             │
│    Recommendation: iOS will truncate...     │
└────────────────────────────────────────────┘
```

**Full Mode:**
```
┌─────────────────────────────────────────────────┐
│ ⚠️ GIF format not supported on iOS              │
│    Platform: 🍎 iOS Only                         │
│                                                  │
│    Tip: iOS does not support GIF images         │
│    (animated or static). This image will not    │
│    display on iOS devices. Use JPEG or PNG      │
│    for cross-platform compatibility.            │
└─────────────────────────────────────────────────┘
```

### Image Thumbnail Badges

**GIF Image:**
```
┌───────────────┐
│ [!]  [×]      │ ← Warning + Remove
│               │
│  [GIF Image]  │
│               │
│ filename.gif  │
│ ⚠️ iOS: Not   │
│   supported   │
└───────────────┘
```

**JPEG/PNG Image:**
```
┌───────────────┐
│       [×]     │ ← Remove only
│               │
│  [JPG Image]  │
│               │
│ photo.jpg     │
│ ✓ Cross-      │
│   platform ✓  │
└───────────────┘
```

---

## 📋 Embedded Documentation

### Media Height Tooltips

**Shows Real Pixel Values:**
```
Hover on Media Height (ℹ️):

Google RCS Media Heights:
• Short: 112 DP → 224px @ xhdpi, 228px @ iOS 2x
• Medium: 168 DP → 336px @ xhdpi, 342px @ iOS 2x  
• Tall: 264 DP → 528px @ xhdpi, 538px @ iOS 2x

Recommended: Prepare images at ~340px height for
Medium cards on most devices
```

### Rich Card Guidance

**Built-in Helpers:**
```
💡 iOS rich cards: Keep under 102 characters to prevent line breaks

💡 iOS shows ~3 lines (144 chars) with "..." for longer text.
   Keep concise for iOS.
```

### Carousel Recommendations

```
📋 Carousel Best Practices:
• Max 3 cards recommended for better engagement
• Tall media (264 DP) provides best visibility  
• Max 3 lines of description to prevent overflow
• Consistent image sizes for professional appearance
```

---

## 🔧 Technical Implementation

### Validation Functions

```typescript
// Title validation
validateIOSTitleLength(title: string): ValidationWarning | null

// Description validation
validateIOSDescriptionLength(desc: string): ValidationWarning | null

// Image format
validateImageFormat(fileName: string, mimeType: string): ValidationWarning | null

// Image dimensions
validateImageDimensions(width: number, height: number): ValidationWarning | null

// Aspect ratio
validateImageAspectRatio(width: number, height: number): ValidationWarning | null

// CTA count
validateIOSCTACount(actionCount: number): ValidationWarning | null

// Carousel count
validateCarouselCount(imageCount: number): ValidationWarning | null

// Safe zone
validateTextSafeZone(title, desc, mediaHeight): ValidationWarning | null

// Line breaks
validateLineBreaks(text: string): ValidationWarning | null

// Link previews
validateLinkPreview(url: string): ValidationWarning | null
```

### Comprehensive Validation

```typescript
validateRcsFormat({
  formatType,
  title,
  description,
  messageText,
  images: [{ name, type, width, height }],
  actions,
  mediaHeight
}): PlatformValidationResult

// Returns:
{
  isValid: boolean,
  warnings: ValidationWarning[],
  iosSpecific: ValidationWarning[],
  androidSpecific: ValidationWarning[]
}
```

---

## 📊 Validation Severity Levels

### Error (🚫)
**Blocks export/save:**
- RCS character limits exceeded (200/2000)
- Image dimensions > 1500×1000px
- Carousel with <2 or >10 images
- Invalid URL format

### Warning (⚠️)
**Allows save but shows strong recommendation:**
- iOS title >102 characters (line break)
- iOS description >144 characters (truncation)
- GIF on iOS (won't display)
- Image too small (<300×150px)
- Carousel >3 cards (engagement drop)

### Info (ℹ️)
**Best practice suggestions:**
- iOS >1 CTA (dropdown behavior)
- Aspect ratio ≠ 2:1 (cropping differences)
- Multiple line breaks (iOS compression)
- Link preview OG tags
- WebP limited iOS support

### Success (✓)
**Optimal configuration:**
- All validations passed
- Cross-platform compatible
- Within safe zones
- Following best practices

---

## 🎨 User Experience Flow

### Real-Time Validation

**As User Types Title:**
1. Character counter updates in real-time
2. At 61 chars: iOS warning appears ("may wrap")
3. At 103 chars: Amber border, iOS counter shows
4. At 201 chars: Red border, error message

**As User Uploads Image:**
1. File validation runs immediately
2. GIF detected: Amber border + warning badge
3. Thumbnail shows: "iOS: Not supported"
4. JPEG/PNG: Green checkmark "Cross-platform ✓"

**As User Adds Actions:**
1. First action: No warnings
2. Second action: iOS info alert appears
3. Alert explains: "Will display as expandable list"
4. Recommendation: "Place primary CTA first"

---

## 📱 Platform-Specific Behaviors

### Android: Permissive

**Text:**
- Shows all characters (scrollable if needed)
- Respects all line breaks
- No automatic truncation

**Images:**
- All formats supported (JPEG, PNG, GIF, WebP)
- object-cover crops to fill card

**Actions:**
- All CTAs visible as inline chips
- No dropdown needed

**Validation Focus:**
- RCS limits (200/2000 chars)
- Image dimensions (1500×1000 max)
- File size (10MB max)

### iOS: Restrictive

**Text:**
- Truncates title after ~60 chars (2 lines)
- Truncates description after ~144 chars (3 lines)
- May compress multiple line breaks

**Images:**
- Only JPEG and PNG
- NO GIF support (critical limitation)
- object-contain preserves aspect (letterbox)

**Actions:**
- >1 CTA creates dropdown (user friction)
- List-style with chevrons

**Validation Focus:**
- iOS title limit (102 chars single-line)
- iOS description limit (144 chars visible)
- Image format compatibility
- CTA count UX impact

---

## 🎓 Best Practices Guidance

### Cross-Platform Optimization

**Title:**
```
✓ Do: Keep under 60 characters
  Example: "Summer Sale: 30% Off"

✗ Don't: Write long promotional text
  Example: "Incredible Limited Time Summer Sale Event with Amazing Discounts on Everything!"
```

**Description:**
```
✓ Do: Keep under 140 characters, 2-3 sentences
  Example: "Shop our latest collection. Free shipping on orders over $50. Limited time offer!"

✗ Don't: Write long paragraphs
  Example: "We are excited to announce our biggest sale of the year with incredible savings on thousands of items across all categories including electronics, home goods, clothing, and more. This is a limited time offer that you won't want to miss, so shop now while supplies last!"
```

**Images:**
```
✓ Do: Use JPEG or PNG
✓ Do: Prepare at 680×340px for Medium height
✓ Do: Keep under 500KB file size
✓ Do: Use 2:1 aspect ratio

✗ Don't: Upload GIF if iOS users expected
✗ Don't: Use massive 4K images (slow load)
✗ Don't: Mix portrait and landscape in carousel
```

**Actions:**
```
✓ Do: Use 1-2 primary CTAs
✓ Do: Place most important action first
✓ Do: Use clear action text ("Shop Now" not "Click Here")

✗ Don't: Add 4 CTAs on iOS (creates dropdown friction)
✗ Don't: Use vague text
```

**Carousel:**
```
✓ Do: Limit to 3 cards
✓ Do: Use Tall media (264 DP)
✓ Do: Keep all images same dimensions
✓ Do: Limit description to 3 lines

✗ Don't: Create 8-10 card carousels
✗ Don't: Mix Short, Medium, Tall heights
✗ Don't: Use different aspect ratios per card
```

---

## 🛠️ Integration Points

### Rich Card Options
- Title field: iOS 102-char limit validation
- Description field: iOS 144-char truncation warning
- Media height tooltip: Shows DP→PX conversions
- Actions: iOS dropdown friction warning

### Carousel Options
- Title/description: Same iOS validations
- Best practices alert: 3 cards, tall media, 3 lines
- Media height tooltip: DP→PX with carousel note

### Image Uploader
- Per-image format validation
- Visual compatibility badges
- Platform-specific warnings
- Cross-platform checkmarks

### Preview Containers
- Platform behavior documentation
- Real rendering differences shown
- Safe zone visualization (future)

---

## 📈 Validation Impact

### User Benefits:
1. **Confidence:** Know exactly how message will appear
2. **Education:** Learn iOS/Android differences
3. **Prevention:** Catch issues before deployment
4. **Optimization:** Follow best practices automatically
5. **Efficiency:** Faster format creation with guidance

### Business Benefits:
1. **Higher Engagement:** Optimized CTAs and text
2. **Better Delivery:** Proper image formats and sizes
3. **Cross-Platform:** Works great on both platforms
4. **Professional:** Consistent, polished messages
5. **Fewer Revisions:** Get it right the first time

---

## 🔄 Validation Workflow

```
User Creates Format
    ↓
Uploads Image → Format validation → Badge appears
    ↓
Types Title → Real-time check → iOS warning if >102
    ↓
Types Description → Character count → iOS warning if >144
    ↓
Adds Actions → CTA count check → iOS dropdown warning if >1
    ↓
Selects Media Height → Tooltip shows → DP→PX conversions
    ↓
Preview Both Platforms → See actual rendering
    ↓
Review Validation Panel → All issues listed
    ↓
Fix Issues → Export/Save
```

---

## 💡 Tips & Tricks

### Quick Fixes:

**Title too long?**
- Hover to see exact iOS limit
- Aim for 50-60 chars
- Move details to description

**Description truncated on iOS?**
- iOS shows ~48 chars per line × 3 lines
- Keep first 144 chars compelling
- Use short sentences

**GIF won't work on iOS?**
- Replace with JPEG or PNG
- Or accept Android-only display
- Add note in campaign targeting

**Too many CTAs?**
- iOS shows list, Android shows chips
- Prioritize most important CTA first
- Consider using 1 action + suggested replies

**Carousel too long?**
- Limit to 3 cards for best engagement
- Split into multiple messages if needed
- Focus on quality over quantity

---

## 📚 Reference Materials

Based on RCS Business Messaging specifications and testing:

- iOS Business Chat guidelines
- Google RCS Business Messaging standards
- Material Design 3 (Android)
- Human Interface Guidelines (iOS)
- Cross-platform messaging best practices

---

**All validation rules are enforced in real-time with clear, actionable feedback!** 🚀

Generated: October 17, 2025
RCS Simulator v2.0 - Platform Logic Engine

