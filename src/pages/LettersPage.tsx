// src/pages/LettersPage.tsx
// Hebrew letter study section - inspired by the "חוברת לימוד אותיות" workbook.
// Three exercises per letter:
//   1. Introduction – big letter, name, two example words with emoji
//   2. Grid Hunt     – 6×6 letter grid, tap every instance of the target letter
//   3. Line Scan     – rows of letters, tap only the target letter

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HEBREW_LETTERS, ALL_BASIC_LETTERS } from '../data/letters';
import type { HebrewLetter } from '../data/letters';
import { speak } from '../utils/speech';
import { useChildSettings } from '../context/ChildSettingsContext';

// ---------------------------------------------------------------------------
// Grid / scan generation helpers
// ---------------------------------------------------------------------------

const GRID_ROWS = 6;
const GRID_COLS = 6;
const GRID_TARGET_COUNT = 9; // how many target letters in the 6×6 grid

const SCAN_ROW_COUNT = 2;
const SCAN_ROW_LENGTH = 14;
const SCAN_TARGET_PER_ROW = 5;

function makeGrid(target: string): { cells: string[]; targetCount: number } {
  const size = GRID_ROWS * GRID_COLS;
  const cells = new Array<string>(size);
  const others = ALL_BASIC_LETTERS.filter((l) => l !== target);

  const targetPositions = new Set<number>();
  while (targetPositions.size < GRID_TARGET_COUNT) {
    targetPositions.add(Math.floor(Math.random() * size));
  }

  for (let i = 0; i < size; i++) {
    cells[i] = targetPositions.has(i)
      ? target
      : others[Math.floor(Math.random() * others.length)];
  }
  return { cells, targetCount: GRID_TARGET_COUNT };
}

function makeScanRows(target: string): { rows: string[][]; targetCount: number } {
  const others = ALL_BASIC_LETTERS.filter((l) => l !== target);
  let totalTargets = 0;

  const rows = Array.from({ length: SCAN_ROW_COUNT }, () => {
    const row = new Array<string>(SCAN_ROW_LENGTH);
    const targetPositions = new Set<number>();
    while (targetPositions.size < SCAN_TARGET_PER_ROW) {
      targetPositions.add(Math.floor(Math.random() * SCAN_ROW_LENGTH));
    }
    totalTargets += SCAN_TARGET_PER_ROW;
    for (let i = 0; i < SCAN_ROW_LENGTH; i++) {
      row[i] = targetPositions.has(i)
        ? target
        : others[Math.floor(Math.random() * others.length)];
    }
    return row;
  });

  return { rows, targetCount: totalTargets };
}

// ---------------------------------------------------------------------------
// Shared back-button
// ---------------------------------------------------------------------------

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#e2e8f0',
        color: '#334155',
        borderRadius: '8px',
        padding: '8px 18px',
        fontSize: '1rem',
        marginBottom: '16px',
        alignSelf: 'flex-end',
      }}
    >
      ← חזרה
    </button>
  );
}

// ---------------------------------------------------------------------------
// Screen 1 – Letter Selector
// ---------------------------------------------------------------------------

