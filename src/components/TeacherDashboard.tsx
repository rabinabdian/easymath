// src/components/TeacherDashboard.tsx
import { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import type { Difficulty, TopicId, Question } from '../types/questions';
import StudentGame from './StudentGame';

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

export default function TeacherDashboard() {
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('numbers');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('easy');
  const [count, setCount] = useState<number>(5);
  const [generated, setGenerated] = useState<Question[]>([]);

  const topic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopic),
    [selectedTopic]
  );

  const subtopics = topic?.subtopics ?? [];

  const handleGenerate = () => {
    let filtered = QUESTIONS.filter((q) => q.topic === selectedTopic);

    if (selectedSubtopic) {
      filtered = filtered.filter((q) => q.subtopic === selectedSubtopic);
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }

    const chosen = getRandomSubset(filtered, count);
    setGenerated(chosen);
  };

  const handleDownloadPdf = () => {
    if (generated.length === 0) return;

    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    const marginLeft = 40;
    const marginTop = 40;
    const lineHeight = 20;
    const maxWidth = 500;

    let y = marginTop;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('מבחן חשבון – נוצר במערכת Easymath', marginLeft, y);
    y += lineHeight * 2;

    generated.forEach((q, index) => {
      const text = `${index + 1}. ${q.prompt}`;
      const lines = doc.splitTextToSize(text, maxWidth);

      if (y + lines.length * lineHeight > 800) {
        doc.addPage();
        y = marginTop;
      }

      doc.text(lines, marginLeft, y);
      y += lines.length * lineHeight + lineHeight;
    });

    doc.save('exam.pdf');
  };

  const difficultyLabels: Record<Difficulty, string> = {
    easy: 'קל',
    medium: 'בינוני',
    hard: 'קשה',
  };

  // אם במצב תלמיד, הצג את משחק התלמיד
  if (mode === 'student') {
    return (
      <StudentGame
        questions={generated.length ? generated : QUESTIONS.slice(0, 10)}
        onExit={() => setMode('teacher')}
      />
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: '2rem', color: '#1a1a1a', fontSize: '2rem' }}>
        🎓 ממשק מורה – בניית תרגול
      </h1>

      {/* בחירת נושא */}
      <section
        style={{
          border: '2px solid #e5e7eb',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: '#f9fafb',
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.25rem' }}>
          📚 בחירת נושא
        </h2>
        <select
          value={selectedTopic}
          onChange={(e) => {
            const value = e.target.value as TopicId;
            setSelectedTopic(value);
            setSelectedSubtopic('');
          }}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            minWidth: 250,
          }}
        >
          {TOPICS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        {subtopics.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <label style={{ marginLeft: 8, fontWeight: 500 }}>תת־נושא:</label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginRight: 8,
                minWidth: 200,
              }}
            >
              <option value="">כל התת־נושאים</option>
              {subtopics.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* רמת קושי + כמות */}
      <section
        style={{
          border: '2px solid #e5e7eb',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: '#f9fafb',
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.25rem' }}>
          ⚙️ הגדרות תרגול
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <span style={{ marginLeft: 12, fontWeight: 500 }}>רמת קושי:</span>
          <label style={{ marginLeft: 16, cursor: 'pointer' }}>
            <input
              type="radio"
              value="all"
              checked={difficulty === 'all'}
              onChange={() => setDifficulty('all')}
              style={{ marginLeft: 6 }}
            />
            הכל
          </label>
          <label style={{ marginLeft: 16, cursor: 'pointer' }}>
            <input
              type="radio"
              value="easy"
              checked={difficulty === 'easy'}
              onChange={() => setDifficulty('easy')}
              style={{ marginLeft: 6 }}
            />
            קל
          </label>
          <label style={{ marginLeft: 16, cursor: 'pointer' }}>
            <input
              type="radio"
              value="medium"
              checked={difficulty === 'medium'}
              onChange={() => setDifficulty('medium')}
              style={{ marginLeft: 6 }}
            />
            בינוני
          </label>
          <label style={{ marginLeft: 16, cursor: 'pointer' }}>
            <input
              type="radio"
              value="hard"
              checked={difficulty === 'hard'}
              onChange={() => setDifficulty('hard')}
              style={{ marginLeft: 6 }}
            />
            קשה
          </label>
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>
            כמות תרגילים:{' '}
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              style={{
                width: 80,
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginRight: 8,
              }}
            />
          </label>
        </div>
      </section>

      {/* כפתורי פעולה */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleGenerate}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ✨ צור רשימת תרגילים
        </button>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={generated.length === 0}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: 10,
            border: '1px solid #2563eb',
            background: '#fff',
            color: '#2563eb',
            cursor: generated.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 600,
            opacity: generated.length === 0 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (generated.length > 0) {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#2563eb';
          }}
        >
          📄 הורד כ-PDF
        </button>

        <button
          type="button"
          onClick={() => setMode('student')}
          disabled={generated.length === 0}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: 10,
            border: 'none',
            background: generated.length === 0 ? '#9ca3af' : '#10b981',
            color: '#fff',
            cursor: generated.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (generated.length > 0) {
              e.currentTarget.style.background = '#059669';
            }
          }}
          onMouseLeave={(e) => {
            if (generated.length > 0) {
              e.currentTarget.style.background = '#10b981';
            }
          }}
        >
          🎮 מצב תלמיד
        </button>
      </div>

      {/* תצוגת התרגילים שנוצרו */}
      <section>
        {generated.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              background: '#f3f4f6',
              borderRadius: 12,
              color: '#6b7280',
            }}
          >
            <p style={{ fontSize: '1.1rem' }}>
              👆 בחר נושא, רמת קושי וכמות תרגילים, ולחץ על הכפתור לייצור רשימה.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.5rem' }}>
              📋 רשימת התרגילים שנוצרה ({generated.length} תרגילים)
            </h3>
            <ol style={{ paddingRight: '1.5rem' }}>
              {generated.map((q) => (
                <li
                  key={q.id}
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.5rem',
                    borderRight: '4px solid #667eea',
                    background: '#ffffff',
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {q.prompt}
                  </div>

                  {q.assetId && (
                    <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                      <img
                        src={`/assets/${q.assetId}.png`}
                        alt=""
                        style={{
                          maxWidth: '250px',
                          height: 'auto',
                          borderRadius: 8,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {q.options && (
                    <ul
                      style={{
                        marginTop: 8,
                        paddingRight: '1.5rem',
                        listStyleType: 'disc',
                      }}
                    >
                      {q.options.map((opt) => (
                        <li key={String(opt)} style={{ color: '#4b5563' }}>
                          {String(opt)}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      marginTop: '0.75rem',
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>
                      <strong>נושא:</strong> {topic?.label}
                    </span>
                    {q.subtopic && (
                      <span>
                        <strong>תת-נושא:</strong> {q.subtopic}
                      </span>
                    )}
                    <span>
                      <strong>רמה:</strong> {difficultyLabels[q.difficulty]}
                    </span>
                    <span style={{ marginRight: 'auto', color: '#059669', fontWeight: 600 }}>
                      <strong>תשובה:</strong> {String(q.answer)}
                    </span>
                  </div>

                  {q.explanation && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: '#fef3c7',
                        borderRadius: 6,
                        fontSize: '0.9rem',
                        color: '#92400e',
                      }}
                    >
                      <strong>הסבר:</strong> {q.explanation}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}
