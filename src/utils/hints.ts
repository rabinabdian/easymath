// src/utils/hints.ts
import type { Question } from '../types/questions';
import type { Locale } from '../i18n';

/**
 * Generates escalating hints based on attempt number
 * Hints become progressively more helpful:
 * - Attempt 1: General encouragement and direction
 * - Attempt 2: More specific guidance
 * - Attempt 3: Very specific hint without giving away the answer
 */
export function generateHint(
  question: Question,
  attemptNumber: number,
  locale: Locale
): string {
  const isHebrew = locale === 'he';
  const answer = String(question.answer);
  
  // Parse the question to extract numbers and operation
  const prompt = isHebrew ? question.promptHe : question.promptEn;
  
  // Extract numbers from prompt (for math questions)
  const numbers = prompt.match(/\d+/g)?.map(Number) || [];
  const hasAddition = prompt.includes('+') || prompt.includes('חיבור') || prompt.includes('plus');
  const hasSubtraction = prompt.includes('-') || prompt.includes('חיסור') || prompt.includes('minus');
  const hasMultiplication = prompt.includes('×') || prompt.includes('*') || prompt.includes('כפל') || prompt.includes('multiply');
  
  if (attemptNumber === 1) {
    // First hint: General encouragement and direction
    if (isHebrew) {
      if (hasAddition && numbers.length >= 2) {
        return `נסה לחשוב: כמה זה ${numbers[0]} ועוד ${numbers[1]}? נסה לספור על האצבעות או לחשוב על זה בדרך אחרת.`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `נסה לחשוב: אם יש לך ${numbers[0]} ואתה לוקח ${numbers[1]}, כמה נשאר? נסה לספור לאחור או לחשוב על זה בדרך אחרת.`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `נסה לחשוב: כמה זה ${numbers[0]} כפול ${numbers[1]}? נסה לחשוב על זה כחיבור חוזר או לזכור את לוח הכפל.`;
      }
      return 'קרא את השאלה שוב בעיון. נסה לחשוב על מה מבקשים ממך.';
    } else {
      if (hasAddition && numbers.length >= 2) {
        return `Try thinking: what is ${numbers[0]} plus ${numbers[1]}? Try counting on your fingers or thinking about it another way.`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `Try thinking: if you have ${numbers[0]} and take away ${numbers[1]}, how many are left? Try counting backwards or thinking about it another way.`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `Try thinking: what is ${numbers[0]} times ${numbers[1]}? Try thinking of it as repeated addition or remember the multiplication table.`;
      }
      return 'Read the question again carefully. Try to think about what is being asked.';
    }
  }
  
  if (attemptNumber === 2) {
    // Second hint: More specific guidance
    if (isHebrew) {
      if (hasAddition && numbers.length >= 2) {
        const smaller = Math.min(numbers[0], numbers[1]);
        const larger = Math.max(numbers[0], numbers[1]);
        return `רמז: התחל מהמספר הגדול יותר (${larger}) וספור קדימה ${smaller} צעדים. או נסה לחשוב: ${numbers[0]} + ${numbers[1]} = ?`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `רמז: התחל מהמספר הראשון (${numbers[0]}) וספור לאחור ${numbers[1]} צעדים. או נסה לחשוב: ${numbers[0]} - ${numbers[1]} = ?`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `רמז: כפל זה חיבור חוזר. ${numbers[0]} כפול ${numbers[1]} זה כמו ${numbers[0]} + ${numbers[0]}${numbers[1] > 2 ? ` + ${numbers[0]}` : ''}${numbers[1] > 3 ? '...' : ''}`;
      }
      return 'נסה לפרק את השאלה לחלקים קטנים יותר. מה השלב הראשון שצריך לעשות?';
    } else {
      if (hasAddition && numbers.length >= 2) {
        const smaller = Math.min(numbers[0], numbers[1]);
        const larger = Math.max(numbers[0], numbers[1]);
        return `Hint: Start from the larger number (${larger}) and count forward ${smaller} steps. Or try thinking: ${numbers[0]} + ${numbers[1]} = ?`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `Hint: Start from the first number (${numbers[0]}) and count backwards ${numbers[1]} steps. Or try thinking: ${numbers[0]} - ${numbers[1]} = ?`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `Hint: Multiplication is repeated addition. ${numbers[0]} times ${numbers[1]} is like ${numbers[0]} + ${numbers[0]}${numbers[1] > 2 ? ` + ${numbers[0]}` : ''}${numbers[1] > 3 ? '...' : ''}`;
      }
      return 'Try breaking the question into smaller parts. What is the first step you need to take?';
    }
  }
  
  if (attemptNumber === 3) {
    // Third hint: Very specific without giving the answer
    if (isHebrew) {
      if (hasAddition && numbers.length >= 2) {
        return `רמז אחרון: נסה לחשב ${numbers[0]} + ${numbers[1]}. אם זה קשה, נסה לחשוב על זה ככה: קח את ${numbers[0]}, הוסף ${numbers[1]}, מה תקבל?`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `רמז אחרון: נסה לחשב ${numbers[0]} - ${numbers[1]}. אם זה קשה, נסה לחשוב: כמה צריך להוסיף ל-${numbers[1]} כדי להגיע ל-${numbers[0]}?`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `רמז אחרון: נסה לחשב ${numbers[0]} × ${numbers[1]}. אם זה קשה, נסה לחשוב: כמה זה ${numbers[0]} פעמים ${numbers[1]}?`;
      }
      return 'זה הניסיון האחרון לפני שנציג את הפתרון המלא. נסה לחשוב על כל מה שלמדת עד עכשיו.';
    } else {
      if (hasAddition && numbers.length >= 2) {
        return `Last hint: Try calculating ${numbers[0]} + ${numbers[1]}. If it's hard, try thinking: take ${numbers[0]}, add ${numbers[1]}, what do you get?`;
      }
      if (hasSubtraction && numbers.length >= 2) {
        return `Last hint: Try calculating ${numbers[0]} - ${numbers[1]}. If it's hard, try thinking: how much do you need to add to ${numbers[1]} to get ${numbers[0]}?`;
      }
      if (hasMultiplication && numbers.length >= 2) {
        return `Last hint: Try calculating ${numbers[0]} × ${numbers[1]}. If it's hard, try thinking: what is ${numbers[0]} times ${numbers[1]}?`;
      }
      return 'This is the last attempt before we show the full solution. Try thinking about everything you\'ve learned so far.';
    }
  }
  
  // Fallback
  return isHebrew 
    ? 'נסה לחשוב על זה בדרך אחרת. אתה יכול לעשות את זה!'
    : 'Try thinking about it in a different way. You can do it!';
}

