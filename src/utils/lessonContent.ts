import type { Question } from '../types/questions';
import { getTopicLesson } from '../data/topicLessons';

export interface LocalizedLessonContent {
  explanation?: string;
  example?: string;
  steps?: string[];
  tip?: string;
  emoji?: string;
}

export function getLessonContent(
  question: Question,
  _locale: 'he' | 'en'
): LocalizedLessonContent | undefined {
  const topicLesson = getTopicLesson(question.topic, question.subtopic);

  // הסברים וקריאות תמיד בעברית בלבד
  const explanationFromQuestion = question.introExplanationHe;
  const exampleFromQuestion = question.introExampleHe;

  const explanation = explanationFromQuestion
    ?? (topicLesson ? topicLesson.explanationHe : undefined);

  const example = exampleFromQuestion
    ?? (topicLesson ? topicLesson.exampleHe : undefined);

  const steps = topicLesson ? topicLesson.stepsHe : undefined;

  const tip = topicLesson ? topicLesson.tipHe : undefined;

  const normalizedSteps = steps?.filter((step) => Boolean(step?.trim())) ?? [];
  const normalizedTip = tip?.trim();
  const emoji = topicLesson?.emoji;

  if (
    !explanation &&
    !example &&
    normalizedSteps.length === 0 &&
    (!normalizedTip || normalizedTip.length === 0)
  ) {
    return undefined;
  }

  return {
    explanation,
    example,
    steps: normalizedSteps.length > 0 ? normalizedSteps : undefined,
    tip: normalizedTip,
    emoji,
  };
}
