import type { Question } from '../types/questions';
import type { TopicLesson } from '../data/topicLessons';
import { TOPIC_LESSONS } from '../data/topicLessons';

export interface LocalizedLessonContent {
  explanation?: string;
  example?: string;
  steps?: string[];
  tip?: string;
}

function matchLessonTemplate(question: Question): TopicLesson | undefined {
  if (question.subtopic) {
    const bySubtopic = TOPIC_LESSONS.find(
      (lesson) =>
        lesson.topic === question.topic &&
        lesson.subtopics?.some((sub) => sub === question.subtopic)
    );

    if (bySubtopic) {
      return bySubtopic;
    }
  }

  return TOPIC_LESSONS.find((lesson) => lesson.topic === question.topic && !lesson.subtopics);
}

export function getLessonContent(
  question: Question,
  locale: 'he' | 'en'
): LocalizedLessonContent | undefined {
  const template = matchLessonTemplate(question);

  const explanationFromQuestion = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const exampleFromQuestion = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  if (!template && !explanationFromQuestion && !exampleFromQuestion) {
    return undefined;
  }

  const explanation = explanationFromQuestion
    ?? (template ? (locale === 'he' ? template.explanationHe : template.explanationEn) : undefined);

  const example = exampleFromQuestion
    ?? (template ? (locale === 'he' ? template.exampleHe : template.exampleEn) : undefined);

  const steps = template
    ? (locale === 'he' ? template.stepsHe : template.stepsEn)
    : undefined;

  const tip = template
    ? (locale === 'he' ? template.tipHe : template.tipEn)
    : undefined;

  return {
    explanation,
    example,
    steps,
    tip,
  };
}
