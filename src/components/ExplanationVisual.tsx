// src/components/ExplanationVisual.tsx
import type { Question } from '../types/questions';

interface ExplanationVisualProps {
  question: Question;
  className?: string;
}

/**
 * ExplanationVisual - Generates visual explanations for math questions
 * Designed for children with learning disabilities - large, clear, colorful
 * 
 * Creates visual representations to help understand:
 * - Addition: Two groups combining
 * - Subtraction: Items being removed
 * - Multiplication: Groups of items
 * - Geometry: Shapes and properties
 * - Numbers: Counting helpers
 */
export function ExplanationVisual({ question, className = '' }: ExplanationVisualProps) {
  const visual = generateVisualForQuestion(question);
  
  if (!visual) {
    return null;
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-lg border-2 border-yellow-200 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl">🎨</span>
        <h4 className="text-xl font-bold text-amber-800">הסבר ויזואלי</h4>
      </div>
      
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {visual}
      </div>
    </div>
  );
}

function generateVisualForQuestion(question: Question): React.ReactNode {
  const { topic, promptHe } = question;
  
  // Parse the math expression from the prompt
  const mathMatch = promptHe.match(/(\d+)\s*([+\-×x*])\s*(\d+)/);
  
  switch (topic) {
    case 'addition':
      return generateAdditionVisual(question, mathMatch);
    case 'subtraction':
      return generateSubtractionVisual(question, mathMatch);
    case 'multiplication':
      return generateMultiplicationVisual(question, mathMatch);
    case 'geometry':
      return generateGeometryVisual(question);
    case 'numbers':
      return generateNumbersVisual(question);
    case 'evenOdd':
      return generateEvenOddVisual(question);
    default:
      return generateGenericVisual(question);
  }
}

// ===== ADDITION VISUAL =====
function generateAdditionVisual(question: Question, mathMatch: RegExpMatchArray | null): React.ReactNode {
  if (mathMatch) {
    const a = parseInt(mathMatch[1]);
    const b = parseInt(mathMatch[3]);
    const sum = a + b;
    
    // Limit visual representation to reasonable numbers
    if (a <= 12 && b <= 12) {
      return (
        <div className="space-y-6">
          {/* Step 1: First number */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-blue-700">קבוצה ראשונה: {a}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: a }).map((_, i) => (
                <span key={`a-${i}`} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  🔵
                </span>
              ))}
            </div>
          </div>

          {/* Plus sign */}
          <div className="text-center">
            <span className="text-5xl font-bold text-green-600">+</span>
          </div>

          {/* Step 2: Second number */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-red-700">קבוצה שנייה: {b}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: b }).map((_, i) => (
                <span key={`b-${i}`} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                  🔴
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <span className="text-4xl">⬇️</span>
          </div>

          {/* Result: Combined */}
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-green-800">ביחד: {sum}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: a }).map((_, i) => (
                <span key={`sum-a-${i}`} className="text-3xl">🔵</span>
              ))}
              {Array.from({ length: b }).map((_, i) => (
                <span key={`sum-b-${i}`} className="text-3xl">🔴</span>
              ))}
            </div>
            <div className="mt-3 text-3xl font-bold text-green-700">
              {a} + {b} = {sum}
            </div>
          </div>

          {/* Number line visualization */}
          <div className="mt-4">
            <div className="mb-2 text-center text-lg font-bold text-purple-700">על ציר המספרים:</div>
            <NumberLineVisualization start={0} jumps={[{ from: 0, to: a, color: 'blue' }, { from: a, to: sum, color: 'red' }]} />
          </div>
        </div>
      );
    }
  }
  
  // Word problem visual
  return generateWordProblemVisual(question, 'addition');
}

