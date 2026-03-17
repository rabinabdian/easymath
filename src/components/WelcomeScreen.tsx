// src/components/WelcomeScreen.tsx
import { useEffect, useRef, useMemo } from 'react';
import type { Question, TopicId } from '../types/questions';
import { useChildSettings } from '../context/ChildSettingsContext';
import { speak, stopSpeaking } from '../utils/speech';
import { TOPICS } from '../data/topics';
import { avatarEmoji } from '../utils/avatar';
import { loadStudentRecords } from '../utils/studentStorage';

interface WelcomeScreenProps {
  questions: Question[];
  onContinue: () => void;
}

// Get topic label in Hebrew for a given topic ID
function getTopicLabel(topicId: TopicId): string {
  const topic = TOPICS.find(t => t.id === topicId);
  return topic?.label ?? 'חשבון';
}

// Get topic icon for a given topic ID
function getTopicIcon(topicId: TopicId): string {
  const topic = TOPICS.find(t => t.id === topicId);
  return topic?.icon ?? '📚';
}

// קריאת ברכה תמיד בעברית בלבד
function buildWelcomeAudio(
  childName: string,
  topicLabel: string,
  questionsCount: number,
): string {
  return `שלום ${childName}! היום נתרגל יחד ${topicLabel}. יש לנו ${questionsCount} תרגילים מעניינים. בכל תרגיל תראה הסבר קצר לפני השאלה, ואם תצטרך עזרה, אני כאן! בואו נתחיל!`;
}

/**
 * WelcomeScreen - Displays a warm greeting when entering exercises
 * 
 * Features:
 * - Shows student's name and avatar/photo
 * - Greets with text-to-speech: "שלום [name]"
 * - Explains the topic of the exercises
 * - Large, accessible design for children
 */
export function WelcomeScreen({ questions, onContinue }: WelcomeScreenProps) {
  const { settings } = useChildSettings();
  const hasPlayedRef = useRef(false);

  // Get the linked student data if available
  const linkedStudent = useMemo(() => {
    if (!settings.studentId) return undefined;
    const records = loadStudentRecords();
    return records.find((rec) => rec.profile.id === settings.studentId);
  }, [settings.studentId]);

  // Determine student display info
  const studentName = linkedStudent?.profile.name || settings.childName || 'תלמיד';
  const avatarDisplay = linkedStudent
    ? avatarEmoji(linkedStudent.profile.avatar)
    : settings.studentAvatar
    ? avatarEmoji(settings.studentAvatar)
    : '🙂';
  const borderColor = linkedStudent?.profile.color || settings.studentColor || '#3b82f6';
  const photoUrl = linkedStudent?.profile.photoUrl || settings.studentPhotoUrl;

  // Determine the main topic from questions
  const mainTopic = useMemo(() => {
    if (!questions || questions.length === 0) return 'numbers' as TopicId;
    
    // Count topics in questions
    const topicCounts: Record<string, number> = {};
    questions.forEach(q => {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    });
    
    // Return most common topic
    let maxCount = 0;
    let mainTopicId: TopicId = 'numbers';
    Object.entries(topicCounts).forEach(([topic, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mainTopicId = topic as TopicId;
      }
    });
    
    return mainTopicId;
  }, [questions]);

  const topicLabel = getTopicLabel(mainTopic);
  const topicIcon = getTopicIcon(mainTopic);
  const questionsCount = questions.length;

  // Auto-play welcome audio
  useEffect(() => {
    if (hasPlayedRef.current) return;
    if (!settings.soundsEnabled) return;

    const welcomeText = buildWelcomeAudio(studentName, topicLabel, questionsCount);
    
    hasPlayedRef.current = true;
    speak(welcomeText);

    return () => {
      stopSpeaking();
    };
  }, [settings.soundsEnabled, studentName, topicLabel, questionsCount]);

  // טקסט תמיד בעברית בלבד
  const greetingText = `שלום ${studentName}!`;
  const topicIntroText = 'היום נתרגל יחד:';
  const exerciseCountText = `${questionsCount} תרגילים מחכים לך`;
  const encouragementText = 'בכל תרגיל תראה הסבר קצר לפני השאלה.\nאם תצטרך עזרה - אני כאן!';
  const startButtonText = 'בואו נתחיל! 🚀';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-slide-down">
          {/* Student Avatar/Photo */}
          <div className="mb-6 flex justify-center">
            {photoUrl ? (
              <div
                className="student-avatar-container animate-scale-pulse"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: `6px solid ${borderColor}`,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                }}
              >
                <img
                  src={photoUrl}
                  alt={`תמונה של ${studentName}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : (
              <div
                className="student-avatar-emoji animate-bounce-slow"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: `6px solid ${borderColor}`,
                  backgroundColor: '#f0f9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '72px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                }}
              >
                {avatarDisplay}
              </div>
            )}
          </div>

          {/* Greeting */}
          <h1 className="text-4xl font-bold text-slate-800 mb-4 animate-fade-slide-up">
            {greetingText}
          </h1>

          {/* Topic Introduction */}
          <p className="text-xl text-slate-600 mb-3 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
            {topicIntroText}
          </p>

          {/* Topic Badge */}
          <div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg mb-6 animate-fade-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-4xl">{topicIcon}</span>
            <span>{topicLabel}</span>
          </div>

          {/* Exercise Count */}
          <div 
            className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6 animate-fade-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <p className="text-xl text-emerald-700 font-medium flex items-center justify-center gap-2">
              <span className="text-2xl">📝</span>
              {exerciseCountText}
              <span className="text-2xl">⭐</span>
            </p>
          </div>

          {/* Encouragement */}
          <p 
            className="text-lg text-slate-600 whitespace-pre-line mb-8 animate-fade-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {encouragementText}
          </p>

          {/* Start Button */}
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 animate-pulse-slow"
          >
            {startButtonText}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-4 mt-6 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌟</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>💪</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌟</span>
        </div>
      </div>
    </div>
  );
}