/**
 * Generates a detailed solution explanation with step-by-step guidance
 * This is shown after 3 failed attempts
 */
export function generateDetailedSolution(
  question: Question,
  locale: Locale
): string {
  const isHebrew = locale === 'he';
  const answer = String(question.answer);
  
  // Check if there's already an auto-solve explanation
  const existingExplanation = isHebrew 
    ? question.autoSolveExplanationHe 
    : question.autoSolveExplanationEn;
  
  if (existingExplanation) {
    return existingExplanation;
  }
  
  // Generate explanation based on question type
  const prompt = isHebrew ? question.promptHe : question.promptEn;
  const numbers = prompt.match(/\d+/g)?.map(Number) || [];
  const hasAddition = prompt.includes('+') || prompt.includes('חיבור') || prompt.includes('plus');
  const hasSubtraction = prompt.includes('-') || prompt.includes('חיסור') || prompt.includes('minus');
  const hasMultiplication = prompt.includes('×') || prompt.includes('*') || prompt.includes('כפל') || prompt.includes('multiply');
  
  if (isHebrew) {
    if (hasAddition && numbers.length >= 2) {
      return `בוא נפתור את זה ביחד שלב אחר שלב:

שלב 1: נסתכל על המספרים שיש לנו: ${numbers[0]} ו-${numbers[1]}

שלב 2: כשאנחנו מחברים, אנחנו משלבים את שני המספרים יחד

שלב 3: ננסה לספור: התחל מ-${numbers[0]} וספור קדימה ${numbers[1]} צעדים

שלב 4: ${numbers[0]} + ${numbers[1]} = ${answer}

זכור: חיבור זה כמו לקחת שני דברים ולשים אותם יחד. תמיד אפשר לספור על האצבעות או להשתמש בדרכים אחרות!`;
    }
    
    if (hasSubtraction && numbers.length >= 2) {
      return `בוא נפתור את זה ביחד שלב אחר שלב:

שלב 1: נסתכל על המספרים שיש לנו: ${numbers[0]} ו-${numbers[1]}

שלב 2: כשאנחנו מחסרים, אנחנו לוקחים כמות מסוימת מהמספר הגדול

שלב 3: ננסה לספור: התחל מ-${numbers[0]} וספור לאחור ${numbers[1]} צעדים

שלב 4: ${numbers[0]} - ${numbers[1]} = ${answer}

זכור: חיסור זה כמו לקחת דברים. אם יש לך ${numbers[0]} ואתה לוקח ${numbers[1]}, כמה נשאר?`;
    }
    
    if (hasMultiplication && numbers.length >= 2) {
      return `בוא נפתור את זה ביחד שלב אחר שלב:

שלב 1: נסתכל על המספרים שיש לנו: ${numbers[0]} ו-${numbers[1]}

שלב 2: כפל זה חיבור חוזר - אנחנו לוקחים את ${numbers[0]} ${numbers[1]} פעמים

שלב 3: ${numbers[0]} × ${numbers[1]} = ${numbers[0]} + ${numbers[0]}${numbers[1] > 2 ? ` + ${numbers[0]}` : ''}${numbers[1] > 3 ? ' + ...' : ''}

שלב 4: ${numbers[0]} × ${numbers[1]} = ${answer}

זכור: כפל זה דרך מהירה לעשות חיבור חוזר. ${numbers[0]} כפול ${numbers[1]} זה כמו לקחת ${numbers[0]} ${numbers[1]} פעמים!`;
    }
    
    return `התשובה הנכונה היא ${answer}. בוא נחשוב על זה ביחד: ${prompt}`;
  } else {
    if (hasAddition && numbers.length >= 2) {
      return `Let's solve this together step by step:

Step 1: Look at the numbers we have: ${numbers[0]} and ${numbers[1]}

Step 2: When we add, we combine the two numbers together

Step 3: Let's count: Start from ${numbers[0]} and count forward ${numbers[1]} steps

Step 4: ${numbers[0]} + ${numbers[1]} = ${answer}

Remember: Addition is like taking two things and putting them together. You can always count on your fingers or use other methods!`;
    }
    
    if (hasSubtraction && numbers.length >= 2) {
      return `Let's solve this together step by step:

Step 1: Look at the numbers we have: ${numbers[0]} and ${numbers[1]}

Step 2: When we subtract, we take away a certain amount from the larger number

Step 3: Let's count: Start from ${numbers[0]} and count backwards ${numbers[1]} steps

Step 4: ${numbers[0]} - ${numbers[1]} = ${answer}

Remember: Subtraction is like taking things away. If you have ${numbers[0]} and take away ${numbers[1]}, how many are left?`;
    }
    
    if (hasMultiplication && numbers.length >= 2) {
      return `Let's solve this together step by step:

Step 1: Look at the numbers we have: ${numbers[0]} and ${numbers[1]}

Step 2: Multiplication is repeated addition - we take ${numbers[0]} ${numbers[1]} times

Step 3: ${numbers[0]} × ${numbers[1]} = ${numbers[0]} + ${numbers[0]}${numbers[1] > 2 ? ` + ${numbers[0]}` : ''}${numbers[1] > 3 ? ' + ...' : ''}

Step 4: ${numbers[0]} × ${numbers[1]} = ${answer}

Remember: Multiplication is a fast way to do repeated addition. ${numbers[0]} times ${numbers[1]} is like taking ${numbers[0]} ${numbers[1]} times!`;
    }
    
    return `The correct answer is ${answer}. Let's think about it together: ${prompt}`;
  }
}

