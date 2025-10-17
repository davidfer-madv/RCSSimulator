# RCS Simulator - Platform Features & Improvements

## 🎯 Overview
Comprehensive improvements to the RCS Simulator with dual-platform preview, extended action types, and enhanced UX.

---

## ✅ Completed Features

### 1. **Image Format Support**
#### Supported Formats by Platform:
- **Android:** JPEG, JPG, PNG, GIF (animated ✓), WebP
- **iOS:** JPEG, JPG, PNG only - **NO GIF support** (static or animated)

#### Validation & Warnings:
- File size limit: 10MB per image
- In-app warning: "⚠️ Note: Animated GIFs supported on Android only"
- Real-time file validation with user-friendly error messages
- Preview shows actual platform compatibility

---

### 2. **Format Types** 
Now supporting **4 RCS format types:**

#### a) **Simple Message**
- Text-only message with optional actions/replies
- No image required
- Up to 2000 characters
- Best for: Quick announcements, confirmations

#### b) **Rich Card**
- Single image with title, description, and actions
- Vertical or horizontal orientation
- Media heights: Short (112 DP), Medium (168 DP), Tall (264 DP)
- Best for: Product showcases, promotions

#### c) **Carousel**
- Multiple images (2-10) in scrollable format
- Shared title, description, and actions across all cards
- Individual images per card
- Best for: Product catalogs, photo galleries

#### d) **Chip List** ⭐ NEW
- Text message with suggested action chips and replies
- Material Design 3 chips on Android
- List-style buttons on iOS
- Best for: Quick actions, menu selections

---

### 3. **Extended Action Types**
Now supporting **8 action types** with RBM API compatibility:

| Action Type | Icon | Description | Use Case |
|------------|------|-------------|----------|
| **Open URL** | 🔗 | Open web link | Website, landing pages |
| **Dial Phone** | 📞 | Make phone call | Customer support, sales |
| **Calendar** | 📅 | Add calendar event | Appointments, reminders |
| **View Location** | 📍 | Show GPS coordinates | Store locations, venues |
| **Share Location** | 📤 | Request user location | Delivery, directions |
| **Open App** | 📱 | Launch Android app | Deep linking, app install |
| **Add to Wallet** | 💳 | Google/Apple Wallet | Tickets, passes, coupons |
| **Open Maps** | 🗺️ | Navigation query | Directions, map search |

#### Action Fields:
- **All Actions:** Button text (max 25 chars), optional postback data
- **Open URL:** URL (validated)
- **Dial Phone:** Phone number
- **Calendar:** Event title, description, start/end times (ISO 8601)
- **View Location:** Latitude, longitude, optional label
- **Share Location:** (no additional fields)
- **Open App:** Package name (com.example.app), optional app data
- **Add to Wallet:** Wallet pass URL (.pkpass)
- **Open Maps:** Location query, optional lat/long coordinates

---

### 4. **Platform-Specific Behaviors**

#### 📱 **Android (Google RCS)**

**Action Display:**
- Material Design 3 chips (pill-shaped buttons)
- Inline display with icons
- Blue filled background for actions
- Gray outlined chips for replies

**Text Rendering:**
- Respects ALL line breaks
- Title: Up to 200 characters, 16px font
- Description: Up to 2000 characters, 14px font
- No automatic truncation

**Image Handling:**
- Supports: JPEG, PNG, GIF (animated), WebP
- Cropping: `object-cover` by default
- Scaling: Fills card width, crops to mediaHeight DP
- Link previews: Full rich card format

**Typography:**
- Title: `font-medium text-[16px]`
- Description: `text-[14px]` with relaxed leading
- Action chips: `text-[14px]` font-medium

---

#### 🍎 **iOS (Business Chat)**

**Action Display:**
- List-style items in vertical menu
- Chevron indicators (›) for tap actions
- White background with borders
- Tap to expand behavior

