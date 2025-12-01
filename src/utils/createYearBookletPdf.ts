// src/utils/createYearBookletPdf.ts
import jsPDF from 'jspdf';
import type { Question } from '../types/questions';
import type { YearPlan } from '../types/yearPlan';

interface YearBookletOptions {
  grade: string;
  subject: string;
  schoolName?: string;
  teacherName?: string;
  title?: string; // "חוברת תרגול שנתית"
  questionsPerMonth?: number;
}

function getRandomSubset<T>(items: T[], count: number): T[] {
  if (count >= items.length) return [...items];
  const copy = [...items];
  const result: T[] = [];
  while (result.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

export function createYearBookletPdf(
  plan: YearPlan,
  allQuestions: Question[],
  opts: YearBookletOptions
) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const usableWidth = pageWidth - margin * 2;
  const lineHeight = 18;

  const months = Array.from(new Set(plan.weeks.map((w) => w.month)));

  const drawMonthHeader = (month: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);

    const title = opts.title ?? 'חוברת תרגול שנתית';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, pageWidth / 2 - titleWidth / 2, margin);

    doc.setFontSize(14);
    doc.text(`חודש: ${month}`, margin, margin + 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`בית ספר: ${opts.schoolName ?? ''}`, margin, margin + 50);
    doc.text(`כיתה: ${opts.grade}`, margin, margin + 50 + lineHeight);
    if (opts.teacherName) {
      doc.text(
        `מורה: ${opts.teacherName}`,
        margin,
        margin + 50 + 2 * lineHeight
      );
    }
    // שם תלמיד
    const y = margin + 50 + 3 * lineHeight;
    doc.text('שם התלמיד:', margin, y);
    doc.line(margin + 70, y, pageWidth - margin, y);

    return y + lineHeight * 1.5;
  };

  const questionsPerMonth = opts.questionsPerMonth ?? 10;

  months.forEach((month, monthIndex) => {
    if (monthIndex > 0) {
      doc.addPage();
    }

    let y = drawMonthHeader(month);

    // מוצא את כל הנושאים החודשיים בתכנית
    const monthWeeks = plan.weeks.filter((w) => w.month === month);
    const topics = new Set(monthWeeks.map((w) => w.topic));
    const subtopics = new Set(
      monthWeeks.map((w) => w.subtopic).filter(Boolean) as string[]
    );

    let monthQuestions = allQuestions.filter((q) => topics.has(q.topic));

    if (subtopics.size) {
      monthQuestions = monthQuestions.filter(
        (q) => !q.subtopic || subtopics.has(q.subtopic)
      );
    }

    const chosen = getRandomSubset(monthQuestions, questionsPerMonth);

    if (!chosen.length) {
      doc.setFontSize(12);
      doc.text(
        'לא נמצאו תרגילים מתאימים לחודש זה במערכת.',
        margin,
        y + lineHeight
      );
      return;
    }

    doc.setFontSize(12);

    chosen.forEach((q, idx) => {
      const text = `${idx + 1}. ${q.promptHe}`;
      const wrapped = doc.splitTextToSize(text, usableWidth);
      const linesForAnswer = q.options ? 1 : 2;
      const neededHeight =
        wrapped.length * lineHeight + linesForAnswer * lineHeight * 1.4;

      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = drawMonthHeader(month);
        doc.setFontSize(12);
      }

      doc.text(wrapped, margin, y);
      y += wrapped.length * lineHeight + 4;

      for (let i = 0; i < linesForAnswer; i++) {
        const lineY = y + i * lineHeight * 1.4;
        doc.line(margin, lineY, margin + usableWidth, lineY);
      }

      y += linesForAnswer * lineHeight * 1.4 + lineHeight * 0.7;
    });
  });

  return doc;
}
