# 📥 Image Assets Download Scripts

## מטרה

סקריפט להורדת כל התמונות הדרושות לספר "פשוט חשבון א1" מאתרי תמונות חינמיים (Pixabay).

## קבצים

- **`downloadAssets.mjs`** - סקריפט Node.js להורדת התמונות
- **`../src/imageAssets.json`** - רשימת כל התמונות + URLs

## איך להריץ

### שלב 1: וידוא תלויות

הפרויקט משתמש ב-Node.js מובנה (ללא תלויות חיצוניות).
וודא שיש לך Node.js 16+ מותקן:

```bash
node --version
```

### שלב 2: הרצת הסקריפט

```bash
node scripts/downloadAssets.mjs
```

או עם הרשאות הרצה:

```bash
chmod +x scripts/downloadAssets.mjs
./scripts/downloadAssets.mjs
```

### שלב 3: בדיקת התוצאות

התמונות יישמרו ב:

```
public/assets/
├── numbers/
│   ├── apples_5.png
│   ├── apples_10.png
│   └── ...
├── school/
│   ├── pencils_cup.png
│   └── ...
├── money/
├── geometry/
├── holiday/
└── ...
```

## מבנה imageAssets.json

כל רשומה מכילה:

```json
{
  "assetId": "numbers/apples_5",
  "topic": "numbers",
  "description": "5-8 תפוחים לספירה בסיסית",
  "pageHint": "פרק מספרים עד 10, תרגילי תפוחים",
  "sourcePageUrl": "https://pixabay.com/...",
  "downloadUrl": "https://cdn.pixabay.com/.../apple.png"
}
```

- **assetId**: מזהה ייחודי (גם שם הקובץ)
- **topic**: קטגוריה (numbers, money, geometry, etc.)
- **description**: תיאור התמונה
- **pageHint**: איפה בספר משתמשים בתמונה
- **sourcePageUrl**: דף המקור
- **downloadUrl**: קישור ישיר להורדה

## שימוש בתמונות בקוד

לאחר ההורדה, ניתן להשתמש בתמונות ב-React:

```tsx
import assets from './imageAssets.json';

function AppleCounter() {
  const appleSrc = `/assets/${assets[0].assetId}.png`;

  return (
    <img
      src={appleSrc}
      alt="תפוחים לספירה"
    />
  );
}
```

או ישירות:

```tsx
<img src="/assets/numbers/apples_5.png" alt="5 תפוחים" />
```

## הוספת תמונות נוספות

1. הוסף רשומה ל-`src/imageAssets.json`
2. וודא שיש `downloadUrl` תקין
3. הרץ שוב את `downloadAssets.mjs`

## פתרון בעיות

### התמונה לא הורדה?

- ודא ש-`downloadUrl` מצביע ישירות לקובץ תמונה (.png/.jpg)
- בדוק שהקישור עובד בדפדפן
- אם יש שגיאת 403/404, חפש תמונה חלופית

### כיצד למצוא URL ישיר?

1. פתח את `sourcePageUrl` בדפדפן
2. לחץ על התמונה
3. בחר "הורד" או "לחץ ימני → העתק קישור תמונה"
4. הדבק את ה-URL המלא ב-`downloadUrl`

## רישיון

כל התמונות מ-Pixabay הן ברישיון CC0 (נחלת הכלל) - חינמי לשימוש מסחרי וללא קרדיט.

## קרדיטים

- תמונות: Pixabay Contributors
- סקריפט: EasyMath Development Team