**Text Rendering:**
- May compress multiple line breaks to spaces
- Title: ~60 characters max (2 lines, `line-clamp-2`), 15px font
- Description: ~144 characters max (3 lines, `line-clamp-3`), 13px font
- Automatic truncation with ellipsis (...)

**Image Handling:**
- Supports: JPEG, PNG **ONLY** - NO GIF
- Cropping: `object-contain` preferred (no crop)
- Scaling: Contains within bounds, may letterbox
- Link previews: Compact card with smaller thumbnail

**Typography:**
- Title: `font-semibold text-[15px]`
- Description: `text-[13px]` with snug leading
- Action list items: `text-[15px]` font-medium

---

### 5. **Dual Preview Simulation**

#### Side-by-Side Comparison:
- Toggle between Android and iOS previews via tabs
- Live preview updates as you configure
- Platform-specific rendering for all format types
- Visual differences clearly demonstrated

#### Platform Comparison Guide:
Comprehensive in-app guide showing:
- Action display differences (chips vs list)
- Text rendering variations
- Image format compatibility
- Character limit enforcement
- Cropping behavior
- Font size differences
- Chips vs Suggested Replies visual treatment

---

### 6. **User Experience Improvements**

#### Navigation Enhancements:
- **"New Format" dropdown menu** in:
  - Navbar (top right)
  - Sidebar (top left header)
  - Dashboard (main CTA)
- Quick-create with format type pre-selected via URL
- Examples:
  - `/rcs-formatter?type=message`
  - `/rcs-formatter?type=richCard`
  - `/rcs-formatter?type=carousel`
  - `/rcs-formatter?type=chip`

#### Export Options:
Replaced custom menu with accessible dropdown:
- **Export JSON** - RBM API-compatible payload
- **Export Device Image** - Screenshot of current preview (Android/iOS)
- **Save as Campaign** - Create campaign with activation settings

#### Visual Feedback:
- Platform-specific behavior cards below each preview
- Color-coded: Green for Android, Blue for iOS
- Warning cards for critical differences
- Real-time character counters with validation

---

## 🔧 Technical Implementation

### Schema Updates:
```typescript
// New action types
type Action = 
  | UrlAction 
  | DialAction 
  | CalendarAction 
  | ViewLocationAction 
  | ShareLocationAction
  | OpenAppAction      // NEW
  | WalletAction       // NEW
  | MapsAction;        // NEW

// New format type
type FormatType = "message" | "richCard" | "carousel" | "chip";  // Added "chip"
```

### Component Architecture:
```
RcsFormatter (Page)
  ├── ImageUploader (GIF support, platform warnings)
  ├── FormatOptions
  │   ├── MessageOptions (message, chip)
  │   ├── RichCardOptions (richCard)
  │   └── CarouselOptions (carousel)
  ├── EnhancedPreviewContainer
  │   └── FigmaPreviewContainer
  │       ├── AndroidRichCard / IOSRichCard
  │       ├── AndroidCarousel / IOSCarousel
  │       └── AndroidChipList / IOSChipList (NEW)
  └── PlatformComparisonGuide (NEW)
```

### RBM API Mapping:
All action types now properly map to Google RBM API format:
- `openUrlAction` - URL links
- `dialAction` - Phone numbers  
- `createCalendarEventAction` - Calendar events
- `viewLocationAction` - GPS coordinates, map queries
- `shareLocationAction` - Location sharing request
- `openAppAction` - Android app deep links
- Reply suggestions - Quick text responses

---

## 🎨 Design System

### Android (Material Design 3):
- **Cards:** `rounded-2xl`, `shadow-md`
- **Chips:** `rounded-full`, `px-4 py-2`, blue-50 background
- **Typography:** Roboto-style font sizing (16px/14px)
- **Colors:** Blue-700 text, Blue-50 backgrounds, Blue-200 borders

