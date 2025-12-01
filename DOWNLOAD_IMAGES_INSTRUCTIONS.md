# 🎯 הוראות להורדת תמונות - לקלוד קוד

## רקע

בפרויקט EasyMath יש צורך בתמונות איור לספר "פשוט חשבון א1".
כל התמונות הכנות נמצאות ברשימה ב-`src/imageAssets.json`.

## המשימות שלך:

### ✅ משימה 1: הורדת כל התמונות

הרץ את הסקריפט:

```bash
node scripts/downloadAssets.mjs
```

**מה הסקריפט עושה:**
- קורא את `src/imageAssets.json`
- מוריד כל תמונה מ-`downloadUrl`
- שומר ב-`public/assets/{assetId}.png`
- מדפיס דוח על ההצלחות והכשלונות

**תוצאה צפויה:**
```
✅ Successful: 37
❌ Failed: 0
```

### ✅ משימה 2: בדיקת התמונות

בדוק שהתיקייה נוצרה ומלאה בתמונות:

```bash
ls -R public/assets/
```

צפוי לראות:
```
public/assets/
├── numbers/
│   ├── apples_5.png
│   ├── apples_10.png
│   ├── pears_group.png
│   ├── balls_colorful.png
│   └── toys_block_set.png
├── school/
│   ├── pencils_cup.png
│   ├── crayons_box.png
│   ├── scissors.png
│   └── ...
├── money/
├── addition/
├── subtraction/
├── even_odd/
├── geometry/
├── symmetry/
├── holiday/
└── background/
```

### ✅ משימה 3: וידוא שהתמונות נגישות

