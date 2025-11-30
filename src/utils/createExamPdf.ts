// src/utils/createExamPdf.ts
import jsPDF from 'jspdf';
import type { PrintableExam } from '../types/printable';

export function createExamPdf(exam: PrintableExam) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 40;
  const usableWidth = pageWidth - margin * 2;
  const lineHeight = 18;

  const drawPageFrame = () => {
    doc.setDrawColor(60);
    doc.setLineWidth(1.2);
    doc.rect(
      margin / 2,
      margin / 2,
      pageWidth - margin,
      pageHeight - margin
    );
  };

  const drawHeader = () => {
    drawPageFrame();

    // בית ספר + כותרת
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(exam.schoolName ?? 'בית ספר', margin, margin + 5);

    doc.setFontSize(16);
    const title = exam.title || 'מבחן חשבון';
    const titleWidth =
      doc.getTextWidth(title) || title.length * 5;
    doc.text(
      title,
      pageWidth / 2 - titleWidth / 2,
      margin + 5
    );

    // כיתה, תאריך, מקצוע
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const topY = margin + 28;

    doc.text(
      `כיתה: ${exam.grade}`,
      margin,
      topY
    );
    if (exam.teacherName) {
      doc.text(
        `מורה: ${exam.teacherName}`,
        margin,
        topY + lineHeight
      );
    }

    doc.text(
      `מקצוע: ${exam.subject}`,
      pageWidth - margin - 130,
      topY
    );

    if (exam.date) {
      const dateStr = new Date(exam.date).toLocaleDateString('he-IL');
      doc.text(
        `תאריך: ${dateStr}`,
        pageWidth - margin - 130,
        topY + lineHeight
      );
    }

    // שם התלמיד
    const studentLineY = topY + lineHeight * 2.2;
    doc.text(
      'שם התלמיד:',
      margin,
      studentLineY
    );
    // קו לכתיבה
    doc.line(
      margin + 70,
      studentLineY,
      pageWidth - margin,
      studentLineY
    );

    // הוראות כלליות
    const instY = studentLineY + lineHeight * 1.8;
    const instructions =
      exam.instructions ||
      'ענה/י על כל השאלות. מותר להשתמש בדף טיוטה.';
    const wrapped = doc.splitTextToSize(instructions, usableWidth);
    doc.text(wrapped, margin, instY);

    return instY + wrapped.length * lineHeight + lineHeight;
  };

  let cursorY = drawHeader();

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  exam.questions.forEach((q) => {
    const questionText = `${q.number}. ${q.text}`;
    const wrapped = doc.splitTextToSize(questionText, usableWidth);
    const neededHeight =
      wrapped.length * lineHeight + (q.linesForAnswer ?? 2) * lineHeight * 1.2;

    // אם אין מקום – עמוד חדש
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = drawHeader();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
    }

    // טקסט השאלה
    doc.text(wrapped, margin, cursorY);
    cursorY += wrapped.length * lineHeight + 4;

    // קווים לתשובה
    const lines = q.linesForAnswer ?? 2;
    for (let i = 0; i < lines; i++) {
      const y = cursorY + i * lineHeight * 1.2;
      doc.line(margin, y, margin + usableWidth, y);
    }

    cursorY += lines * lineHeight * 1.2 + lineHeight * 0.7;
  });

  return doc;
}
