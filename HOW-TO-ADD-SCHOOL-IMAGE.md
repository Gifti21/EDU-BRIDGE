# 🏫 How to Add Your School Campus Image

## Quick Steps:

1. **Save your school campus image** with the exact name: `school-campus.jpg`

2. **Place it in the public folder**: `e-student-portal/public/school-campus.jpg`

3. **Make sure the image is optimized**:
   - File size: Under 500KB for fast loading
   - Dimensions: 1920x1080 or 1600x900 recommended
   - Format: JPG (for photos)

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Current Status:
✅ The page is already configured to use your image
✅ Fallback gradients are in place so the page looks good even without the image
✅ The image will automatically appear in 3 sections:
   - Hero section (top)
   - Campus showcase (middle)
   - Call-to-action (bottom)

## Troubleshooting:

If the image still doesn't show:

1. **Check the file name**: Must be exactly `school-campus.jpg` (lowercase, no spaces)
2. **Check the location**: Must be in `public` folder, not `src` or anywhere else
3. **Clear browser cache**: Press Ctrl+F5 (or Cmd+Shift+R on Mac)
4. **Check file size**: Very large images might not load properly
5. **Try a different format**: Convert to JPG if using PNG/other formats

## Alternative Method:

If you want to use a different filename, update the code in `src/app/page.tsx`:

Replace all instances of:
```javascript
backgroundImage: "url('/school-campus.jpg')"
```

With:
```javascript
backgroundImage: "url('/your-image-name.jpg')"
```

The page will look beautiful with or without the image thanks to the fallback gradients! 🎨