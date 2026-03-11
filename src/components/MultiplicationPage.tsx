// src/components/MultiplicationPage.tsx
// עמוד "הבנת לוח הכפל" – 10 פרקים אינטראקטיביים לכיתות א׳–ג׳
// v1.1.0 | 2026-03-11

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMultiplicationBookletPdf } from '../utils/createMultiplicationBookletPdf';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Exercise {
  id: number;
  text: string;
  answer?: string;
}

interface Chapter {
  num: number;
  title: string;
  icon: string;
  explanation: string;
  example: string;
  visual: React.ReactNode;
  exercises: Exercise[];
}

// ─── Visual helpers ────────────────────────────────────────────────────────────

function DotArray({
  rows,
  cols,
  color = '#6495ED',
}: {
  rows: number;
  cols: number;
  color?: string;
}) {
  return (
    <div
      style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, direction: 'ltr' }}
      aria-label={`מערך של ${rows} שורות ו-${cols} עמודות`}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function GroupsVisual({ groups, perGroup }: { groups: number; perGroup: number }) {
  const colors = ['#FF6347', '#3CB371', '#6495ED', '#FFA500', '#9400D3'];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', direction: 'ltr' }}>
      {Array.from({ length: groups }).map((_, g) => (
        <div
          key={g}
          style={{
            border: `2px dashed ${colors[g % colors.length]}`,
            borderRadius: 8,
            padding: '6px 8px',
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            maxWidth: perGroup * 28,
          }}
        >
          {Array.from({ length: perGroup }).map((_, i) => (
            <span key={i} style={{ fontSize: 20 }}>
              🍎
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function PatternRow({ values, color }: { values: number[]; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', direction: 'ltr' }}>
      {values.map((v, i) => (
        <span
          key={i}
          style={{
            backgroundColor: color,
            color: '#fff',
            borderRadius: 20,
            padding: '4px 10px',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

function MultiplicationTable({
  maxN = 10,
  highlight = [] as number[],
}: {
  maxN?: number;
  highlight?: number[];
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          fontSize: 11,
          direction: 'ltr',
        }}
      >
        <tbody>
          {Array.from({ length: maxN + 1 }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: maxN + 1 }).map((_, c) => {
                const val = r === 0 ? (c === 0 ? '×' : c) : c === 0 ? r : r * c;
                const isHeader = r === 0 || c === 0;
                const isHighlighted =
                  typeof val === 'number' && highlight.includes(val);
                return (
                  <td
                    key={c}
                    style={{
                      width: 28,
                      height: 24,
                      textAlign: 'center',
                      border: '1px solid #c7d7ee',
                      fontWeight: isHeader ? 'bold' : 'normal',
                      backgroundColor: isHeader
                        ? '#4682B4'
                        : isHighlighted
                        ? '#FFD700'
                        : r % 2 === 0
                        ? '#f0f6ff'
                        : '#fff',
                      color: isHeader ? '#fff' : '#333',
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Chapters data ─────────────────────────────────────────────────────────────

function buildChapters(): Chapter[] {
  return [
    {
      num: 1,
      title: 'מה זה כפל?',
      icon: '✖️',
      explanation:
        'כפל הוא דרך קצרה לחבר את אותו המספר כמה פעמים. כאשר כותבים 3×4, הכוונה היא שלוש קבוצות של ארבע.',
      example: '3×4 = 4+4+4 = 12',
      visual: (
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-slate-500">שלוש שורות של ארבעה ריבועים:</p>
          <DotArray rows={3} cols={4} color="#6495ED" />
        </div>
      ),
      exercises: [
        { id: 1, text: '2×5 = ___+___ = ____' },
        { id: 2, text: '3×4 = ___+___+___ = ____' },
        { id: 3, text: '4×2 = ___+___+___+___ = ____' },
        { id: 4, text: '5×3 = ___+___+___+___+___ = ____' },
        { id: 5, text: 'כתוב בצורת חיבור חוזר: 6×2 = ____' },
        { id: 6, text: 'כתוב בצורת כפל: 7+7+7 = __×__ = ____' },
      ],
    },
    {
      num: 2,
      title: 'קבוצות של חפצים',
      icon: '🍎',
      explanation:
        'ניתן לחשוב על כפל כקבוצות של חפצים. כל קבוצה מכילה אותו מספר חפצים.',
      example: '2×3 – שתי קבוצות של שלושה = 6',
      visual: (
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-slate-500">שתי קבוצות של שלושה תפוחים:</p>
          <GroupsVisual groups={2} perGroup={3} />
          <p className="font-bold text-blue-700">2×3 = 6</p>
        </div>
      ),
      exercises: [
        { id: 1, text: 'צייר 3 קבוצות של 2. כמה בסך הכל?  3×2 = ____' },
        { id: 2, text: 'צייר 4 קבוצות של 2. כמה בסך הכל?  4×2 = ____' },
        { id: 3, text: 'צייר 5 קבוצות של 2. כמה בסך הכל?  5×2 = ____' },
        { id: 4, text: 'יש 3 צלחות, בכל צלחת 4 תפוחים. כמה תפוחים?  __×__ = ____' },
        { id: 5, text: 'יש 2 שקיות, בכל שקית 5 סוכריות. כמה סוכריות?  __×__ = ____' },
        { id: 6, text: 'השלם: ___ קבוצות של ___ = 3×6' },
      ],
    },
    {
      num: 3,
      title: 'שורות ועמודות',
      icon: '⬛',
      explanation:
        'כפל ניתן לייצג בעזרת שורות ועמודות של ריבועים. 3×4 פירושו: 3 שורות, ובכל שורה 4 ריבועים.',
      example: '3×4 – 3 שורות × 4 עמודות = 12',
      visual: (
        <div className="flex flex-col items-end gap-2">
          <DotArray rows={3} cols={4} color="#3CB371" />
          <p className="font-bold text-green-700">3×4 = 12</p>
        </div>
      ),
      exercises: [
        { id: 1, text: 'ספור את הריבועים בדוגמה למעלה. כמה יש? ____' },
        { id: 2, text: 'צייר מערך של 2 שורות × 4 עמודות.  2×4 = ____' },
        { id: 3, text: 'צייר מערך של 3 שורות × 3 עמודות.  3×3 = ____' },
        { id: 4, text: 'צייר מערך של 4 שורות × 2 עמודות.  4×2 = ____' },
        { id: 5, text: 'מערך של ___ שורות × ___ עמודות = 5×3 = ____' },
        { id: 6, text: 'מה הכפל של מערך 5 שורות × 4 עמודות? ____' },
        { id: 7, text: 'צייר מערך עם 6 ריבועים: __×__ = ____' },
        { id: 8, text: 'צייר מערך עם 8 ריבועים: __×__ = ____' },
      ],
    },
    {
      num: 4,
      title: 'מערכים מלבניים',
      icon: '🟦',
      explanation:
        'כפל יוצר מבנה מלבני. ניתן לספור את החפצים במערך כדי למצוא את תוצאת הכפל.',
      example: '4×5 – 4 שורות × 5 עמודות',
      visual: (
        <div className="flex flex-col items-end gap-2">
          <DotArray rows={4} cols={5} color="#FF6347" />
          <p className="font-bold text-red-600">4×5 = 20</p>
        </div>
      ),
      exercises: [
        { id: 1, text: 'ספור את הריבועים בדוגמה 4×5. כמה? ____' },
        { id: 2, text: 'צייר מערך 2×6 וספור:  2×6 = ____' },
        { id: 3, text: 'צייר מערך 3×5 וספור:  3×5 = ____' },
        { id: 4, text: 'מערך של 4×4 – כמה ריבועים? ____' },
        { id: 5, text: 'מערך של 5×5 – כמה ריבועים? ____' },
        { id: 6, text: 'מה צורת המלבן של 2×10? ___ שורות × ___ עמודות' },
        { id: 7, text: 'אם יש 12 ריבועים, כתוב שתי דרכים: __×__ ו- __×__' },
        { id: 8, text: 'אם יש 16 ריבועים, כתוב שתי דרכים: __×__ ו- __×__' },
      ],
    },
    {
      num: 5,
      title: 'חוק החילוף',
      icon: '🔄',
      explanation:
        'חוק החילוף אומר: סדר המספרים בכפל לא משנה את התוצאה. 3×4 = 4×3 = 12.',
      example: '3×4 = 4×3',
      visual: (
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-6 items-end">
            <div className="flex flex-col items-center gap-1">
              <DotArray rows={3} cols={4} color="#6495ED" />
              <span className="text-xs font-bold text-blue-700">3×4 = 12</span>
            </div>
            <span className="text-2xl font-bold text-slate-400">=</span>
            <div className="flex flex-col items-center gap-1">
              <DotArray rows={4} cols={3} color="#9400D3" />
              <span className="text-xs font-bold text-purple-700">4×3 = 12</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">שני המערכים מכילים 12 ריבועים!</p>
        </div>
      ),
      exercises: [
        { id: 1, text: '2×5 = ____  ו-  5×2 = ____  שווים?' },
        { id: 2, text: '3×6 = ____  ו-  6×3 = ____  שווים?' },
        { id: 3, text: '4×7 = ____  ו-  7×4 = ____  שווים?' },
        { id: 4, text: 'אם 8×3 = 24, מה שווה 3×8 = ____' },
        { id: 5, text: 'אם 6×9 = 54, מה שווה 9×6 = ____' },
        { id: 6, text: 'כתוב כפל הפוך: 5×4 = __×__ = ____' },
        { id: 7, text: 'כתוב כפל הפוך: 7×2 = __×__ = ____' },
        { id: 8, text: 'הסבר: מדוע 3×5 = 5×3?' },
      ],
    },
    {
      num: 6,
      title: 'דפוסים בכפל',
      icon: '🔢',
      explanation:
        'בלוח הכפל יש דפוסים מעניינים שעוזרים לנו לזכור תוצאות. כפל ב-2 תמיד זוגי, כפל ב-5 מסתיים ב-0 או 5, כפל ב-10 מסתיים ב-0.',
      example: 'כפל ב-2: 2, 4, 6, 8, 10...',
      visual: (
        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-red-600">כפל ב-2:</p>
            <PatternRow values={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]} color="#ef4444" />
            <p className="text-xs font-bold text-blue-600">כפל ב-5:</p>
            <PatternRow values={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]} color="#3b82f6" />
            <p className="text-xs font-bold text-green-600">כפל ב-10:</p>
            <PatternRow values={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} color="#16a34a" />
          </div>
        </div>
      ),
      exercises: [
        { id: 1, text: 'המשך: 2, 4, 6, ___, ___, ___, ___, ___' },
        { id: 2, text: 'המשך: 5, 10, ___, ___, ___, ___, ___' },
        { id: 3, text: 'המשך: 10, 20, ___, ___, ___, ___, ___' },
        { id: 4, text: '2×8 = ____  האם מסתיים בזוגי? ____' },
        { id: 5, text: '5×7 = ____  מסתיים ב: ____' },
        { id: 6, text: 'כתוב 5 כפלים של 2 שמסתיימים בזוגי' },
        { id: 7, text: 'זהה דפוס: 3, 6, 9, 12, ___, ___, ___' },
        { id: 8, text: 'זהה דפוס: 4, 8, 12, ___, ___, ___' },
      ],
    },
    {
      num: 7,
      title: 'טריקים חכמים',
      icon: '💡',
      explanation:
        'יש טריקים שעוזרים לחשב מהר! כפל ב-2 = להכפיל פי שניים. כפל ב-5 = תוצאה ב-0 או 5. כפל ב-10 = הוסף אפס.',
      example: '2×7=14  |  5×3=15  |  10×8=80',
      visual: (
        <div className="flex flex-col gap-3">
          {[
            { label: '×2', trick: 'הכפל פי שניים', ex: '2×7 = 14', color: '#ef4444' },
            { label: '×5', trick: 'מסתיים ב-0 או 5', ex: '5×4 = 20', color: '#3b82f6' },
            { label: '×10', trick: 'הוסף אפס', ex: '10×6 = 60', color: '#16a34a' },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                border: `2px solid ${t.color}`,
                borderRadius: 8,
                padding: '8px 12px',
                backgroundColor: `${t.color}11`,
                textAlign: 'right',
              }}
            >
              <span style={{ fontWeight: 'bold', color: t.color, fontSize: 16 }}>
                {t.label}
              </span>{' '}
              — {t.trick}
              <br />
              <span style={{ fontSize: 13, color: '#444' }}>{t.ex}</span>
            </div>
          ))}
        </div>
      ),
      exercises: [
        { id: 1, text: '2×7 = ____' },
        { id: 2, text: '2×9 = ____' },
        { id: 3, text: '5×3 = ____' },
        { id: 4, text: '5×6 = ____' },
        { id: 5, text: '10×4 = ____' },
        { id: 6, text: '10×7 = ____' },
        { id: 7, text: 'השתמש בטריק ב-2: 2×12 = ____' },
        { id: 8, text: 'השתמש בטריק ב-10: 10×15 = ____' },
      ],
    },
    {
      num: 8,
      title: 'בנה את לוח הכפל',
      icon: '📊',
      explanation:
        'השתמש בכל מה שלמדת: דפוסים, טריקים, שורות ועמודות. התחל מהשורות שאתה מכיר – ×1, ×2, ×5, ×10.',
      example: 'לוח כפל מלא 10×10',
      visual: (
        <div className="flex flex-col items-end gap-2">
          <p className="text-xs text-slate-500 mb-1">לוח הכפל לעיון:</p>
          <MultiplicationTable maxN={10} />
        </div>
      ),
      exercises: [
        { id: 1, text: 'מה התוצאה של 3×7? ____' },
        { id: 2, text: 'מה התוצאה של 6×8? ____' },
        { id: 3, text: 'מה התוצאה של 9×9? ____' },
        { id: 4, text: 'איזה שורה הכי קל לזכור? למה?' },
        { id: 5, text: 'מצא 3 תוצאות שמופיעות יותר מפעם אחת בלוח: ____' },
        { id: 6, text: 'בלוח: 7×8 = ____  ו-  8×7 = ____' },
        { id: 7, text: 'מהי התוצאה הגדולה ביותר בלוח? ____' },
        { id: 8, text: 'מהי התוצאה הקטנה ביותר מ-1×1 ועד 10×10? ____' },
      ],
    },
    {
      num: 9,
      title: 'משחקי כפל',
      icon: '🎲',
      explanation:
        'משחק קלפי כפל: שלוף שני קלפים עם מספרים 1–10, הכפל אותם. מי שעונה נכון ראשון – מקבל נקודה!',
      example: 'שלפת 7 ו-3 → 7×3 = 21 ✅',
      visual: (
        <div className="flex flex-col gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#fff',
              textAlign: 'right',
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
              🃏 משחק קלפי כפל
            </p>
            <p style={{ fontSize: 12, lineHeight: 1.6 }}>
              1. כתבו מספרים 1–10 על קלפים
              <br />
              2. ערבבו את הקלפים
              <br />
              3. שלפו שני קלפים
              <br />
              4. הכפילו את המספרים
              <br />
              5. מי שעונה נכון ראשון מקבל נקודה!
            </p>
          </div>
          <div
            style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: 12,
              padding: '12px 16px',
              textAlign: 'right',
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: 14, color: '#92400e', marginBottom: 4 }}>
              🎯 בינגו כפל
            </p>
            <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
              מלא לוח 3×3 עם תוצאות כפל.
              <br />
              המורה קורא "3×4" – סמן 12 בלוח שלך.
              <br />
              מי שמשלים שורה – מנצח!
            </p>
          </div>
        </div>
      ),
      exercises: [
        { id: 1, text: 'מה עדיף – 3×4 או 4×3? (שווים?) ____' },
        { id: 2, text: 'שלפת 7 ו-3. מה התוצאה? ____' },
        { id: 3, text: 'שלפת 5 ו-6. מה התוצאה? ____' },
        { id: 4, text: 'שלפת 8 ו-4. מה התוצאה? ____' },
        { id: 5, text: 'מי מנצח? שחקן א׳ קיבל 24, שחקן ב׳ קיבל 36. מי ניצח? ____' },
        { id: 6, text: 'כתוב 3 קלפים שתוצאתם גדולה מ-40: ____' },
        { id: 7, text: 'כתוב 3 קלפים שתוצאתם קטנה מ-10: ____' },
        { id: 8, text: 'כמה נקודות מירבי אפשר לקבל ב-5 סיבובים? ____' },
      ],
    },
    {
      num: 10,
      title: 'שאלות אתגר',
      icon: '🏆',
      explanation:
        'האתגרים מעודדים חשיבה גמישה. כמה דרכים שונות אפשר לקבל אותה תוצאה?',
      example: '3×4=12, 2×6=12, 1×12=12 – שלוש דרכים לקבל 12!',
      visual: (
        <div className="flex flex-col gap-2">
          {[
            { result: 12, pairs: ['3×4', '2×6', '1×12'] },
            { result: 24, pairs: ['4×6', '3×8', '2×12'] },
            { result: 36, pairs: ['6×6', '4×9', '3×12'] },
          ].map(({ result, pairs }) => (
            <div
              key={result}
              style={{
                border: '2px solid #10b981',
                borderRadius: 8,
                padding: '8px 12px',
                background: '#ecfdf5',
                textAlign: 'right',
              }}
            >
              <strong style={{ color: '#065f46' }}>{result} =</strong>{' '}
              {pairs.map((p, i) => (
                <span key={i}>
                  <span
                    style={{
                      backgroundColor: '#10b981',
                      color: '#fff',
                      borderRadius: 12,
                      padding: '2px 8px',
                      fontSize: 13,
                      marginRight: 4,
                    }}
                  >
                    {p}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      ),
      exercises: [
        { id: 1, text: 'מצא שני כפלים שמגיעים ל-24: __×__ ו- __×__' },
        { id: 2, text: 'מצא שלושה כפלים שמגיעים ל-36: __×__, __×__, __×__' },
        { id: 3, text: 'איזה מספר × 5 שווה 35? ____' },
        { id: 4, text: 'איזה מספר × 3 שווה 21? ____' },
        { id: 5, text: 'כמה 7 יש ב-42? ____' },
        { id: 6, text: 'כמה 8 יש ב-56? ____' },
        { id: 7, text: 'יש 32 תלמידים ב-4 שורות שוות. כמה בכל שורה? ____' },
        { id: 8, text: 'מצא 3 תוצאות שאפשר להגיע אליהן בשתי דרכים שונות' },
      ],
    },
  ];
}

// ─── Chapter Card ──────────────────────────────────────────────────────────────

function ChapterCard({
  chapter,
  isOpen,
  onToggle,
}: {
  chapter: Chapter;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const headerColors = [
    '#4682B4', '#3CB371', '#FF6347', '#9370DB',
    '#20B2AA', '#FF8C00', '#DC143C', '#4169E1',
    '#2E8B57', '#8B0000',
  ];
  const color = headerColors[(chapter.num - 1) % headerColors.length];

  return (
    <div
      style={{
        border: `2px solid ${color}33`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: color,
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 'bold' }}>
          {chapter.icon} פרק {chapter.num} — {chapter.title}
        </span>
        <span style={{ fontSize: 20, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div style={{ padding: '16px', backgroundColor: '#fff', direction: 'rtl' }}>
          {/* Explanation */}
          <div
            style={{
              background: '#f0f6ff',
              borderRight: `4px solid ${color}`,
              borderRadius: '0 8px 8px 0',
              padding: '10px 14px',
              marginBottom: 14,
            }}
          >
            <p style={{ fontWeight: 'bold', color: '#1e3a5f', marginBottom: 4, fontSize: 13 }}>
              📖 הסבר
            </p>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
              {chapter.explanation}
            </p>
          </div>

          {/* Example */}
          <div
            style={{
              background: '#fffbeb',
              border: '1.5px dashed #f59e0b',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 14,
            }}
          >
            <p style={{ fontWeight: 'bold', color: '#92400e', marginBottom: 4, fontSize: 13 }}>
              ✏️ דוגמה
            </p>
            <p style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', fontFamily: 'monospace' }}>
              {chapter.example}
            </p>
          </div>

          {/* Visual */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '12px 14px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {chapter.visual}
          </div>

          {/* Exercises */}
          <div>
            <p
              style={{
                fontWeight: 'bold',
                color: color,
                marginBottom: 10,
                fontSize: 14,
                borderBottom: `2px solid ${color}33`,
                paddingBottom: 6,
              }}
            >
              📝 תרגול
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {ex.id}
                  </span>
                  <span style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.6 }}>
                    {ex.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MultiplicationPage() {
  const navigate = useNavigate();
  const chapters = buildChapters();
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set([1]));

  const toggleChapter = (num: number) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const openAll = () => setOpenChapters(new Set(chapters.map((c) => c.num)));
  const closeAll = () => setOpenChapters(new Set());

  const handleDownloadPdf = () => {
    const doc = createMultiplicationBookletPdf({
      schoolName: 'בית ספר לדוגמה',
      teacherName: 'המורה',
      grade: 'א׳–ג׳',
    });
    doc.save('multiplication_booklet.pdf');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f6ff',
        direction: 'rtl',
        fontFamily: 'inherit',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4682B4, #6a5acd)',
          color: '#fff',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 8,
                color: '#fff',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ direction: 'ltr' }}>←</span> חזרה
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 'bold', margin: 0 }}>
              ✖️ הבנת לוח הכפל
            </h1>
          </div>
          <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>
            10 פרקים | כיתות א׳–ג׳ | מכפל כחיבור חוזר ועד שאלות אתגר
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px' }}>

        {/* Action bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={openAll}
              style={{
                background: '#4682B4',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              פתח הכל
            </button>
            <button
              type="button"
              onClick={closeAll}
              style={{
                background: '#fff',
                color: '#4682B4',
                border: '1.5px solid #4682B4',
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              סגור הכל
            </button>
          </div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            style={{
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            📥 הורד חוברת PDF
          </button>
        </div>

        {/* Quick nav chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {chapters.map((ch) => (
            <button
              key={ch.num}
              type="button"
              onClick={() => {
                setOpenChapters((prev) => {
                  const next = new Set(prev);
                  next.add(ch.num);
                  return next;
                });
                setTimeout(() => {
                  document
                    .getElementById(`chapter-${ch.num}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              style={{
                background: openChapters.has(ch.num) ? '#4682B4' : '#e2e8f0',
                color: openChapters.has(ch.num) ? '#fff' : '#475569',
                border: 'none',
                borderRadius: 20,
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {ch.icon} {ch.num}. {ch.title}
            </button>
          ))}
        </div>

        {/* Chapters */}
        {chapters.map((ch) => (
          <div key={ch.num} id={`chapter-${ch.num}`}>
            <ChapterCard
              chapter={ch}
              isOpen={openChapters.has(ch.num)}
              onToggle={() => toggleChapter(ch.num)}
            />
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#94a3b8',
            fontSize: 12,
          }}
        >
          EasyMath · הבנת לוח הכפל · v1.1.0 | 11.03.2026
        </div>
      </div>
    </div>
  );
}