/**
 * Generates topic expansion/teaching content
 * This provides additional educational content about the topic
 */
export function generateTopicExpansion(
  question: Question,
  locale: Locale
): string | null {
  const isHebrew = locale === 'he';
  
  // Check topic and provide relevant expansion
  if (question.topic === 'addition') {
    return isHebrew
      ? `💡 עוד על חיבור:
חיבור הוא פעולה מתמטית בסיסית. כשאנחנו מחברים שני מספרים, אנחנו משלבים אותם יחד.

דרכים לפתור חיבור:
1. ספירה על האצבעות - שיטה מעולה למתחילים
2. ספירה קדימה - התחל מהמספר הגדול וספור קדימה
3. זיכרון - ככל שתתרגל יותר, תזכור יותר תשובות
4. שימוש בעשרות - למשל: 7 + 5 = 7 + 3 + 2 = 10 + 2 = 12

טיפ: תמיד אפשר לבדוק את התשובה על ידי חיבור הפוך או ספירה!`
      : `💡 More about Addition:
Addition is a basic mathematical operation. When we add two numbers, we combine them together.

Ways to solve addition:
1. Counting on fingers - great method for beginners
2. Counting forward - start from the larger number and count forward
3. Memory - the more you practice, the more answers you'll remember
4. Using tens - for example: 7 + 5 = 7 + 3 + 2 = 10 + 2 = 12

Tip: You can always check your answer by reverse addition or counting!`;
  }
  
  if (question.topic === 'subtraction') {
    return isHebrew
      ? `💡 עוד על חיסור:
חיסור הוא פעולה מתמטית שבה אנחנו לוקחים כמות מסוימת מהמספר הגדול.

דרכים לפתור חיסור:
1. ספירה לאחור - התחל מהמספר הגדול וספור לאחור
2. חיבור הפוך - כמה צריך להוסיף למספר הקטן כדי להגיע לגדול?
3. שימוש בעשרות - למשל: 15 - 7 = 15 - 5 - 2 = 10 - 2 = 8
4. זיכרון - ככל שתתרגל יותר, תזכור יותר תשובות

טיפ: חיסור זה ההפך מחיבור. אם 5 + 3 = 8, אז 8 - 3 = 5!`
      : `💡 More about Subtraction:
Subtraction is a mathematical operation where we take away a certain amount from the larger number.

Ways to solve subtraction:
1. Counting backwards - start from the larger number and count backwards
2. Reverse addition - how much do you need to add to the smaller number to get the larger one?
3. Using tens - for example: 15 - 7 = 15 - 5 - 2 = 10 - 2 = 8
4. Memory - the more you practice, the more answers you'll remember

Tip: Subtraction is the opposite of addition. If 5 + 3 = 8, then 8 - 3 = 5!`;
  }
  
  if (question.topic === 'multiplication') {
    return isHebrew
      ? `💡 עוד על כפל:
כפל הוא דרך מהירה לעשות חיבור חוזר. כשאנחנו כופלים שני מספרים, אנחנו לוקחים את המספר הראשון כמה פעמים.

דרכים לפתור כפל:
1. חיבור חוזר - 3 × 4 = 3 + 3 + 3 + 3 = 12
2. לוח הכפל - שינון וזכירה
3. שימוש בכפולות - למשל: 6 × 4 = (3 × 4) × 2 = 12 × 2 = 24
4. אסטרטגיות - כפול ב-2 זה כמו לחבר את המספר לעצמו

טיפ: תרגול יומי של לוח הכפל יעזור לך לזכור את התשובות מהר יותר!`
      : `💡 More about Multiplication:
Multiplication is a fast way to do repeated addition. When we multiply two numbers, we take the first number several times.

Ways to solve multiplication:
1. Repeated addition - 3 × 4 = 3 + 3 + 3 + 3 = 12
2. Multiplication table - memorization
3. Using multiples - for example: 6 × 4 = (3 × 4) × 2 = 12 × 2 = 24
4. Strategies - multiplying by 2 is like adding the number to itself

Tip: Daily practice of the multiplication table will help you remember answers faster!`;
  }
  
  return null;
}