function LetterSelector({ onSelect }: { onSelect: (index: number) => void }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        direction: 'rtl',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <BackButton onClick={() => navigate('/')} />

        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px', textAlign: 'right' }}>
          לימודי אותיות
        </h1>
        <p style={{ color: '#666', marginBottom: '28px', textAlign: 'right' }}>
          בחרו אות ללמוד
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '10px',
          }}
        >
          {HEBREW_LETTERS.map((letter, index) => (
            <button
              key={letter.letter}
              onClick={() => onSelect(index)}
              style={{
                background: letter.color,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 0',
                fontSize: '2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                transition: 'transform 0.12s, opacity 0.12s',
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {letter.letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 2 – Letter Introduction
// ---------------------------------------------------------------------------

interface IntroProps {
  letterData: HebrewLetter;
  onNext: () => void;
  onBack: () => void;
}

function LetterIntro({ letterData, onNext, onBack }: IntroProps) {
  const { settings } = useChildSettings();

  useEffect(() => {
    if (settings.soundsEnabled) {
      speak(`האות ${letterData.nameHe}`);
    }
  }, [letterData.nameHe, settings.soundsEnabled]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        direction: 'rtl',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <BackButton onClick={onBack} />

        {/* Big letter display */}
        <div
          style={{
            background: letterData.color,
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ fontSize: '8rem', color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
            {letterData.letter}
          </div>
          {letterData.finalForm && (
            <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.75)', marginTop: '8px' }}>
              {letterData.finalForm}
            </div>
          )}
          <div
            style={{
              fontSize: '1.6rem',
              color: 'white',
              marginTop: '12px',
              fontWeight: '600',
            }}
          >
            {letterData.nameHe}
          </div>
          {letterData.finalForm && (
            <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
              (צורת סוף: {letterData.finalForm})
            </div>
          )}
        </div>

        {/* Example words */}
        <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '12px' }}>
          מילים שמתחילות ב{letterData.letter}:
        </p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {letterData.examples.map((ex) => (
            <div
              key={ex.word}
              style={{
                flex: 1,
                background: 'white',
                borderRadius: '16px',
                padding: '20px 12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: `3px solid ${letterData.color}`,
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{ex.emoji}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '600', direction: 'rtl' }}>
                <span style={{ color: letterData.color, fontWeight: 'bold' }}>
                  {letterData.letter}
                </span>
                {ex.word.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          style={{
            width: '100%',
            background: letterData.color,
            color: 'white',
            borderRadius: '999px',
            padding: '14px',
            fontSize: '1.2rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          לתרגיל ←
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 3 – Grid Hunt
// ---------------------------------------------------------------------------

interface GridHuntProps {
  letterData: HebrewLetter;
  onNext: () => void;
  onBack: () => void;
}

function GridHunt({ letterData, onNext, onBack }: GridHuntProps) {
  const { settings } = useChildSettings();

  const { cells, targetCount } = useMemo(
    () => makeGrid(letterData.letter),
    [letterData.letter]
  );

  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  const correctFound = useMemo(
    () => [...tapped].filter((i) => cells[i] === letterData.letter).length,
    [tapped, cells, letterData.letter]
  );

  useEffect(() => {
    if (settings.soundsEnabled) {
      speak(`מצאו את כל האות ${letterData.nameHe} ברשת`);
    }
  }, [letterData.nameHe, settings.soundsEnabled]);

  useEffect(() => {
    if (correctFound === targetCount && !finished) {
      setFinished(true);
      if (settings.soundsEnabled) speak('כל הכבוד! מצאתם את כל האותיות!');
    }
  }, [correctFound, targetCount, finished, settings.soundsEnabled]);

  const handleTap = useCallback(
    (index: number) => {
      if (tapped.has(index)) return;
      if (cells[index] === letterData.letter) {
        setTapped((prev) => new Set([...prev, index]));
      } else {
        setWrong((prev) => new Set([...prev, index]));
        setTimeout(
          () =>
            setWrong((prev) => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            }),
          500
        );
      }
    },
    [cells, letterData.letter, tapped]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        direction: 'rtl',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <BackButton onClick={onBack} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: letterData.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {letterData.letter}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
              מצאו את כל האות {letterData.letter}
            </div>
            <div style={{ color: '#666', fontSize: '0.95rem' }}>
              לחצו על כל האות {letterData.nameHe} ברשת
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '10px 18px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ color: '#666', fontSize: '0.95rem' }}>נמצאו:</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: letterData.color }}>
            {correctFound} / {targetCount}
          </span>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: '6px',
            marginBottom: '20px',
          }}
        >
          {cells.map((cell, i) => {
            const isCorrectTapped = tapped.has(i) && cell === letterData.letter;
            const isWrong = wrong.has(i);

            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '10px',
                  border: `2px solid ${
                    isCorrectTapped
                      ? '#48BB78'
                      : isWrong
                      ? '#FC8181'
                      : '#e2e8f0'
                  }`,
                  background: isCorrectTapped
                    ? '#C6F6D5'
                    : isWrong
                    ? '#FED7D7'
                    : 'white',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  cursor: isCorrectTapped ? 'default' : 'pointer',
                  color: isCorrectTapped ? '#276749' : '#2d3748',
                  transition: 'background 0.15s, border-color 0.15s',
                  padding: 0,
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Celebration / next */}
        {finished ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontWeight: '700', fontSize: '1.3rem', marginBottom: '20px' }}>
              מצוין! מצאתם את כל ה-{targetCount} אותיות!
            </div>
            <button
              onClick={onNext}
              style={{
                width: '100%',
                background: letterData.color,
                color: 'white',
                borderRadius: '999px',
                padding: '14px',
                fontSize: '1.2rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              לתרגיל הבא ←
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 4 – Line Scan
// ---------------------------------------------------------------------------

interface LineScanProps {
  letterData: HebrewLetter;
  onNext: () => void;
  onBack: () => void;
}

function LineScan({ letterData, onNext, onBack }: LineScanProps) {
  const { settings } = useChildSettings();

  const { rows, targetCount } = useMemo(
    () => makeScanRows(letterData.letter),
    [letterData.letter]
  );

  // State: tapped[rowIndex][colIndex] = 'correct' | 'wrong' | undefined
  const [tapped, setTapped] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [wrongFlash, setWrongFlash] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const correctFound = useMemo(
    () =>
      Object.values(tapped).filter((v) => v === 'correct').length,
    [tapped]
  );

  useEffect(() => {
    if (settings.soundsEnabled) {
      speak(`הקיפו רק את האות ${letterData.nameHe}`);
    }
  }, [letterData.nameHe, settings.soundsEnabled]);

  useEffect(() => {
    if (correctFound === targetCount && !finished) {
      setFinished(true);
      if (settings.soundsEnabled) speak('כל הכבוד! מצאתם את כל האותיות!');
    }
  }, [correctFound, targetCount, finished, settings.soundsEnabled]);

  const key = (r: number, c: number) => `${r}-${c}`;

  const handleTap = useCallback(
    (rowIndex: number, colIndex: number) => {
      const k = key(rowIndex, colIndex);
      if (tapped[k]) return;
      const isTarget = rows[rowIndex][colIndex] === letterData.letter;
      if (isTarget) {
        setTapped((prev) => ({ ...prev, [k]: 'correct' }));
      } else {
        setWrongFlash((prev) => new Set([...prev, k]));
        setTimeout(
          () =>
            setWrongFlash((prev) => {
              const next = new Set(prev);
              next.delete(k);
              return next;
            }),
          500
        );
      }
    },
    [rows, letterData.letter, tapped]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        direction: 'rtl',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <BackButton onClick={onBack} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: letterData.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {letterData.letter}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
              הקיפו רק את האות {letterData.letter}
            </div>
            <div style={{ color: '#666', fontSize: '0.95rem' }}>
              לחצו על כל האות {letterData.nameHe} בשורות
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '10px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ color: '#666', fontSize: '0.95rem' }}>נמצאו:</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: letterData.color }}>
            {correctFound} / {targetCount}
          </span>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '14px 10px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                display: 'flex',
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
                gap: '4px',
                justifyContent: 'flex-start',
              }}
            >
              {row.map((cell, colIndex) => {
                const k = key(rowIndex, colIndex);
                const isCorrect = tapped[k] === 'correct';
                const isWrongFlash = wrongFlash.has(k);

                return (
                  <button
                    key={colIndex}
                    onClick={() => handleTap(rowIndex, colIndex)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      border: `2px solid ${
                        isCorrect
                          ? '#48BB78'
                          : isWrongFlash
                          ? '#FC8181'
                          : '#e2e8f0'
                      }`,
                      background: isCorrect
                        ? '#C6F6D5'
                        : isWrongFlash
                        ? '#FED7D7'
                        : '#fafafa',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      cursor: isCorrect ? 'default' : 'pointer',
                      color: isCorrect ? '#276749' : '#2d3748',
                      transition: 'background 0.15s, border-color 0.15s',
                      padding: 0,
                    }}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Celebration / next */}
        {finished ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontWeight: '700', fontSize: '1.3rem', marginBottom: '20px' }}>
              מצוין! מצאתם את כל ה-{targetCount} אותיות!
            </div>
            <button
              onClick={onNext}
              style={{
                width: '100%',
                background: letterData.color,
                color: 'white',
                borderRadius: '999px',
                padding: '14px',
                fontSize: '1.2rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              סיום ←
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 5 – Completion
// ---------------------------------------------------------------------------

interface CompletionProps {
  letterData: HebrewLetter;
  onNextLetter: () => void;
  onBackToSelector: () => void;
}

function LetterCompletion({ letterData, onNextLetter, onBackToSelector }: CompletionProps) {
  const { settings } = useChildSettings();

  useEffect(() => {
    if (settings.soundsEnabled) {
      speak(`כל הכבוד! למדתם את האות ${letterData.nameHe}`);
    }
  }, [letterData.nameHe, settings.soundsEnabled]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f6fb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        direction: 'rtl',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🌟</div>

      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: letterData.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '5rem',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '20px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        }}
      >
        {letterData.letter}
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
        כל הכבוד!
      </h2>
      <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '36px' }}>
        למדתם את האות <strong style={{ color: letterData.color }}>{letterData.nameHe}</strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '300px' }}>
        <button
          onClick={onNextLetter}
          style={{
            background: letterData.color,
            color: 'white',
            borderRadius: '999px',
            padding: '14px',
            fontSize: '1.15rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          לאות הבאה →
        </button>
        <button
          onClick={onBackToSelector}
          style={{
            background: '#e2e8f0',
            color: '#334155',
            borderRadius: '999px',
            padding: '14px',
            fontSize: '1.15rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          בחרו אות אחרת
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main LettersPage – state machine
// ---------------------------------------------------------------------------

type Mode = 'selector' | 'intro' | 'grid' | 'scan' | 'complete';

export default function LettersPage() {
  const [mode, setMode] = useState<Mode>('selector');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const letterData = HEBREW_LETTERS[selectedIndex];

  const selectLetter = useCallback((index: number) => {
    setSelectedIndex(index);
    setMode('intro');
  }, []);

  const goNextLetter = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % HEBREW_LETTERS.length;
    setSelectedIndex(nextIndex);
    setMode('intro');
  }, [selectedIndex]);

  if (mode === 'selector') {
    return <LetterSelector onSelect={selectLetter} />;
  }

  if (mode === 'intro') {
    return (
      <LetterIntro
        letterData={letterData}
        onNext={() => setMode('grid')}
        onBack={() => setMode('selector')}
      />
    );
  }

  if (mode === 'grid') {
    return (
      <GridHunt
        letterData={letterData}
        onNext={() => setMode('scan')}
        onBack={() => setMode('intro')}
      />
    );
  }

  if (mode === 'scan') {
    return (
      <LineScan
        letterData={letterData}
        onNext={() => setMode('complete')}
        onBack={() => setMode('grid')}
      />
    );
  }

  // mode === 'complete'
  return (
    <LetterCompletion
      letterData={letterData}
      onNextLetter={goNextLetter}
      onBackToSelector={() => setMode('selector')}
    />
  );
}