// ===== SUBTRACTION VISUAL =====
function generateSubtractionVisual(question: Question, mathMatch: RegExpMatchArray | null): React.ReactNode {
  if (mathMatch) {
    const a = parseInt(mathMatch[1]);
    const b = parseInt(mathMatch[3]);
    const result = a - b;
    
    if (a <= 15 && b <= 15 && result >= 0) {
      return (
        <div className="space-y-6">
          {/* Step 1: Start with all items */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-blue-700">התחלנו עם: {a}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: a }).map((_, i) => (
                <span 
                  key={`start-${i}`} 
                  className={`text-4xl ${i >= result ? 'opacity-100' : ''}`}
                >
                  🍎
                </span>
              ))}
            </div>
          </div>

          {/* Minus sign */}
          <div className="text-center">
            <span className="text-5xl font-bold text-red-600">−</span>
          </div>

          {/* Step 2: Items being removed */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-red-700">הורדנו: {b}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: b }).map((_, i) => (
                <div key={`remove-${i}`} className="relative">
                  <span className="text-4xl opacity-50">🍎</span>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">❌</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <span className="text-4xl">⬇️</span>
          </div>

          {/* Result */}
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-green-800">נשאר: {result}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: result }).map((_, i) => (
                <span key={`result-${i}`} className="text-4xl">🍎</span>
              ))}
              {result === 0 && <span className="text-2xl text-gray-500">כלום לא נשאר</span>}
            </div>
            <div className="mt-3 text-3xl font-bold text-green-700">
              {a} − {b} = {result}
            </div>
          </div>

          {/* Number line */}
          <div className="mt-4">
            <div className="mb-2 text-center text-lg font-bold text-purple-700">על ציר המספרים:</div>
            <NumberLineVisualization start={a} jumps={[{ from: a, to: result, color: 'red', direction: 'back' }]} showBackward />
          </div>
        </div>
      );
    }
  }

  return generateWordProblemVisual(question, 'subtraction');
}