### iOS (Human Interface Guidelines):
- **Cards:** `rounded-[20px]`, `border border-gray-200`
- **Buttons:** `rounded-full`, white backgrounds with shadows
- **List Items:** `py-3 px-4`, blue-500 text, chevron indicators
- **Typography:** SF Pro-style sizing (15px/13px)
- **Colors:** System blue (#007AFF), gray backgrounds

---

## 📋 Validation Rules

### Format-Specific:
- **Message/Chip:** messageText required (max 2000 chars)
- **Rich Card:** title + at least 1 image required
- **Carousel:** title + 2-10 images required

### Action Limits:
- Maximum 4 suggested actions per format
- Maximum 11 suggested replies per format
- Action text: 1-25 characters
- Postback data: max 2048 characters

### Image Requirements:
- Dimensions: Max 1500x1000 pixels
- File size: Max 10MB per image
- Recommended: Under 1.8MB for optimal delivery
- Carousel: 2-10 images total

---

## 🚀 Usage Examples

### Creating a Chip List:
1. Click "New Format" → "Chip List"
2. Enter message text (e.g., "How can we help you today?")
3. Add suggested replies: "Track Order", "Contact Support", "Browse Products"
4. Add actions: "Open App", "View Store Hours", "Get Directions"
5. Preview on Android (chips) and iOS (list items)
6. Export JSON or save as campaign

### Creating a Rich Card:
1. Click "New Format" → "Rich Card"
2. Upload 1 image (JPEG/PNG for iOS compatibility)
3. Enter title and description
4. Select orientation (vertical recommended for iOS)
5. Add up to 4 actions (e.g., Shop Now, Call, Add to Calendar, Get Directions)
6. Compare Android vs iOS rendering
7. Export device preview or save format

---

## ⚠️ Platform Compatibility Notes

### GIF Support:
- ✅ **Android:** Full GIF support including animations
- ❌ **iOS:** NO GIF support - use JPEG or PNG
- **Recommendation:** Use JPEG for cross-platform compatibility

### Text Truncation:
- **Android:** Shows full text (scroll if needed)
- **iOS:** Auto-truncates:
  - Title: 2 lines (~60 chars)
  - Description: 3 lines (~144 chars)
- **Recommendation:** Keep titles under 50 characters, descriptions under 140 characters

### Action Display:
- **Android:** All actions visible immediately as chips
- **iOS:** Actions in collapsible list with chevrons
- **Recommendation:** Place most important action first

### Image Aspect Ratios:
- **Android:** Crops to fit mediaHeight (may cut off parts of image)
- **iOS:** Contains image (may show letterboxing)
- **Recommendation:** Use "Lock Aspect Ratio" and test on both platforms

---

## 🔄 Migration Guide

If you have existing formats, they will continue to work. New features:
- Existing formats default to "richCard" type
- Add `formatType: "chip"` to use chip lists
- Add new action types (openApp, wallet, maps) for extended functionality
- GIF images will be flagged with iOS compatibility warning

---

## 📦 Files Modified

### Frontend:
1. `client/src/components/image-formatter/image-uploader.tsx` - GIF support
2. `client/src/components/image-formatter/suggested-actions-builder.tsx` - New action types
3. `client/src/components/image-formatter/figma-message-ui.tsx` - Android/iOS chip components
4. `client/src/components/image-formatter/format-options.tsx` - Chip format option
5. `client/src/components/image-formatter/figma-preview-container.tsx` - Chip rendering + comparison
6. `client/src/components/image-formatter/enhanced-preview-container.tsx` - Replies prop
7. `client/src/components/image-formatter/platform-comparison-guide.tsx` - NEW comparison component
8. `client/src/pages/rcs-formatter-new.tsx` - Chip format validation + replies
9. `client/src/components/layout/navbar.tsx` - Chip in dropdown menu
10. `client/src/components/layout/sidebar.tsx` - Chip in dropdown menu
11. `client/src/pages/home-page.tsx` - Chip in dropdown menu
12. `client/src/lib/image-processing.ts` - Chip format export handling
13. `client/src/lib/rcs-json-template.ts` - New action RBM mappings
14. `client/src/context/rcs-formatter-context.tsx` - Chip format type

### Backend:
1. `server/routes.ts` - GIF file type support
2. `shared/schema.ts` - New action schemas (openApp, wallet, maps) + chip format

---

## 🎓 Best Practices

### Cross-Platform Compatibility:
1. **Always test on both Android and iOS previews**
2. Use JPEG/PNG for images (avoid GIF for iOS compatibility)
3. Keep titles under 50 characters
4. Keep descriptions under 140 characters
5. Use "Lock Aspect Ratio" to prevent unwanted cropping
6. Place primary CTA first in action list

### Action Design:
1. Limit to 2-3 key actions for better UX
2. Use descriptive text (e.g., "Shop Now" not "Click Here")
3. Combine with suggested replies for quick responses
4. Test tap behavior on both platforms

### Performance:
1. Optimize images before upload (target <500KB)
2. Use progressive JPEG for faster loading
3. Test with slow network conditions
4. Preview captures use 2x scale for quality

---

## 🐛 Bug Fixes

### Image Rendering:
- ✅ Fixed image preview not displaying after upload
- ✅ Proper object URL lifecycle management
- ✅ Context state properly updates with selected images

### Export Functionality:
- ✅ Replaced inaccessible custom menu with proper dropdown
- ✅ Export JSON works for message/chip formats without images
- ✅ Export device image respects current platform tab
- ✅ Proper cleanup of blob URLs

### Authentication:
- ✅ Reduced sensitive logging in production
- ✅ Improved session security (sameSite, httpOnly, secure)
- ✅ Fixed session persistence issues
- ✅ Better error messages for auth failures

---

## 📊 Future Enhancements

### Potential Next Steps:
1. **Carousel Per-Card Configuration:**
   - Individual title/description per carousel card
   - Unique actions per card
   - Drag-and-drop card reordering
   - Per-card image upload

2. **Advanced Features:**
   - A/B testing for different formats
   - Analytics integration
   - Template library
   - Bulk format creation
   - Rich card variants (list picker, time picker)

3. **Developer Tools:**
   - API playground
   - Webhook tester with logs
   - JSON validator
   - Performance metrics

---

## 🔐 Security Improvements

### Session Management:
- Production mode: `secure: true`, `sameSite: "lax"`
- Development mode: `secure: false` for local testing
- Session max age: 24 hours
- Proper session store integration

### Logging:
- Sensitive auth logs only in development
- No password logging (even masked)
- User IDs only, no PII in production logs
- Error messages sanitized

---

## 📱 Testing Checklist

Before deploying:
- [ ] Upload JPEG image → Preview on Android ✓
- [ ] Upload JPEG image → Preview on iOS ✓
- [ ] Upload GIF → Warning shown, Android preview works ✓
- [ ] Create message format with actions → Both platforms render ✓
- [ ] Create chip list → Compare Android chips vs iOS list ✓
- [ ] Create rich card → Test vertical and horizontal ✓
- [ ] Create carousel with 3+ images → Scrolling works ✓
- [ ] Add all 8 action types → Icons and fields appear ✓
- [ ] Export JSON → Valid RBM API payload ✓
- [ ] Export device image → PNG download works ✓
- [ ] Platform comparison guide → All info accurate ✓

---

## 🎉 Summary

**Total Changes:**
- 16 files modified
- 4 format types supported (was 3)
- 8 action types supported (was 5)
- Comprehensive platform comparison
- GIF support with warnings
- Improved UX with accessible menus
- Enhanced security and logging

**Key Benefits:**
1. **Better User Experience:** Quick format type selection, clear platform differences
2. **Cross-Platform Confidence:** See exactly how your message will look on each platform
3. **Extended Functionality:** More action types for richer user interactions
4. **Production Ready:** Hardened auth, proper validation, accessible UI components
5. **Educational:** Built-in guides teach RCS best practices

---

Generated: October 17, 2025
Version: 2.0

