# Assets Directory

This directory contains images and visual assets for math exercises.

## Directory Structure

```
assets/
├── numbers/          # Images for counting, number recognition
├── addition/         # Images for addition exercises
├── subtraction/      # Images for subtraction exercises
└── geometry/         # Images for shapes and symmetry
```

## Adding Images

To add an image for a question:

1. Save the image file in the appropriate subdirectory
2. Name it according to the `assetId` in the question
3. Use PNG format (`.png`)

### Examples

For a question with `assetId: 'numbers/apples_5'`:
- File path: `public/assets/numbers/apples_5.png`
- The image will automatically display in both teacher and student modes

For a question with `assetId: 'geometry/half_star'`:
- File path: `public/assets/geometry/half_star.png`

## Image Guidelines

- **Format**: PNG preferred (supports transparency)
- **Size**: Keep images under 500KB for fast loading
- **Dimensions**: Recommended max width: 800px
- **Quality**: Clear and child-friendly visuals

## Creating Placeholder Images

You can create simple placeholder images using:
- Drawing tools (Paint, GIMP, Photoshop)
- Online tools like Canva or Figma
- AI image generators (DALL-E, Midjourney)
- Emoji/icon libraries

## Example Asset IDs Used

### Numbers
- `numbers/apples_5.png` - 5 apples
- `numbers/balloons_7.png` - 7 balloons
- `numbers/butterflies_9.png` - 9 butterflies
- `numbers/cookies_plates.png` - Plates with cookies
- `numbers/pencils_groups.png` - Groups of pencils
- `numbers/tenframe_7.png` - Ten frame with 7 filled
- `numbers/tenframe_4_blue_3_green.png` - Ten frame with colored circles
- `numbers/tenframe_9.png` - Ten frame with 9 filled

### Addition
- `addition/tenframe_2.png` - Ten frame with 2 filled
- `addition/domino_3_5.png` - Domino showing 3 and 5
- `addition/domino_4_4.png` - Domino showing 4 and 4

### Subtraction
- `subtraction/tenframe_9_minus_4.png` - Ten frame showing subtraction
- `subtraction/tenframe_6_minus_2.png` - Ten frame showing subtraction

### Geometry
- `geometry/mix_shapes_1.png` - Mixed geometric shapes
- `geometry/triangles_4.png` - 4 triangles
- `geometry/heart_midline.png` - Heart with symmetry line
- `geometry/arrow_right.png` - Arrow pointing right
- `geometry/half_star.png` - Half of a star for symmetry exercise
- `geometry/symmetry_choices.png` - Various shapes for comparison
- `geometry/half_menorah.png` - Half of a menorah for symmetry

## Notes

- Images are optional - questions without images will work fine
- The application handles missing images gracefully (won't show broken image icons)
- You can add your own custom images following the naming convention
