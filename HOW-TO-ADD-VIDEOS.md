# 🎥 How to Add Video Backgrounds to EduBridge

## Video Files Needed:

Create a `videos` folder in your `public` directory and add these video files:

### Required Videos:

1. **`school-campus.mp4`** - Main hero section background
   - **Content**: School campus overview, students walking, buildings
   - **Duration**: 10-30 seconds (will loop)
   - **Resolution**: 1920x1080 or higher
   - **Format**: MP4 (H.264) and WebM for browser compatibility

2. **`students-learning.mp4`** - Students section background
   - **Content**: Students in classrooms, studying, using computers
   - **Duration**: 10-20 seconds
   - **Theme**: Blue/cyan colors work best

3. **`teachers-classroom.mp4`** - Teachers section background
   - **Content**: Teachers teaching, interacting with students
   - **Duration**: 10-20 seconds
   - **Theme**: Green/emerald colors work best

4. **`parents-engagement.mp4`** - Parents section background
   - **Content**: Parents at school events, parent-teacher meetings
   - **Duration**: 10-20 seconds
   - **Theme**: Purple/pink colors work best

5. **`admin-management.mp4`** - Administrators section background
   - **Content**: School administration, meetings, office work
   - **Duration**: 10-20 seconds
   - **Theme**: Orange/red colors work best

6. **`school-transformation.mp4`** - Call to Action section background
   - **Content**: Modern school technology, digital transformation
   - **Duration**: 15-30 seconds
   - **Theme**: Blue/purple colors work best

## File Structure:
```
e-student-portal/
├── public/
│   ├── videos/
│   │   ├── school-campus.mp4
│   │   ├── school-campus.webm
│   │   ├── students-learning.mp4
│   │   ├── students-learning.webm
│   │   ├── teachers-classroom.mp4
│   │   ├── teachers-classroom.webm
│   │   ├── parents-engagement.mp4
│   │   ├── parents-engagement.webm
│   │   ├── admin-management.mp4
│   │   ├── admin-management.webm
│   │   ├── school-transformation.mp4
│   │   └── school-transformation.webm
│   └── pictures/ (fallback images)
```

## Video Optimization Tips:

### File Size & Performance:
- **Keep file sizes under 5MB each** for fast loading
- **Use 720p or 1080p resolution** (higher isn't necessary for web)
- **Compress videos** using tools like HandBrake or online compressors
- **Provide both MP4 and WebM formats** for maximum browser compatibility

### Content Guidelines:
- **No audio needed** - videos are muted by default
- **Loop-friendly** - ensure smooth transitions from end to beginning
- **Professional quality** - represents your school's brand
- **Appropriate lighting** - not too dark, good contrast for text overlay

## Free Video Resources:

If you need stock videos, try these sources:
- **Pexels Videos**: https://www.pexels.com/videos/
- **Pixabay Videos**: https://pixabay.com/videos/
- **Unsplash Videos**: https://unsplash.com/videos/
- **Coverr**: https://coverr.co/

Search terms: "school", "education", "students", "classroom", "teachers", "learning"

## Fallback System:

The page is designed with fallbacks:
1. **First choice**: Video files (MP4/WebM)
2. **Fallback**: Static images from `/pictures/` folder
3. **Final fallback**: Gradient backgrounds

This ensures your page looks great even if videos don't load!

## Testing:

After adding videos:
1. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
2. **Test on different devices** (desktop, tablet, mobile)
3. **Check loading speed** - videos should start playing within 2-3 seconds
4. **Verify autoplay works** - some browsers block autoplay

## Troubleshooting:

**Videos not playing?**
- Check file names match exactly (case-sensitive)
- Ensure files are in `/public/videos/` folder
- Try different browsers
- Check browser console for errors

**Slow loading?**
- Compress video files further
- Reduce resolution to 720p
- Consider shorter video duration

Your EduBridge homepage will look amazing with these video backgrounds! 🎬✨