צור קובץ בדיקה זמני `test-images.html` בתיקייה `public/`:

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>בדיקת תמונות</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .asset { margin: 10px; display: inline-block; }
    img { width: 100px; height: 100px; object-fit: contain; border: 1px solid #ccc; }
    .label { font-size: 10px; }
  </style>
</head>
<body>
  <h1>בדיקת תמונות EasyMath</h1>
  <div id="gallery"></div>

  <script type="module">
    import assets from './src/imageAssets.json' assert { type: 'json' };

    const gallery = document.getElementById('gallery');

    assets.forEach(asset => {
      const div = document.createElement('div');
      div.className = 'asset';

      const img = document.createElement('img');
      img.src = `/assets/${asset.assetId}.png`;
      img.alt = asset.description;
      img.onerror = () => {
        img.style.border = '2px solid red';
      };

      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = asset.assetId;

      div.appendChild(img);
      div.appendChild(label);
      gallery.appendChild(div);
    });
  </script>
</body>
</html>
```

**הרץ dev server וגלוש ל-`http://localhost:5173/test-images.html`**

```bash
npm run dev
```

### ✅ משימה 4 (אופציונלי): עדכון downloadUrl לתמונות חסרות

אם יש תמונות שנכשלו בהורדה (Failed > 0), תצטרך:

1. פתח את `src/imageAssets.json`
2. מצא את ה-`sourcePageUrl` של התמונה שנכשלה
3. פתח אותו בדפדפן
4. העתק את ה-URL הישיר של התמונה (לחץ ימני → "Copy image address")
5. הדבק אותו בשדה `downloadUrl`
6. הרץ שוב `node scripts/downloadAssets.mjs`

### ✅ משימה 5: סיכום וקומיט

לאחר שכל התמונות הורדו בהצלחה:

```bash
git add public/assets/
git add src/imageAssets.json
git commit -m "feat(assets): add all textbook illustration images from Pixabay"
git push -u origin claude/textbook-image-extraction-01AKqWf6HmE5wUP4HRVo9FUUV
```

---

## 📋 רשימת תמונות לפי נושא

### מספרים וספירה (Numbers)
- `numbers/apples_5` - תפוחים לספירה
- `numbers/apples_10` - קבוצת תפוחים גדולה
- `numbers/pears_group` - אגסים להשוואה
- `numbers/balls_colorful` - כדורים צבעוניים
- `numbers/toys_block_set` - קוביות

### התאמה (Matching)
- `match/stars_7` - כוכבים
- `match/hearts_4` - לבבות
- `match/clouds_9` - עננים

### בית ספר (School)
- `school/pencils_cup` - עפרונות בכוס
- `school/crayons_box` - קופסת צבעים
- `school/scissors` - מספריים
- `school/glue_bottle` - דבק
- `school/notebook` - מחברת
- `school/bag` - תיק גב

### ילדים (Kids)
- `kids/kids_playground` - ילדים בחצר
- `kids/kids_classroom` - ילדים בכיתה
- `kids/kids_with_balloons` - ילדים עם בלונים

### חיבור (Addition)
- `addition/balloons_group_7` - 7 בלונים
- `addition/balloons_group_10` - 10 בלונים

### חיסור (Subtraction)
- `subtraction/balloons_minus` - בלונים נעלמים

### כסף (Money)
- `money/coins_stack` - מטבעות
- `money/coins_children` - ילדים עם כסף
- `money/shop_shelf` - מדף חנות

### זוגי/אי-זוגי (Even/Odd)
- `even_odd/socks_pairs` - זוגות גרביים
- `even_odd/kids_pairs` - ילדים בזוגות
- `even_odd/dots_grid` - רשת נקודות

### גאומטריה (Geometry)
- `geometry/basic_shapes` - צורות בסיסיות
- `geometry/shape_patterns` - דפוסי צורות

### סימטריה (Symmetry)
- `symmetry/heart_half` - חצי לב
- `symmetry/star_half` - חצי כוכב

### חגים (Holidays)
- `holiday/dreidel` - סביבון
- `holiday/dreidel_candles` - סביבון ונרות
- `holiday/menorah_candles` - מנורה

### רקעים (Backgrounds)
- `background/grid_math` - רקע גריד
- `background/classroom_board` - לוח ירוק
- `background/school_frame` - מסגרת בית ספר

---

## 🎨 שימוש בתמונות בקומפוננטות

### דוגמה 1: תצוגת תמונה בודדת

```tsx
function AppleImage() {
  return (
    <img
      src="/assets/numbers/apples_5.png"
      alt="5 תפוחים"
      className="exercise-image"
    />
  );
}
```

### דוגמה 2: טעינה דינמית לפי assetId

```tsx
import assets from '@/imageAssets.json';

interface MathImageProps {
  assetId: string;
}

function MathImage({ assetId }: MathImageProps) {
  const asset = assets.find(a => a.assetId === assetId);

  if (!asset) {
    return <div>תמונה לא נמצאה</div>;
  }

  return (
    <img
      src={`/assets/${asset.assetId}.png`}
      alt={asset.description}
      title={asset.pageHint}
    />
  );
}

// שימוש:
<MathImage assetId="numbers/apples_5" />
```

### דוגמה 3: גלריה של כל התמונות בנושא

```tsx
import assets from '@/imageAssets.json';

function MathGallery({ topic }: { topic: string }) {
  const filtered = assets.filter(a => a.topic === topic);

  return (
    <div className="gallery">
      {filtered.map(asset => (
        <div key={asset.assetId} className="gallery-item">
          <img src={`/assets/${asset.assetId}.png`} alt={asset.description} />
          <p>{asset.description}</p>
        </div>
      ))}
    </div>
  );
}

// שימוש:
<MathGallery topic="numbers" />
```

---

## ❓ שאלות נפוצות

### התמונה לא נטענת?

1. בדוק ש-URL ב-`downloadUrl` תקין
2. וודא שהקובץ הורד ל-`public/assets/`
3. בדוק שאין שגיאות 404 ב-console

### איך להוסיף תמונות נוספות?

1. מצא תמונה חינמית ב-Pixabay
2. העתק את ה-URL הישיר
3. הוסף רשומה ל-`imageAssets.json`:
```json
{
  "assetId": "new/image_name",
  "topic": "topic_name",
  "description": "תיאור",
  "pageHint": "איפה משתמשים",
  "sourcePageUrl": "https://pixabay.com/...",
  "downloadUrl": "https://cdn.pixabay.com/.../image.png"
}
```
4. הרץ `node scripts/downloadAssets.mjs`

---

## ✅ סיכום

לאחר ביצוע כל המשימות, יהיו לך:

- ✅ 37+ תמונות חינמיות ב-`public/assets/`
- ✅ קובץ JSON מסודר עם כל המטא-דאטה
- ✅ סקריפט להוספת תמונות עתידיות
- ✅ דוגמאות שימוש בקוד React

**הכל מוכן לפיתוח! 🚀**
