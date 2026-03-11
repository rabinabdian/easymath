// src/utils/createMultiplicationBookletPdf.ts
// Generates a printable Hebrew RTL PDF for the "הבנת לוח הכפל" multiplication module
// Target audience: grades 1–3 students learning multiplication conceptually

import jsPDF from 'jspdf';

interface BookletOptions {
  schoolName?: string;
  teacherName?: string;
  grade?: string;
}

export function createMultiplicationBookletPdf(opts: BookletOptions = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 40;
  const marginRight = 40;
  const marginTop = 40;
  const marginBottom = 40;
  const usableWidth = pageWidth - marginLeft - marginRight;
  const lineH = 20;

  // Since jsPDF has limited RTL support, we render text left-aligned
  // but the content is in Hebrew. We'll position text from the right side.
  // For visual blocks (dot arrays), we draw rectangles.

  let curY = marginTop;
  let pageNum = 1;

  // ─── helpers ──────────────────────────────────────────────────────────────

  const addPage = () => {
    doc.addPage();
    pageNum++;
    curY = marginTop;
    drawPageFrame();
    drawPageNumber();
  };

  const checkPageBreak = (neededHeight: number) => {
    if (curY + neededHeight > pageHeight - marginBottom) {
      addPage();
    }
  };

  const drawPageFrame = () => {
    doc.setDrawColor(180, 180, 200);
    doc.setLineWidth(1);
    doc.rect(
      marginLeft / 2,
      marginTop / 2,
      pageWidth - marginLeft,
      pageHeight - marginTop,
    );
  };

  const drawPageNumber = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text(`${pageNum}`, pageWidth / 2, pageHeight - 14, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  };

  // Write a wrapped paragraph right-aligned; returns new y after text
  const paragraphRight = (
    text: string,
    startY: number,
    fontSize = 11,
    fontStyle: 'normal' | 'bold' = 'normal',
  ): number => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    const maxWidth = usableWidth;
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const totalHeight = lines.length * lineH + 4;
    checkPageBreak(totalHeight);
    lines.forEach((line: string, i: number) => {
      doc.text(line, pageWidth - marginRight, startY + i * lineH, {
        align: 'right',
      });
    });
    return startY + lines.length * lineH + 4;
  };

  // Draw a horizontal divider
  const drawDivider = (y: number, color = [220, 220, 230] as [number, number, number]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, pageWidth - marginRight, y);
  };

  // Draw a dot/block grid (array visual) aligned right
  const drawDotArray = (
    rows: number,
    cols: number,
    startY: number,
    dotSize = 10,
    gap = 4,
    color = [100, 149, 237] as [number, number, number], // cornflower blue
  ): number => {
    const totalWidth = cols * (dotSize + gap) - gap;
    const startX = pageWidth - marginRight - totalWidth;
    doc.setFillColor(...color);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (dotSize + gap);
        const y = startY + r * (dotSize + gap);
        doc.roundedRect(x, y, dotSize, dotSize, 2, 2, 'F');
      }
    }
    return startY + rows * (dotSize + gap) - gap + 8;
  };

  // Draw answer blank line
  const drawAnswerLine = (y: number): number => {
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.6);
    const lineLength = 60;
    doc.line(
      pageWidth - marginRight - lineLength,
      y,
      pageWidth - marginRight,
      y,
    );
    return y + lineH;
  };

  // Draw chapter title box
  const drawChapterTitle = (
    chapterNum: number,
    hebrewTitle: string,
    y: number,
  ): number => {
    const boxHeight = 34;
    doc.setFillColor(70, 130, 180); // steel blue
    doc.setDrawColor(70, 130, 180);
    doc.roundedRect(marginLeft, y, usableWidth, boxHeight, 6, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const label = `${chapterNum}. ${hebrewTitle}  פרק`;
    doc.text(label, pageWidth - marginRight, y + 23, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    return y + boxHeight + 14;
  };

  // Draw section heading (sub-section within chapter)
  const drawSectionHeading = (text: string, y: number): number => {
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(marginLeft, y, usableWidth, 24, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 60, 120);
    doc.text(text, pageWidth - marginRight, y + 16, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    return y + 30;
  };

  // Draw an exercise item with answer blank
  const drawExercise = (
    num: number,
    text: string,
    y: number,
    extraSpaceAfter = 20,
  ): number => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const fullText = `${num}. ${text}`;
    const lines = doc.splitTextToSize(fullText, usableWidth - 80) as string[];
    const textH = lines.length * lineH;
    checkPageBreak(textH + 40);
    lines.forEach((line: string, i: number) => {
      doc.text(line, pageWidth - marginRight, y + i * lineH, {
        align: 'right',
      });
    });
    const afterText = y + textH + 4;
    // answer line on same row if single line, else below
    drawAnswerLine(afterText);
    return afterText + lineH + extraSpaceAfter;
  };

  // Draw fruit/object group illustration using emoji-like text (unicode boxes)
  // jsPDF doesn't render emoji, so we use filled squares + numbers
  const drawGroupsIllustration = (
    groups: number,
    itemsPerGroup: number,
    y: number,
  ): number => {
    const itemSize = 14;
    const gap = 3;
    const groupGap = 14;
    const totalCols = itemsPerGroup;
    const groupWidth = totalCols * (itemSize + gap) - gap;
    const allGroupsWidth = groups * (groupWidth + groupGap) - groupGap;
    const startX = pageWidth - marginRight - allGroupsWidth;

    const colors: [number, number, number][] = [
      [255, 99, 71],  // tomato red
      [60, 179, 113], // medium sea green
      [100, 149, 237],// cornflower blue
      [255, 165, 0],  // orange
      [148, 0, 211],  // dark violet
    ];

    for (let g = 0; g < groups; g++) {
      const color = colors[g % colors.length];
      doc.setFillColor(...color);
      for (let i = 0; i < itemsPerGroup; i++) {
        const x = startX + g * (groupWidth + groupGap) + i * (itemSize + gap);
        doc.circle(x + itemSize / 2, y + itemSize / 2, itemSize / 2 - 1, 'F');
      }
      // label under group
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const groupLabelX = startX + g * (groupWidth + groupGap) + groupWidth / 2;
      doc.text(`(${itemsPerGroup})`, groupLabelX, y + itemSize + 12, {
        align: 'center',
      });
    }
    doc.setTextColor(0, 0, 0);
    return y + itemSize + 24;
  };

  // Draw a multiplication table (partial or full)
  const drawMultiplicationTable = (maxN: number, y: number): number => {
    const cellW = 32;
    const cellH = 22;
    const tableWidth = (maxN + 1) * cellW;
    const startX = pageWidth - marginRight - tableWidth;

    for (let r = 0; r <= maxN; r++) {
      for (let c = 0; c <= maxN; c++) {
        const cx = startX + c * cellW;
        const cy = y + r * cellH;

        if (r === 0 && c === 0) {
          doc.setFillColor(70, 130, 180);
        } else if (r === 0 || c === 0) {
          doc.setFillColor(200, 220, 255);
        } else {
          doc.setFillColor(r % 2 === c % 2 ? 245 : 255, 250, 255);
        }

        doc.setDrawColor(180, 200, 220);
        doc.rect(cx, cy, cellW, cellH, 'FD');

        doc.setFont('helvetica', r === 0 || c === 0 ? 'bold' : 'normal');
        doc.setFontSize(9);
        doc.setTextColor(r === 0 || c === 0 ? 30 : 60, 60, 100);

        let val = '';
        if (r === 0 && c === 0) {
          val = '×';
        } else if (r === 0) {
          val = `${c}`;
        } else if (c === 0) {
          val = `${r}`;
        } else {
          val = `${r * c}`;
        }

        doc.text(val, cx + cellW / 2, cy + cellH / 2 + 4, {
          align: 'center',
        });
      }
    }
    doc.setTextColor(0, 0, 0);
    return y + (maxN + 1) * cellH + 12;
  };

  // Draw a blank multiplication table (for students to fill in)
  const drawBlankMultiplicationTable = (maxN: number, y: number): number => {
    const cellW = 32;
    const cellH = 24;
    const tableWidth = (maxN + 1) * cellW;
    const startX = pageWidth - marginRight - tableWidth;

    for (let r = 0; r <= maxN; r++) {
      for (let c = 0; c <= maxN; c++) {
        const cx = startX + c * cellW;
        const cy = y + r * cellH;

        if (r === 0 && c === 0) {
          doc.setFillColor(70, 130, 180);
        } else if (r === 0 || c === 0) {
          doc.setFillColor(200, 220, 255);
        } else {
          doc.setFillColor(255, 255, 255);
        }

        doc.setDrawColor(150, 180, 210);
        doc.rect(cx, cy, cellW, cellH, 'FD');

        doc.setFont('helvetica', r === 0 || c === 0 ? 'bold' : 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 60, 100);

        if (r === 0 && c === 0) {
          doc.text('×', cx + cellW / 2, cy + cellH / 2 + 4, {
            align: 'center',
          });
        } else if (r === 0) {
          doc.text(`${c}`, cx + cellW / 2, cy + cellH / 2 + 4, {
            align: 'center',
          });
        } else if (c === 0) {
          doc.text(`${r}`, cx + cellW / 2, cy + cellH / 2 + 4, {
            align: 'center',
          });
        }
        // inner cells left blank for student to fill
      }
    }
    doc.setTextColor(0, 0, 0);
    return y + (maxN + 1) * cellH + 12;
  };

  // ─── COVER PAGE ────────────────────────────────────────────────────────────
  drawPageFrame();
  drawPageNumber();

  // Decorative top band
  doc.setFillColor(70, 130, 180);
  doc.rect(marginLeft / 2, marginTop / 2, pageWidth - marginLeft, 60, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('EasyMath', pageWidth / 2, marginTop + 22, { align: 'center' });
  doc.setFontSize(13);
  doc.text('חשבון פשוט לילדים', pageWidth / 2, marginTop + 42, {
    align: 'center',
  });
  doc.setTextColor(0, 0, 0);

  curY = marginTop + 80;

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(70, 130, 180);
  doc.text('הבנת לוח הכפל', pageWidth / 2, curY, { align: 'center' });
  curY += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(90, 90, 90);
  doc.text('מודול לימוד כפל לכיתות א׳–ג׳', pageWidth / 2, curY, {
    align: 'center',
  });
  curY += 30;
  doc.setTextColor(0, 0, 0);

  // Decorative dot array on cover
  const coverArrayY = curY;
  drawDotArray(5, 5, coverArrayY, 16, 6, [100, 149, 237]);
  curY = coverArrayY + 5 * (16 + 6) + 10;

  // School / Teacher info box
  doc.setFillColor(245, 248, 255);
  doc.setDrawColor(180, 200, 230);
  doc.roundedRect(marginLeft + 60, curY, usableWidth - 120, 90, 8, 8, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const infoX = pageWidth - marginRight - 80;
  const infoStartY = curY + 18;
  doc.text(
    `בית ספר: ${opts.schoolName ?? '____________________'}`,
    infoX,
    infoStartY,
    { align: 'right' },
  );
  doc.text(
    `שם המורה: ${opts.teacherName ?? '____________________'}`,
    infoX,
    infoStartY + lineH,
    { align: 'right' },
  );
  doc.text(
    `כיתה: ${opts.grade ?? '____________________'}`,
    infoX,
    infoStartY + 2 * lineH,
    { align: 'right' },
  );
  doc.text('שם התלמיד/ה: ____________________', infoX, infoStartY + 3 * lineH, {
    align: 'right',
  });
  curY += 110;

  // Table of contents
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(70, 130, 180);
  doc.text('תוכן עניינים', pageWidth - marginRight, curY, { align: 'right' });
  curY += 4;
  drawDivider(curY, [150, 190, 230]);
  curY += 10;

  const chapters = [
    'מה זה כפל?',
    'קבוצות של חפצים',
    'שורות ועמודות',
    'מערכים מלבניים',
    'חוק החילוף',
    'דפוסים בכפל',
    'טריקים חכמים לכפל',
    'בנה את לוח הכפל',
    'משחקי כפל',
    'שאלות אתגר',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  chapters.forEach((ch, i) => {
    doc.text(`${i + 1}. פרק ${ch}`, pageWidth - marginRight, curY, {
      align: 'right',
    });
    curY += lineH - 2;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(
    'חוברת זו נועדה ללמד כפל דרך הבנה ויזואלית לפני שינון לוח הכפל',
    pageWidth / 2,
    pageHeight - marginBottom - 20,
    { align: 'center' },
  );
  doc.setTextColor(0, 0, 0);

  // ─── CHAPTER 1 ─────────────────────────────────────────────────────────────
  // מה זה כפל?
  addPage();
  curY = drawChapterTitle(1, 'מה זה כפל?', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'כפל הוא דרך קצרה לחבר את אותו המספר כמה פעמים.',
    curY,
    11,
  );
  curY = paragraphRight(
    'כאשר אנחנו כותבים 3×4, הכוונה היא: שלוש קבוצות של ארבע.',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דוגמה', curY);
  curY = paragraphRight('3×4 = 4+4+4 = 12', curY, 13, 'bold');
  curY = paragraphRight('שלוש קבוצות של ארבע שווה שתים-עשרה.', curY, 11);
  curY += 8;

  // Dot array illustration for 3×4
  curY = paragraphRight('איור: שלוש שורות של ארבעה ריבועים', curY, 10);
  curY = drawDotArray(3, 4, curY, 14, 4, [100, 149, 237]);
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch1Exercises = [
    '2×5 = ___+___ = ____',
    '3×4 = ___+___+___ = ____',
    '4×2 = ___+___+___+___ = ____',
    '5×3 = ___+___+___+___+___ = ____',
    'כתוב בצורת חיבור חוזר: 6×2 = ____',
    'כתוב בצורת כפל: 7+7+7 = __×__ = ____',
  ];
  ch1Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 16);
  });

  // ─── CHAPTER 2 ─────────────────────────────────────────────────────────────
  // קבוצות של חפצים
  addPage();
  curY = drawChapterTitle(2, 'קבוצות של חפצים', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'ניתן לחשוב על כפל כקבוצות של חפצים. כל קבוצה מכילה אותו מספר חפצים.',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דוגמה: 2×3', curY);
  curY = paragraphRight('שתי קבוצות של שלושה – סה"כ 6 חפצים:', curY, 11);
  curY = drawGroupsIllustration(2, 3, curY);
  curY = paragraphRight('2×3 = 6', curY, 12, 'bold');
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch2Exercises = [
    'צייר 3 קבוצות של 2. כמה בסך הכל? 3×2 = ____',
    'צייר 4 קבוצות של 2. כמה בסך הכל? 4×2 = ____',
    'צייר 5 קבוצות של 2. כמה בסך הכל? 5×2 = ____',
    'יש 3 צלחות, בכל צלחת 4 תפוחים. כמה תפוחים בסך הכל? __×__ = ____',
    'יש 2 שקיות, בכל שקית 5 סוכריות. כמה סוכריות? __×__ = ____',
    'השלם: ___ קבוצות של ___ = 3×6',
  ];
  ch2Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 24);
  });

  // ─── CHAPTER 3 ─────────────────────────────────────────────────────────────
  // שורות ועמודות
  addPage();
  curY = drawChapterTitle(3, 'שורות ועמודות', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'כפל ניתן לייצג בעזרת שורות ועמודות של ריבועים.',
    curY,
    11,
  );
  curY = paragraphRight(
    '3×4 פירושו: 3 שורות, ובכל שורה 4 ריבועים.',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דוגמה: 3×4', curY);
  curY = paragraphRight('3 שורות × 4 עמודות = 12 ריבועים:', curY, 11);
  curY = drawDotArray(3, 4, curY, 16, 4, [60, 179, 113]);
  curY = paragraphRight('3×4 = 12', curY, 12, 'bold');
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch3Exercises = [
    'ספור את הריבועים בדוגמה למעלה. כמה יש? ____',
    'צייר מערך של 2 שורות × 4 עמודות. 2×4 = ____',
    'צייר מערך של 3 שורות × 3 עמודות. 3×3 = ____',
    'צייר מערך של 4 שורות × 2 עמודות. 4×2 = ____',
    'מערך של ___ שורות × ___ עמודות = 5×3 = ____',
    'הסתכל על המערך: 5 שורות × 4 עמודות. כמה? ____',
    'צייר מערך עם 6 ריבועים. איזה כפל מתאים? __×__ = ____',
    'צייר מערך עם 8 ריבועים. איזה כפל מתאים? __×__ = ____',
  ];
  ch3Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── CHAPTER 4 ─────────────────────────────────────────────────────────────
  // מערכים מלבניים
  addPage();
  curY = drawChapterTitle(4, 'מערכים מלבניים', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'כפל יוצר מבנה מלבני. ניתן לספור את החפצים במערך כדי למצוא את תוצאת הכפל.',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דוגמה: 4×5', curY);
  curY = paragraphRight('4 שורות × 5 עמודות:', curY, 11);
  curY = drawDotArray(4, 5, curY, 14, 4, [255, 99, 71]);
  curY = paragraphRight('ספור: 4×5 = 20', curY, 12, 'bold');
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול – ספור את החפצים', curY);
  const ch4Exercises = [
    'ספור את הריבועים בדוגמה 4×5 למעלה: ____',
    'צייר מערך 2×6 וספור: 2×6 = ____',
    'צייר מערך 3×5 וספור: 3×5 = ____',
    'מערך של 4×4 – כמה ריבועים? ____',
    'מערך של 5×5 – כמה ריבועים? ____',
    'מה צורת המלבן של 2×10? ____שורות × ____עמודות',
    'אם יש 12 ריבועים, כתוב שתי דרכים לסדר אותם: __×__ ו-__×__',
    'אם יש 16 ריבועים, כתוב שתי דרכים לסדר אותם: __×__ ו-__×__',
  ];
  ch4Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── CHAPTER 5 ─────────────────────────────────────────────────────────────
  // חוק החילוף
  addPage();
  curY = drawChapterTitle(5, 'חוק החילוף', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'חוק החילוף אומר: סדר המספרים בכפל לא משנה את התוצאה.',
    curY,
    11,
  );
  curY = paragraphRight('3×4 = 4×3 = 12', curY, 13, 'bold');
  curY += 6;

  curY = drawSectionHeading('איור: 3×4 ו-4×3', curY);
  curY = paragraphRight('3 שורות × 4 עמודות:', curY, 10);
  curY = drawDotArray(3, 4, curY, 13, 4, [100, 149, 237]);
  curY = paragraphRight('4 שורות × 3 עמודות:', curY, 10);
  curY = drawDotArray(4, 3, curY, 13, 4, [148, 0, 211]);
  curY = paragraphRight('שני המערכים מכילים 12 ריבועים!', curY, 11, 'bold');
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch5Exercises = [
    '2×5 = ____    ו-    5×2 = ____    שווים?',
    '3×6 = ____    ו-    6×3 = ____    שווים?',
    '4×7 = ____    ו-    7×4 = ____    שווים?',
    'אם 8×3 = 24, מה שווה 3×8 = ____',
    'אם 6×9 = 54, מה שווה 9×6 = ____',
    'כתוב כפל הפוך: 5×4 = __×__ = ____',
    'כתוב כפל הפוך: 7×2 = __×__ = ____',
    'הסבר בצורה כלשהי מדוע 3×5 = 5×3',
  ];
  ch5Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── CHAPTER 6 ─────────────────────────────────────────────────────────────
  // דפוסים בכפל
  addPage();
  curY = drawChapterTitle(6, 'דפוסים בכפל', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'בלוח הכפל יש דפוסים מעניינים שעוזרים לנו לזכור תוצאות.',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דפוס 1: כפל ב-2 יוצר מספרים זוגיים', curY);
  curY = paragraphRight(
    '2, 4, 6, 8, 10, 12, 14, 16, 18, 20',
    curY,
    12,
    'bold',
  );
  curY = paragraphRight('כל תוצאה מסתיימת ב: 0, 2, 4, 6, או 8', curY, 11);
  curY += 6;

  curY = drawSectionHeading('דפוס 2: כפל ב-5 מסתיים ב-0 או 5', curY);
  curY = paragraphRight('5, 10, 15, 20, 25, 30, 35, 40, 45, 50', curY, 12, 'bold');
  curY += 6;

  curY = drawSectionHeading('דפוס 3: כפל ב-10 מסתיים ב-0', curY);
  curY = paragraphRight('10, 20, 30, 40, 50, 60, 70, 80, 90, 100', curY, 12, 'bold');
  curY += 10;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch6Exercises = [
    'המשך את הסדרה: 2, 4, 6, ___, ___, ___, ___, ___',
    'המשך את הסדרה: 5, 10, ___, ___, ___, ___, ___',
    'המשך את הסדרה: 10, 20, ___, ___, ___, ___, ___',
    'הצג"כ? 2×8 = ____    האם מסתיים ב-0,2,4,6, או 8? ____',
    'תוצאת 5×7 = ____    מסתיימת ב: ____',
    'כתוב 5 כפלים של 2 שמסתיימים בזוגי: __×2, __×2, __×2, __×2, __×2',
    'זהה את הדפוס: 3, 6, 9, 12, ___, ___, ___',
    'זהה את הדפוס: 4, 8, 12, ___, ___, ___',
  ];
  ch6Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── CHAPTER 7 ─────────────────────────────────────────────────────────────
  // טריקים חכמים לכפל
  addPage();
  curY = drawChapterTitle(7, 'טריקים חכמים לכפל', curY);

  curY = drawSectionHeading('טריק 1: כפל ב-2 = להכפיל פי שניים', curY);
  curY = paragraphRight('2×7 = 7+7 = 14', curY, 12, 'bold');
  curY = paragraphRight('2×9 = 9+9 = 18', curY, 11);
  curY += 6;

  curY = drawSectionHeading('טריק 2: כפל ב-5 – תוצאה מסתיימת ב-0 או 5', curY);
  curY = paragraphRight('5×3 = 15  (מסתיים ב-5)', curY, 12, 'bold');
  curY = paragraphRight('5×4 = 20  (מסתיים ב-0)', curY, 11);
  curY = paragraphRight('מספרים אי-זוגיים × 5 → מסתיים ב-5', curY, 11);
  curY = paragraphRight('מספרים זוגיים × 5 → מסתיים ב-0', curY, 11);
  curY += 6;

  curY = drawSectionHeading('טריק 3: כפל ב-10 = הוסף אפס', curY);
  curY = paragraphRight('10×8 = 80', curY, 12, 'bold');
  curY = paragraphRight('10×6 = 60', curY, 11);
  curY += 8;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול', curY);
  const ch7Exercises = [
    '2×7 = ____',
    '2×9 = ____',
    '5×3 = ____',
    '5×6 = ____',
    '10×4 = ____',
    '10×7 = ____',
    'השתמש בטריק ב-2: 2×12 = ____',
    'השתמש בטריק ב-10: 10×15 = ____',
  ];
  ch7Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── CHAPTER 8 ─────────────────────────────────────────────────────────────
  // בנה את לוח הכפל
  addPage();
  curY = drawChapterTitle(8, 'בנה את לוח הכפל', curY);

  curY = drawSectionHeading('הוראות', curY);
  curY = paragraphRight(
    'מלא את לוח הכפל הריק. השתמש בכל מה שלמדת: דפוסים, טריקים, ושורות ועמודות.',
    curY,
    11,
  );
  curY = paragraphRight(
    'טיפ: התחל מהשורות שאתה מכיר – ×1, ×2, ×5, ×10.',
    curY,
    11,
    'bold',
  );
  curY += 10;

  // Show the completed table first as reference (small)
  curY = drawSectionHeading('לוח הכפל המלא – לעיון בלבד', curY);
  checkPageBreak(11 * 22 + 20);
  curY = drawMultiplicationTable(10, curY);
  curY += 10;

  // ─── CHAPTER 8 continued: blank table ─────────────────────────────────────
  addPage();
  curY = drawChapterTitle(8, 'בנה את לוח הכפל – מלא בעצמך', curY);
  curY = paragraphRight('מלא את כל התאים הריקים:', curY, 11);
  curY += 6;
  checkPageBreak(11 * 24 + 20);
  curY = drawBlankMultiplicationTable(10, curY);

  // ─── CHAPTER 9 ─────────────────────────────────────────────────────────────
  // משחקי כפל
  addPage();
  curY = drawChapterTitle(9, 'משחקי כפל', curY);

  curY = drawSectionHeading('משחק 1: קלפי כפל', curY);
  curY = paragraphRight(
    'ציוד: 20 קלפים עם מספרים 1–10 (שני סטים)',
    curY,
    11,
  );
  curY = paragraphRight('שחקנים: 2–4', curY, 11);
  curY = paragraphRight('כיצד משחקים:', curY, 11, 'bold');
  curY = paragraphRight('1. כתבו מספרים 1–10 על קלפים.', curY, 11);
  curY = paragraphRight('2. ערבבו את הקלפים.', curY, 11);
  curY = paragraphRight('3. כל שחקן שולף שני קלפים.', curY, 11);
  curY = paragraphRight('4. מכפילים את שני המספרים.', curY, 11);
  curY = paragraphRight(
    '5. מי שעונה נכון ראשון מקבל נקודה.',
    curY,
    11,
  );
  curY = paragraphRight('6. מי שמגיע ל-10 נקודות ראשון – מנצח!', curY, 11);
  curY += 10;

  curY = drawSectionHeading('משחק 2: בינגו כפל', curY);
  curY = paragraphRight(
    'צרו לוח בינגו 3×3 עם תוצאות כפל (6, 12, 15, 20, 24, 25, 30, 36, 40).',
    curY,
    11,
  );
  curY = paragraphRight(
    'המורה קורא "כפל": 3×4. תלמידים מסמנים את 12 בלוח שלהם.',
    curY,
    11,
  );
  curY = paragraphRight('מי שמשלים שורה/עמודה/אלכסון – מנצח!', curY, 11);
  curY += 10;

  // Print a bingo card template
  curY = drawSectionHeading('לוח בינגו – מלא בתוצאות כפל', curY);
  const bingoValues = ['6', '12', '15', '20', '24', '25', '30', '36', '40'];
  const bingoCell = 54;
  const bingoStartX = pageWidth / 2 - (3 * bingoCell) / 2;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const bx = bingoStartX + c * bingoCell;
      const by = curY + r * bingoCell;
      doc.setFillColor(230, 240, 255);
      doc.setDrawColor(100, 140, 200);
      doc.roundedRect(bx, by, bingoCell - 2, bingoCell - 2, 4, 4, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(50, 80, 160);
      doc.text(
        bingoValues[r * 3 + c],
        bx + (bingoCell - 2) / 2,
        by + (bingoCell - 2) / 2 + 7,
        { align: 'center' },
      );
    }
  }
  doc.setTextColor(0, 0, 0);
  curY += 3 * bingoCell + 14;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('תרגול – שאלות לפני המשחק', curY);
  const ch9Exercises = [
    'מה עדיף – 3×4 או 4×3? (מה הם שווים?) ____',
    'שלפת 7 ו-3. מה התוצאה? ____',
    'שלפת 5 ו-6. מה התוצאה? ____',
    'שלפת 8 ו-4. מה התוצאה? ____',
  ];
  ch9Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 16);
  });

  // ─── CHAPTER 10 ────────────────────────────────────────────────────────────
  // שאלות אתגר
  addPage();
  curY = drawChapterTitle(10, 'שאלות אתגר', curY);

  curY = drawSectionHeading('הסבר', curY);
  curY = paragraphRight(
    'האתגרים הבאים מעודדים חשיבה גמישה. כמה דרכים שונות אפשר לקבל אותה תוצאה?',
    curY,
    11,
  );
  curY += 6;

  curY = drawSectionHeading('דוגמה: מצא שני כפלים שמגיעים ל-12', curY);
  curY = paragraphRight('3×4 = 12', curY, 12, 'bold');
  curY = paragraphRight('2×6 = 12', curY, 12, 'bold');
  curY = paragraphRight('1×12 = 12', curY, 11);
  curY += 8;

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('אתגרים', curY);
  const ch10Exercises = [
    'מצא שני כפלים שמגיעים ל-24: __×__ = 24 ו- __×__ = 24',
    'מצא שלושה כפלים שמגיעים ל-36: __×__, __×__, __×__',
    'איזה מספר × 5 שווה 35? ____',
    'איזה מספר × 3 שווה 21? ____',
    'כמה 7 יש ב-42? ____',
    'כמה 8 יש ב-56? ____',
    'צייר מערך עם 18 ריבועים בשתי דרכים שונות.',
    'ישנם 32 תלמידים. הם עומדים ב-4 שורות שוות. כמה תלמידים בכל שורה? ____',
  ];
  ch10Exercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 18);
  });

  // ─── BONUS PAGE: Pattern Discovery ─────────────────────────────────────────
  addPage();

  doc.setFillColor(70, 130, 180);
  doc.roundedRect(marginLeft, curY, usableWidth, 36, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('גיליון גילוי דפוסים', pageWidth - marginRight, curY + 24, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  curY += 50;

  curY = drawSectionHeading('צבע את השורות לפי לוח הכפל', curY);
  curY = paragraphRight(
    'הדפס את לוח הכפל. צבע את כל תוצאות הכפל ב-2 באדום, ב-5 בכחול, ב-10 בירוק.',
    curY,
    11,
  );
  curY += 6;

  // Draw a color key
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const colorKeyX = pageWidth - marginRight;
  doc.setFillColor(255, 100, 100);
  doc.circle(colorKeyX - 6, curY - 4, 5, 'F');
  doc.text('× 2 (אדום)', colorKeyX - 16, curY, { align: 'right' });
  curY += lineH;
  doc.setFillColor(100, 149, 237);
  doc.circle(colorKeyX - 6, curY - 4, 5, 'F');
  doc.text('× 5 (כחול)', colorKeyX - 16, curY, { align: 'right' });
  curY += lineH;
  doc.setFillColor(60, 179, 113);
  doc.circle(colorKeyX - 6, curY - 4, 5, 'F');
  doc.text('× 10 (ירוק)', colorKeyX - 16, curY, { align: 'right' });
  curY += lineH + 6;

  doc.setFont('helvetica', 'normal');

  // Print a full 10×10 table for coloring
  checkPageBreak(11 * 22 + 20);
  curY = drawMultiplicationTable(10, curY);
  curY += 14;

  curY = drawSectionHeading('שאלות לאחר הצביעה', curY);
  const patternExercises = [
    'אילו מספרים צבועים גם באדום וגם בכחול? ____',
    'אילו מספרים צבועים בשלושת הצבעים? ____',
    'בשורת ה-2: מה הדפוס שאתה/ת רואה? ____',
    'בשורת ה-5: מה הדפוס שאתה/ת רואה? ____',
  ];
  patternExercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 14);
  });

  // ─── BONUS PAGE: Coloring Worksheet ────────────────────────────────────────
  addPage();

  doc.setFillColor(255, 165, 0);
  doc.roundedRect(marginLeft, curY, usableWidth, 36, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('גיליון צביעת כפל', pageWidth - marginRight, curY + 24, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  curY += 50;

  curY = drawSectionHeading('פתור וצבע', curY);
  curY = paragraphRight(
    'פתור כל תרגיל. אם התוצאה זוגית – צבע כחול. אם אי-זוגית – צבע כתום.',
    curY,
    11,
  );
  curY += 8;

  // Draw colorable exercise boxes
  const colorBoxes = [
    { q: '3×4 = ____', answer: 12, even: true },
    { q: '5×3 = ____', answer: 15, even: false },
    { q: '2×6 = ____', answer: 12, even: true },
    { q: '7×3 = ____', answer: 21, even: false },
    { q: '4×5 = ____', answer: 20, even: true },
    { q: '9×3 = ____', answer: 27, even: false },
    { q: '6×4 = ____', answer: 24, even: true },
    { q: '7×5 = ____', answer: 35, even: false },
  ];

  const boxW = 80;
  const boxH = 50;
  const boxGap = 8;
  const cols = 4;
  const rows = Math.ceil(colorBoxes.length / cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= colorBoxes.length) break;
      const item = colorBoxes[idx];
      const bx = pageWidth - marginRight - (c + 1) * (boxW + boxGap) + boxGap;
      const by = curY + r * (boxH + boxGap);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(100, 149, 237);
      doc.setLineWidth(1.5);
      doc.roundedRect(bx, by, boxW, boxH, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(item.q, bx + boxW / 2, by + 22, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(item.even ? 70 : 200, item.even ? 120 : 70, item.even ? 200 : 20);
      doc.text(item.even ? 'זוגי = כחול' : 'אי-זוגי = כתום', bx + boxW / 2, by + 40, {
        align: 'center',
      });
    }
  }
  doc.setTextColor(0, 0, 0);
  curY += rows * (boxH + boxGap) + 20;

  // ─── BONUS PAGE: Puzzle Worksheet ──────────────────────────────────────────
  addPage();

  doc.setFillColor(148, 0, 211);
  doc.roundedRect(marginLeft, curY, usableWidth, 36, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('פאזל כפל', pageWidth - marginRight, curY + 24, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  curY += 50;

  curY = drawSectionHeading('מצא את המספר החסר', curY);
  curY = paragraphRight('השלם את המספר החסר בכל תרגיל:', curY, 11);
  curY += 6;

  const puzzleExercises = [
    '3 × ___ = 15',
    '___ × 4 = 20',
    '6 × ___ = 30',
    '___ × 7 = 21',
    '5 × ___ = 45',
    '___ × 8 = 32',
    '9 × ___ = 54',
    '___ × 6 = 48',
  ];
  puzzleExercises.forEach((ex, i) => {
    curY = drawExercise(i + 1, ex, curY, 16);
  });

  drawDivider(curY);
  curY += 14;

  curY = drawSectionHeading('שרשרת כפל', curY);
  curY = paragraphRight(
    'כל תשובה הופכת למספר הראשון בתרגיל הבא:',
    curY,
    11,
  );
  curY += 6;

  const chainStart = pageWidth - marginRight;
  const chainItems = [
    '2×3 = ___',
    '___ × 2 = ___',
    '___ × 3 = ___',
    '___ × 2 = ___',
    'תשובה סופית: ___',
  ];
  chainItems.forEach((item, i) => {
    doc.setFont('helvetica', i === chainItems.length - 1 ? 'bold' : 'normal');
    doc.setFontSize(12);
    doc.text(item, chainStart, curY, { align: 'right' });
    if (i < chainItems.length - 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text('↓', chainStart - 10, curY + 10, { align: 'right' });
    }
    curY += lineH + 12;
  });

  // ─── Final summary page ─────────────────────────────────────────────────────
  addPage();

  doc.setFillColor(60, 179, 113);
  doc.roundedRect(marginLeft, curY, usableWidth, 36, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('סיכום – מה למדנו?', pageWidth - marginRight, curY + 24, {
    align: 'right',
  });
  doc.setTextColor(0, 0, 0);
  curY += 50;

  const summaryPoints = [
    'כפל הוא חיבור חוזר של אותו מספר.',
    'ניתן לייצג כפל בעזרת קבוצות, שורות ועמודות.',
    'מערך מלבני עוזר לראות את מבנה הכפל.',
    'חוק החילוף: 3×4 = 4×3.',
    'בכפל ב-2 התוצאה תמיד זוגית.',
    'בכפל ב-5 התוצאה מסתיימת ב-0 או 5.',
    'בכפל ב-10 פשוט מוסיפים אפס לימין המספר.',
    'לוח הכפל ניתן לבנות בעזרת דפוסים וטריקים!',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  summaryPoints.forEach((pt) => {
    checkPageBreak(lineH + 6);
    doc.setFillColor(60, 179, 113);
    doc.circle(pageWidth - marginRight - 5, curY - 4, 4, 'F');
    doc.text(pt, pageWidth - marginRight - 14, curY, { align: 'right' });
    curY += lineH + 4;
  });

  curY += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(70, 130, 180);
  doc.text('כל הכבוד! סיימת את המודול! 🎉', pageWidth / 2, curY, {
    align: 'center',
  });
  doc.setTextColor(0, 0, 0);

  curY += 30;
  doc.setFillColor(245, 250, 255);
  doc.setDrawColor(180, 200, 230);
  doc.roundedRect(marginLeft + 40, curY, usableWidth - 80, 60, 8, 8, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 80, 120);
  doc.text('ציון הבנה:', pageWidth - marginRight - 40, curY + 20, {
    align: 'right',
  });
  doc.line(
    marginLeft + 60,
    curY + 20,
    pageWidth - marginRight - 80,
    curY + 20,
  );
  doc.text('הערת המורה:', pageWidth - marginRight - 40, curY + 44, {
    align: 'right',
  });
  doc.line(
    marginLeft + 60,
    curY + 44,
    pageWidth - marginRight - 80,
    curY + 44,
  );
  doc.setTextColor(0, 0, 0);

  return doc;
}
