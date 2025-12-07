// src/utils/animatedLessonAudio.ts
import type { Question } from '../types/questions';

/**
 * Get the audio text for AnimatedLesson based on question type
 * This matches the logic in AnimatedLesson component
 */
export function getAnimatedLessonAudioText(question: Question, locale: 'he' | 'en'): string {
  const { topic, subtopic } = question;
  const isHebrew = locale === 'he';

  switch (topic) {
    case 'numbers': {
      const targetNumber = typeof question.answer === 'number' ? question.answer : 5;
      const displayCount = Math.min(targetNumber, 12);
      return isHebrew 
        ? `בואו נספור ביחד עד ${displayCount}. כל פעם מצביעים ואומרים את המספר. אחת, שתיים, שלוש...`
        : `Let's count together to ${displayCount}. Each time we point and say the number. One, two, three...`;
    }

    case 'addition': {
      const mathMatch = question.promptHe?.match(/(\d+)\s*[+]\s*(\d+)/);
      const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 8) : 3;
      const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), 8) : 2;
      const sum = num1 + num2;
      return isHebrew
        ? `חיבור זה לחבר דברים ביחד. יש לנו ${num1} ועוד ${num2}. כשנחבר אותם ביחד נקבל ${sum}.`
        : `Addition is putting things together. We have ${num1} plus ${num2}. When we add them together we get ${sum}.`;
    }

    case 'subtraction': {
      const mathMatch = question.promptHe?.match(/(\d+)\s*[-−]\s*(\d+)/);
      const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 10) : 5;
      const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), num1) : 2;
      const result = num1 - num2;
      return isHebrew
        ? `חיסור זה להוריד דברים. יש לנו ${num1}. נוריד ${num2}. נשאר לנו ${result}.`
        : `Subtraction is taking things away. We have ${num1}. We take away ${num2}. We are left with ${result}.`;
    }

    case 'multiplication': {
      const mathMatch = question.promptHe?.match(/(\d+)\s*[×x*]\s*(\d+)/);
      const groups = mathMatch ? Math.min(parseInt(mathMatch[1]), 5) : 3;
      const itemsPerGroup = mathMatch ? Math.min(parseInt(mathMatch[2]), 5) : 2;
      const product = groups * itemsPerGroup;
      return isHebrew
        ? `כפל זה קבוצות שוות. יש לנו ${groups} קבוצות ובכל קבוצה ${itemsPerGroup} פריטים. ביחד יש ${product}.`
        : `Multiplication is equal groups. We have ${groups} groups with ${itemsPerGroup} items each. Together there are ${product}.`;
    }

    case 'evenOdd': {
      const numMatch = question.promptHe?.match(/(\d+)/);
      const number = numMatch ? Math.min(parseInt(numMatch[1]), 12) : 7;
      const isEven = number % 2 === 0;
      return isHebrew
        ? `בואו נבדוק אם ${number} הוא זוגי או אי-זוגי. נסדר בזוגות. ${isEven ? 'כולם בזוגות! זה זוגי.' : 'נשאר אחד לבד! זה אי-זוגי.'}`
        : `Let's check if ${number} is even or odd. We'll pair them up. ${isEven ? 'Everyone has a partner! It is even.' : 'One is left alone! It is odd.'}`;
    }

    case 'geometry': {
      if (subtopic?.includes('סימטריה') || subtopic?.includes('שיקוף')) {
        return isHebrew
          ? 'סימטריה זה כששני צדדים של צורה נראים אותו דבר. כמו פרפר או לב. אם נקפל על קו האמצע, הצדדים יתאימו.'
          : 'Symmetry is when both sides of a shape look the same. Like a butterfly or heart. If we fold on the middle line, the sides match.';
      }
      return isHebrew
        ? 'צורות שונות במספר הצלעות שלהן. משולש יש 3 צלעות, ריבוע 4, מחומש 5, ומשושה 6 צלעות.'
        : 'Shapes differ in the number of sides. Triangle has 3 sides, square has 4, pentagon has 5, and hexagon has 6 sides.';
    }

    default:
      return isHebrew
        ? 'קראו את השאלה בעיון ונסו להבין מה מבקשים. אתם יכולים!'
        : 'Read the question carefully and try to understand what is being asked. You can do it!';
  }
}