// ===== MULTIPLICATION VISUAL =====
function generateMultiplicationVisual(_question: Question, mathMatch: RegExpMatchArray | null): React.ReactNode {
  if (mathMatch) {
    const a = parseInt(mathMatch[1]);
    const b = parseInt(mathMatch[3]);
    const product = a * b;
    
    // Limit to reasonable sizes
    if (a <= 6 && b <= 6) {
      return (
        <div className="space-y-6">
          {/* Explanation */}
          <div className="text-center">
            <div className="text-xl font-bold text-purple-700 mb-4">
              {a} × {b} = {a} קבוצות של {b}
            </div>
          </div>

          {/* Groups visualization */}
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: a }).map((_, groupIndex) => (
              <div 
                key={`group-${groupIndex}`} 
                className="rounded-2xl border-4 border-dashed border-purple-300 bg-purple-50 p-3"
              >
                <div className="text-center text-sm font-bold text-purple-600 mb-2">
                  קבוצה {groupIndex + 1}
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: b }).map((_, itemIndex) => (
                    <span key={`item-${groupIndex}-${itemIndex}`} className="text-3xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="text-center text-sm font-bold text-purple-600 mt-1">
                  = {b}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="text-center">
            <span className="text-4xl">⬇️</span>
          </div>

          {/* Result */}
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
            <div className="mb-2 text-lg font-bold text-green-800">
              {a} קבוצות × {b} בכל קבוצה = {product}
            </div>
            <div className="text-4xl font-bold text-green-700">
              {a} × {b} = {product}
            </div>
          </div>

          {/* Array/Grid visualization */}
          <div className="mt-4">
            <div className="mb-2 text-center text-lg font-bold text-orange-700">או בטבלה:</div>
            <div className="flex justify-center">
              <div className="inline-grid gap-2 rounded-xl bg-orange-50 p-4" 
                   style={{ gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` }}>
                {Array.from({ length: product }).map((_, i) => (
                  <span key={`grid-${i}`} className="text-2xl">🟡</span>
                ))}
              </div>
            </div>
            <div className="text-center mt-2 text-orange-700">
              {a} שורות × {b} עמודות = {product}
            </div>
          </div>
        </div>
      );
    }
  }
  
  return null;
}

// ===== GEOMETRY VISUAL =====
function generateGeometryVisual(question: Question): React.ReactNode {
  const { promptHe, answer, subtopic } = question;
  
  // Triangle question
  if (promptHe.includes('משולש')) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-700 mb-4">משולש</div>
          
          {/* Triangle SVG with labels */}
          <div className="flex justify-center">
            <svg width="200" height="180" viewBox="0 0 200 180">
              {/* Triangle */}
              <polygon 
                points="100,20 20,160 180,160" 
                fill="#60a5fa" 
                stroke="#1d4ed8" 
                strokeWidth="4"
              />
              {/* Side labels */}
              <text x="50" y="100" fill="#1d4ed8" fontSize="20" fontWeight="bold">צלע 1</text>
              <text x="130" y="100" fill="#1d4ed8" fontSize="20" fontWeight="bold">צלע 2</text>
              <text x="85" y="175" fill="#1d4ed8" fontSize="20" fontWeight="bold">צלע 3</text>
              {/* Vertices */}
              <circle cx="100" cy="20" r="8" fill="#ef4444" />
              <circle cx="20" cy="160" r="8" fill="#ef4444" />
              <circle cx="180" cy="160" r="8" fill="#ef4444" />
              {/* Vertex labels */}
              <text x="90" y="12" fill="#ef4444" fontSize="14" fontWeight="bold">קודקוד</text>
              <text x="5" y="175" fill="#ef4444" fontSize="14" fontWeight="bold">קודקוד</text>
              <text x="165" y="175" fill="#ef4444" fontSize="14" fontWeight="bold">קודקוד</text>
            </svg>
          </div>
        </div>

        {/* Properties */}
        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="text-lg font-bold text-blue-800 mb-2">תכונות המשולש:</div>
          <ul className="space-y-2 text-blue-700 text-right">
            <li className="flex items-center gap-2 justify-end">
              <span>צלעות</span>
              <span className="text-2xl">3️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>קודקודים (פינות)</span>
              <span className="text-2xl">3️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>זוויות</span>
              <span className="text-2xl">3️⃣</span>
            </li>
          </ul>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            למשולש יש {typeof answer === 'number' ? answer : 3} צלעות! ✅
          </div>
        </div>
      </div>
    );
  }

  // Square question
  if (promptHe.includes('ריבוע')) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-purple-700 mb-4">ריבוע</div>
          
          {/* Square SVG with labels */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Square */}
              <rect 
                x="30" y="30" 
                width="140" height="140" 
                fill="#a78bfa" 
                stroke="#6d28d9" 
                strokeWidth="4"
              />
              {/* Side labels */}
              <text x="5" y="105" fill="#6d28d9" fontSize="16" fontWeight="bold">צלע</text>
              <text x="175" y="105" fill="#6d28d9" fontSize="16" fontWeight="bold">צלע</text>
              <text x="90" y="25" fill="#6d28d9" fontSize="16" fontWeight="bold">צלע</text>
              <text x="90" y="190" fill="#6d28d9" fontSize="16" fontWeight="bold">צלע</text>
              {/* Corners */}
              <circle cx="30" cy="30" r="6" fill="#ef4444" />
              <circle cx="170" cy="30" r="6" fill="#ef4444" />
              <circle cx="30" cy="170" r="6" fill="#ef4444" />
              <circle cx="170" cy="170" r="6" fill="#ef4444" />
            </svg>
          </div>
        </div>

        {/* Properties */}
        <div className="rounded-2xl bg-purple-50 p-4">
          <div className="text-lg font-bold text-purple-800 mb-2">תכונות הריבוע:</div>
          <ul className="space-y-2 text-purple-700 text-right">
            <li className="flex items-center gap-2 justify-end">
              <span>צלעות (כולן שוות)</span>
              <span className="text-2xl">4️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>קודקודים (פינות)</span>
              <span className="text-2xl">4️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>זוויות ישרות</span>
              <span className="text-2xl">4️⃣</span>
            </li>
          </ul>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            לריבוע יש {typeof answer === 'number' ? answer : 4} צלעות! ✅
          </div>
        </div>
      </div>
    );
  }

  // Circle question
  if (promptHe.includes('מעגל') || promptHe.includes('עיגול')) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-green-700 mb-4">מעגל / עיגול</div>
          
          {/* Circle SVG */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle 
                cx="100" cy="100" r="80" 
                fill="#86efac" 
                stroke="#16a34a" 
                strokeWidth="4"
              />
              <text x="70" y="105" fill="#16a34a" fontSize="16" fontWeight="bold">אין פינות!</text>
            </svg>
          </div>
        </div>

        {/* Properties */}
        <div className="rounded-2xl bg-green-50 p-4">
          <div className="text-lg font-bold text-green-800 mb-2">תכונות המעגל:</div>
          <ul className="space-y-2 text-green-700 text-right">
            <li className="flex items-center gap-2 justify-end">
              <span>צלעות</span>
              <span className="text-2xl">0️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>פינות</span>
              <span className="text-2xl">0️⃣</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>צורה עגולה וחלקה</span>
              <span className="text-2xl">⭕</span>
            </li>
          </ul>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            למעגל אין פינות וצלעות! ✅
          </div>
        </div>
      </div>
    );
  }

  // Symmetry question
  if (subtopic?.includes('סימטריה') || promptHe.includes('סימטרי')) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-pink-700 mb-4">סימטריה</div>
          
          {/* Symmetry visualization */}
          <div className="flex justify-center items-center gap-4">
            <div className="text-6xl">🦋</div>
            <div className="h-24 w-1 bg-pink-400 rounded"></div>
            <div className="text-6xl transform scale-x-[-1]">🦋</div>
          </div>
          <div className="mt-2 text-pink-600 font-bold">קו סימטריה</div>
        </div>

        {/* Explanation */}
        <div className="rounded-2xl bg-pink-50 p-4">
          <div className="text-lg font-bold text-pink-800 mb-2">מה זה סימטריה?</div>
          <p className="text-pink-700 text-right">
            צורה סימטרית היא צורה שאם מקפלים אותה על קו הסימטריה, 
            שני הצדדים מתאימים בדיוק אחד לשני!
          </p>
        </div>

        {/* Examples */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-3 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-green-700 font-bold text-sm">סימטרי ✅</div>
          </div>
          <div className="rounded-xl bg-red-50 p-3 text-center">
            <div className="text-3xl mb-2">➡️</div>
            <div className="text-red-700 font-bold text-sm">לא סימטרי ❌</div>
          </div>
        </div>
      </div>
    );
  }

  // Generic geometry visual
  return (
    <div className="space-y-4 text-center">
      <div className="text-5xl">📐</div>
      <div className="text-lg text-slate-600">
        זכרו: צורות גיאומטריות מוגדרות לפי צלעות, זוויות ותכונות מיוחדות!
      </div>
    </div>
  );
}

// ===== NUMBERS VISUAL =====
function generateNumbersVisual(question: Question): React.ReactNode {
  const { promptHe, answer, subtopic } = question;
  
  // Counting question
  if (subtopic?.includes('ספירה') || promptHe.includes('ספור') || promptHe.includes('כמה')) {
    const count = typeof answer === 'number' ? answer : 0;
    if (count > 0 && count <= 15) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-700 mb-4">בואו נספור ביחד!</div>
          </div>

          {/* Counting visualization with numbers */}
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl">🌟</span>
                <span className="text-lg font-bold text-blue-600">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              סה״כ: {count} ⭐
            </div>
          </div>
        </div>
      );
    }
  }

  // Neighbors question
  if (subtopic?.includes('שכנים') || promptHe.includes('שכן')) {
    const num = parseInt(promptHe.match(/\d+/)?.[0] || '0');
    if (num > 0 && num <= 20) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-700 mb-4">שכנים על ציר המספרים</div>
          </div>

          {/* Number line with neighbors */}
          <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col items-center px-4 py-2 bg-blue-100 rounded-xl">
              <span className="text-3xl font-bold text-blue-700">{num - 1}</span>
              <span className="text-sm text-blue-600">שכן לפני</span>
            </div>
            <span className="text-2xl">←</span>
            <div className="flex flex-col items-center px-4 py-2 bg-yellow-200 rounded-xl border-4 border-yellow-400">
              <span className="text-4xl font-bold text-yellow-700">{num}</span>
              <span className="text-sm text-yellow-600">המספר</span>
            </div>
            <span className="text-2xl">→</span>
            <div className="flex flex-col items-center px-4 py-2 bg-red-100 rounded-xl">
              <span className="text-3xl font-bold text-red-700">{num + 1}</span>
              <span className="text-sm text-red-600">שכן אחרי</span>
            </div>
          </div>

          {/* Visual number line */}
          <div className="mt-4">
            <NumberLineVisualization 
              start={Math.max(0, num - 3)} 
              end={num + 3}
              highlight={num}
              showNeighbors
            />
          </div>
        </div>
      );
    }
  }

  // Sequence/Pattern question
  if (subtopic?.includes('דילוגים') || subtopic?.includes('סדרות') || promptHe.includes('השלם')) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-700 mb-4">סדרות ודילוגים</div>
        </div>

        {/* Pattern visualization */}
        <div className="rounded-2xl bg-indigo-50 p-4">
          <div className="text-lg text-indigo-700 mb-2">
            <span className="font-bold">טיפ:</span> חפשו את הדפוס!
          </div>
          <ul className="space-y-2 text-indigo-600 text-right">
            <li className="flex items-center gap-2 justify-end">
              <span>מה ההפרש בין כל שני מספרים?</span>
              <span className="text-xl">🔍</span>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span>האם הסדרה עולה או יורדת?</span>
              <span className="text-xl">📈</span>
            </li>
          </ul>
        </div>

        {/* Example pattern */}
        <div className="flex justify-center gap-2 items-center">
          {[2, 4, 6, 8, 10].map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {n}
              </div>
              {i < 4 && <span className="text-indigo-400 mt-1">+2</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ===== EVEN/ODD VISUAL =====
function generateEvenOddVisual(question: Question): React.ReactNode {
  const { promptHe } = question;
  
  // Extract number from question
  const numMatch = promptHe.match(/המספר\s+(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : null;

  if (num !== null && num <= 20) {
    const isEven = num % 2 === 0;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-xl font-bold text-purple-700 mb-4">
            האם {num} זוגי או אי-זוגי?
          </div>
        </div>

        {/* Pairing visualization */}
        <div className="text-center">
          <div className="text-lg font-bold text-blue-700 mb-3">
            בואו ננסה לסדר {num} בזוגות:
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: Math.floor(num / 2) }).map((_, i) => (
              <div 
                key={i} 
                className="rounded-xl border-4 border-dashed border-green-400 bg-green-50 p-2 flex gap-1"
              >
                <span className="text-3xl">🧑</span>
                <span className="text-3xl">🧑</span>
              </div>
            ))}
            {/* Show leftover if odd */}
            {!isEven && (
              <div className="rounded-xl border-4 border-dashed border-red-400 bg-red-50 p-2">
                <span className="text-3xl">🧑</span>
                <span className="text-xs text-red-600 font-bold block">לבד!</span>
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className={`rounded-2xl p-4 text-center ${isEven ? 'bg-green-100' : 'bg-orange-100'}`}>
          {isEven ? (
            <div className="text-xl font-bold text-green-700">
              ✅ כולם בזוגות! {num} הוא מספר זוגי
            </div>
          ) : (
            <div className="text-xl font-bold text-orange-700">
              ❌ נשאר אחד לבד! {num} הוא מספר אי-זוגי
            </div>
          )}
        </div>

        {/* Rule */}
        <div className="rounded-2xl bg-purple-50 p-4">
          <div className="text-lg font-bold text-purple-800 mb-2">כלל:</div>
          <ul className="space-y-1 text-purple-700 text-right">
            <li>• מספרים זוגיים: 0, 2, 4, 6, 8, 10...</li>
            <li>• מספרים אי-זוגיים: 1, 3, 5, 7, 9, 11...</li>
            <li>• טיפ: הספרה האחרונה קובעת!</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}

// ===== WORD PROBLEM VISUAL =====
function generateWordProblemVisual(question: Question, operation: 'addition' | 'subtraction'): React.ReactNode {
  const { promptHe } = question;
  
  // Try to extract context and numbers
  const contextEmojis: Record<string, string> = {
    'תפוח': '🍎',
    'בלון': '🎈',
    'ילד': '👧',
    'תלמיד': '👨‍🎓',
    'עוגיה': '🍪',
    'ממתק': '🍬',
    'פרי': '🍊',
    'ציפור': '🐦',
    'כוכב': '⭐',
    'פרח': '🌸',
  };
  
  let emoji = '🔵';
  for (const [word, emj] of Object.entries(contextEmojis)) {
    if (promptHe.includes(word)) {
      emoji = emj;
      break;
    }
  }

  return (
    <div className="space-y-4 text-center">
      <div className="text-5xl">{emoji}</div>
      <div className="rounded-xl bg-blue-50 p-4">
        <div className="text-lg font-bold text-blue-800 mb-2">
          {operation === 'addition' ? 'בעיית חיבור' : 'בעיית חיסור'}
        </div>
        <div className="text-blue-700">
          {operation === 'addition' ? (
            <p>כשמוסיפים משהו - מחברים (+)</p>
          ) : (
            <p>כשמורידים או נותנים - מחסרים (−)</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== GENERIC VISUAL =====
function generateGenericVisual(_question: Question): React.ReactNode {
  return (
    <div className="space-y-4 text-center">
      <div className="text-5xl">💡</div>
      <div className="text-lg text-slate-600">
        קראו את השאלה בעיון והשתמשו במה שלמדתם!
      </div>
    </div>
  );
}

// ===== NUMBER LINE COMPONENT =====
interface NumberLineProps {
  start?: number;
  end?: number;
  jumps?: Array<{ from: number; to: number; color: string; direction?: 'back' }>;
  highlight?: number;
  showNeighbors?: boolean;
  showBackward?: boolean;
}

function NumberLineVisualization({ 
  start = 0, 
  end, 
  jumps = [], 
  highlight,
  showNeighbors = false 
}: NumberLineProps) {
  // Calculate range
  let min = start;
  let max = end ?? start;
  
  for (const jump of jumps) {
    min = Math.min(min, jump.from, jump.to);
    max = Math.max(max, jump.from, jump.to);
  }
  
  if (highlight !== undefined) {
    min = Math.min(min, highlight - 1);
    max = Math.max(max, highlight + 1);
  }
  
  // Add some padding
  min = Math.max(0, min - 1);
  max = max + 1;
  
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const getPosition = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <div className="relative px-4 py-8">
      {/* Line */}
      <div className="h-2 bg-slate-300 rounded-full relative">
        {/* Tick marks and numbers */}
        {numbers.map((n) => (
          <div 
            key={n} 
            className="absolute flex flex-col items-center"
            style={{ left: `${getPosition(n)}%`, transform: 'translateX(-50%)' }}
          >
            <div className={`w-1 h-4 -mt-1 rounded ${
              n === highlight ? 'bg-yellow-500 w-2' : 'bg-slate-400'
            }`} />
            <span className={`text-sm font-bold mt-1 ${
              n === highlight ? 'text-yellow-600 text-lg' : 
              showNeighbors && (n === (highlight ?? 0) - 1 || n === (highlight ?? 0) + 1) ? 'text-blue-600' :
              'text-slate-600'
            }`}>
              {n}
            </span>
          </div>
        ))}
      </div>

      {/* Jump arcs */}
      {jumps.map((jump, i) => {
        const fromPos = getPosition(jump.from);
        const toPos = getPosition(jump.to);
        const isBackward = jump.to < jump.from;
        const arcHeight = 40;
        
        return (
          <svg 
            key={i}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <path
              d={`M ${fromPos}% 20 Q ${(fromPos + toPos) / 2}% ${20 - arcHeight} ${toPos}% 20`}
              fill="none"
              stroke={jump.color === 'blue' ? '#3b82f6' : jump.color === 'red' ? '#ef4444' : '#22c55e'}
              strokeWidth="3"
              strokeDasharray={isBackward ? '8,4' : undefined}
              markerEnd="url(#arrowhead)"
            />
            {/* Jump label */}
            <text 
              x={`${(fromPos + toPos) / 2}%`} 
              y={20 - arcHeight - 5}
              textAnchor="middle"
              fill={jump.color === 'blue' ? '#3b82f6' : jump.color === 'red' ? '#ef4444' : '#22c55e'}
              fontSize="14"
              fontWeight="bold"
            >
              {isBackward ? `−${jump.from - jump.to}` : `+${jump.to - jump.from}`}
            </text>
          </svg>
        );
      })}

      {/* Arrow marker definition */}
      <svg width="0" height="0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
