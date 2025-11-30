// src/components/StudentGame.tsx
import { useState } from 'react';
import type { Question } from '../types/questions';

interface Props {
  questions: Question[];
  onExit: () => void;
}

export default function StudentGame({ questions, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = questions[index];

  if (!current) {
    return (
      <div
        style={{
          padding: '1.5rem',
          maxWidth: 700,
          margin: '0 auto',
          fontFamily: 'system-ui',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }}>
          🎉 סיימת את כל התרגילים!
        </h2>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          ניקוד: <strong>{score}</strong> מתוך {questions.length}
        </p>
        <button
          onClick={onExit}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          חזרה למצב מורה
        </button>
      </div>
    );
  }

  const checkAnswer = () => {
    const correctStr = String(current.answer).trim();
    const userStr = input.trim();

    const isCorrect =
      userStr === correctStr ||
      (Array.isArray(current.options) &&
        current.options.some((o) => String(o) === userStr));

    if (isCorrect) {
      setFeedback('כל הכבוד! תשובה נכונה ✅');
      setScore((s) => s + 1);
    } else {
      setFeedback(`לא מדויק... התשובה הנכונה היא: ${correctStr}`);
    }

    // מעבר אוטומטי לשאלה הבאה אחרי שנייה
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setIndex((i) => i + 1);
    }, 1500);
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: 700,
        margin: '0 auto',
        fontFamily: 'system-ui',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', color: '#1a1a1a' }}>
          🎮 מצב תלמיד
        </h2>
        <button
          type="button"
          onClick={onExit}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            border: '1px solid #999',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          יציאה למצב מורה
        </button>
      </div>

      <div
        style={{
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: 8,
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
          שאלה {index + 1} מתוך {questions.length}
        </span>
        <span style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 600 }}>
          ניקוד: {score}
        </span>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '1.5rem',
          borderRadius: 8,
          border: '2px solid #e5e7eb',
          background: '#fff',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#374151',
          }}
        >
          {current.prompt}
        </div>

        {current.assetId && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img
              src={`/assets/${current.assetId}.png`}
              alt=""
              style={{
                maxWidth: 300,
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

        {current.options && (
          <div style={{ marginBottom: '0.5rem' }}>
            {current.options.map((opt) => (
              <button
                key={String(opt)}
                type="button"
                onClick={() => {
                  setInput(String(opt));
                  setTimeout(() => checkAnswer(), 100);
                }}
                disabled={feedback !== null}
                style={{
                  margin: '0 0.5rem 0.5rem 0',
                  padding: '0.5rem 1.5rem',
                  borderRadius: 8,
                  border: '2px solid #2563eb',
                  background: '#fff',
                  cursor: feedback !== null ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  opacity: feedback !== null ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (feedback === null) {
                    e.currentTarget.style.background = '#2563eb';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
              >
                {String(opt)}
              </button>
            ))}
          </div>
        )}

        {!current.options && (
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && feedback === null) {
                  checkAnswer();
                }
              }}
              disabled={feedback !== null}
              placeholder="כתוב כאן את התשובה"
              style={{
                padding: '0.75rem 1rem',
                minWidth: 200,
                borderRadius: 8,
                border: '2px solid #d1d5db',
                fontSize: '1.1rem',
                marginLeft: '0.5rem',
              }}
            />
            <button
              type="button"
              onClick={checkAnswer}
              disabled={feedback !== null}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 8,
                border: 'none',
                background: feedback !== null ? '#9ca3af' : '#16a34a',
                color: '#fff',
                cursor: feedback !== null ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              בדיקה
            </button>
          </div>
        )}

        {feedback && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 8,
              background: feedback.includes('נכונה')
                ? '#d1fae5'
                : '#fee2e2',
              color: feedback.includes('נכונה') ? '#065f46' : '#991b1b',
              fontSize: '1.1rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {feedback}
          </div>
        )}

        {current.explanation && feedback && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#fef3c7',
              borderRadius: 6,
              fontSize: '0.95rem',
              color: '#92400e',
            }}
          >
            <strong>הסבר:</strong> {current.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
