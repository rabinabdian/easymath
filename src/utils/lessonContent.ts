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
  locale: 'he' | 'en'
): LocalizedLessonContent | undefined {
  const topicLesson = getTopicLesson(question.topic, question.subtopic);

  const explanationFromQuestion = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const exampleFromQuestion = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  const explanation = explanationFromQuestion
    ?? (topicLesson ? (locale === 'he' ? topicLesson.explanationHe : topicLesson.explanationEn) : undefined);

  const example = exampleFromQuestion
    ?? (topicLesson ? (locale === 'he' ? topicLesson.exampleHe : topicLesson.exampleEn) : undefined);

  const steps = topicLesson
    ? (locale === 'he' ? topicLesson.stepsHe : topicLesson.stepsEn)
    : undefined;

  const tip = topicLesson
    ? (locale === 'he' ? topicLesson.tipHe : topicLesson.tipEn)
    : undefined;

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
