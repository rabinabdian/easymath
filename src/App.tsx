// src/App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { countTo5Exercises } from "./data/countTo5";
import type { CountExercise } from "./data/countTo5";
import { useChildSettings } from "./context/ChildSettingsContext";
import type { ChildSettings } from "./context/ChildSettingsContext";
import { speak } from "./utils/speech";
import TeacherDashboard from "./components/TeacherDashboard";
import YearPlanView from "./components/YearPlanView";
import { generateYearPlan } from "./utils/yearPlanGenerator";
import { loadExams, getExamById } from "./utils/examsStorage";
import type { SavedExam } from "./utils/examsStorage";
import StudentGame from "./components/StudentGame";

function HomePage() {
  const navigate = useNavigate();
  const { settings } = useChildSettings();

  return (
    <div className="page page-right">
      <h1 className="title">Easymath</h1>
      <p className="subtitle">חשבון פשוט לילדים</p>
      <p className="subtitle-small">שלום {settings.childName} 😊</p>

      <div className="buttons">
        <button onClick={() => navigate("/session")}>התחל תרגול</button>
        <button onClick={() => navigate("/parent")}>כניסת הורה</button>
        <button onClick={() => navigate("/teacher")}>כניסת מורה</button>
      </div>
    </div>
  );
}

type FeedbackState = "idle" | "correct" | "wrong" | "finished";

/**
 * תרגיל דוגמה מודרך:
 * 3 עיגולים, הילד צריך ללחוץ על "3"
 */
function TutorialExercise({ onDone }: { onDone: () => void }) {
  const { settings } = useChildSettings();
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  const iconsCount = 3;
  const options = [2, 3, 4];

  useEffect(() => {
    if (!settings.soundsEnabled) return;

    speak(`שלום ${settings.childName}. נעשה עכשיו דוגמה ביחד.`);
    setTimeout(() => {
      speak(
        "תסתכל על העיגולים על המסך. יש שלושה עיגולים. נספור ביחד: אחד, שתיים, שלוש."
      );
    }, 2000);
    setTimeout(() => {
      speak("עכשיו תלחץ על הכפתור עם מספר שלוש.");
    }, 6000);
  }, [settings.childName, settings.soundsEnabled]);

  const handleAnswer = (answer: number) => {
    if (answer === 3) {
      setFeedback("correct");
      if (settings.soundsEnabled) {
        speak("מעולה! עכשיו נתחיל את התרגול האמיתי.");
      }
      setTimeout(() => {
        onDone();
      }, 1500);
    } else {
      setFeedback("wrong");
      if (settings.soundsEnabled) {
        speak("כמעט. נסה לבחור את המספר שלוש.");
      }
      setTimeout(() => setFeedback("idle"), 1000);
    }
  };

  const replayTutorial = () => {
    if (!settings.soundsEnabled) return;
    speak(
      "בדוגמה הזאת יש שלושה עיגולים. נספור ביחד: אחד, שתיים, שלוש. אחר כך לוחצים על הכפתור עם מספר שלוש."
    );
  };

  return (
    <div className="page page-right">
      <div className="title-row">
        <h2 className="title">דוגמה</h2>
        <button
          type="button"
          className="icon-button"
          onClick={replayTutorial}
        >
          🔊
        </button>
      </div>

      <div className="subtitle-small">קודם עושים דוגמה יחד, אחר כך תרגול.</div>
      <div className="badge">תרגיל לדוגמה</div>

      <div className="icons-row">
        {Array.from({ length: iconsCount }).map((_, idx) => (
          <div key={idx} className="icon-circle icon-circle-anim" />
        ))}
      </div>

      <div className="buttons options-row">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`option-button ${
              feedback === "wrong" ? "option-button-wrong" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="feedback">
        {feedback === "correct" && <span>כל הכבוד! 🎉</span>}
        {feedback === "wrong" && <span>ננסה שוב לבחור שלוש 🙂</span>}
      </div>
    </div>
  );
}

function SessionPage() {
  const { settings } = useChildSettings();
  const navigate = useNavigate();

  // אם נבחר מבחן מהמורה, נשתמש ב-StudentGame
  if (settings.selectedExamId) {
    const exam = getExamById(settings.selectedExamId);
    if (exam && exam.questions.length > 0) {
      // השתמש במשחק של תלמיד עם השאלות מהמבחן הנבחר
      return (
        <StudentGame
          questions={exam.questions.slice(0, settings.sessionLength)}
          onExit={() => navigate("/")}
        />
      );
    }
  }

  // ברירת מחדל: תרגילי ספירה
  const allExercises: CountExercise[] = countTo5Exercises;

  // Defensive: ensure sessionLength is valid
  const safeSessionLength = [5, 7, 10].includes(settings.sessionLength)
    ? settings.sessionLength
    : 5;
  const sessionExercises = allExercises.slice(0, safeSessionLength);

  const [tutorialDone, setTutorialDone] = useState(false);
  const [introSpoken, setIntroSpoken] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  // פתיח פעם אחת בלבד בתחילת הסשן
  useEffect(() => {
    if (!settings.soundsEnabled || !tutorialDone || introSpoken) return;

    const total = sessionExercises.length;
    const text = `שלום ${settings.childName}. עכשיו נעשה יחד סדרה קצרה של תרגילים בחשבון. בכל תרגיל תסתכל על העיגולים, תספור אותם לאט בקול, ואז תלחץ על הכפתור עם המספר הנכון. נתחיל עכשיו בסדרה של ${total} תרגילים.`;

    speak(text);
    setIntroSpoken(true);
  }, [tutorialDone, introSpoken, sessionExercises.length, settings.soundsEnabled, settings.childName]);

  // לכל תרגיל: "עכשיו תרגיל X מתוך Y..."
  useEffect(() => {
    if (!settings.soundsEnabled || !tutorialDone || !introSpoken) return;

    const qNumber = currentIndex + 1;
    const total = sessionExercises.length;

    const text = `עכשיו תרגיל מספר ${qNumber} מתוך ${total}. תסתכל על העיגולים על המסך, ספר אותם לאט בקול, ואז תלחץ על הכפתור עם המספר הנכון.`;

    speak(text);
  }, [
    currentIndex,
    tutorialDone,
    introSpoken,
    sessionExercises.length,
    settings.soundsEnabled,
  ]);

  // אם עוד לא עברנו דוגמה – מציגים רק אותה
  if (!tutorialDone) {
    return <TutorialExercise onDone={() => {
      setTutorialDone(true);
      setCurrentIndex(0);
      setFeedback("idle");
      setIntroSpoken(false);
    }} />;
  }

  // Defensive: ensure we have exercises and currentIndex is valid
  if (sessionExercises.length === 0 || currentIndex >= sessionExercises.length) {
    console.error('Session error:', {
      sessionExercisesLength: sessionExercises.length,
      currentIndex,
      settings
    });
    return (
      <div className="page page-right">
        <h2 className="title">שגיאה</h2>
        <p className="subtitle">לא נמצאו תרגילים (אורך: {sessionExercises.length}, אינדקס: {currentIndex})</p>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </div>
    );
  }

  const current = sessionExercises[currentIndex];

  // Additional safety check
  if (!current) {
    console.error('Current exercise is undefined:', { currentIndex, sessionExercises });
    return (
      <div className="page page-right">
        <h2 className="title">שגיאה</h2>
        <p className="subtitle">תרגיל נוכחי לא נמצא</p>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </div>
    );
  }

  const handleAnswer = (answer: number) => {
    if (feedback === "finished") return;

    if (answer === current.correctAnswer) {
      if (settings.soundsEnabled) {
        speak("מצוין, בחרת את המספר הנכון.");
      }
      setFeedback("correct");

      setTimeout(() => {
        if (currentIndex + 1 < sessionExercises.length) {
          setCurrentIndex((prev) => prev + 1);
          setFeedback("idle");
        } else {
          setFeedback("finished");
        }
      }, 800);
    } else {
      if (settings.soundsEnabled) {
        speak("לא נורא, נספור שוב וננסה עוד פעם.");
      }
      setFeedback("wrong");

      setTimeout(() => {
        setFeedback("idle");
      }, 700);
    }
  };

  if (feedback === "finished") {
    return (
      <div className="page page-right">
        <h2 className="title">כל הכבוד {settings.childName}! 🎉</h2>
        <p className="subtitle">
          סיימנו {sessionExercises.length} תרגילים בסשן הזה.
        </p>
        <div className="buttons">
          <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setFeedback("idle");
              setIntroSpoken(false);
            }}
          >
            עוד סשן
          </button>
        </div>
      </div>
    );
  }

  const handleReplayInstruction = () => {
    if (!settings.soundsEnabled || !introSpoken) return;
    const qNumber = currentIndex + 1;
    const total = sessionExercises.length;

    speak(
      `עכשיו תרגיל מספר ${qNumber} מתוך ${total}. תסתכל על העיגולים, ספר אותם לאט בקול, ואז תלחץ על הכפתור עם המספר הנכון.`
    );
  };

  return (
    <div className="page page-right">
      <div className="title-row">
        <h2 className="title">ספור ולחץ על המספר הנכון</h2>
        <button
          type="button"
          className="icon-button"
          onClick={handleReplayInstruction}
        >
          🔊
        </button>
      </div>

      <div className="subtitle-small">
        תרגיל {currentIndex + 1} מתוך {sessionExercises.length}
      </div>

      <div className="icons-row">
        {Array.from({ length: current.iconsCount }).map((_, idx) => (
          <div
            key={idx}
            className={`icon-circle ${
              settings.animationsEnabled ? "icon-circle-anim" : ""
            }`}
          />
        ))}
      </div>

      <div className="buttons options-row">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`option-button ${
              feedback === "wrong" ? "option-button-wrong" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="feedback">
        {feedback === "correct" && <span>מצוין! 🎉</span>}
        {feedback === "wrong" && <span>בוא ננסה שוב 🙂</span>}
      </div>

      {settings.showHints && (
        <div className="hint-area">
          💡 אם קשה, נספור ביחד בקול: אחד, שתיים, שלוש...
        </div>
      )}
    </div>
  );
}

function YearPlanPage() {
  const plan = generateYearPlan({
    grade: 'א׳',
    yearLabel: 'תשפ״ו (2025-2026)',
  });

  return <YearPlanView plan={plan} />;
}

function ParentPage() {
  const { settings, setSettings } = useChildSettings();
  const navigate = useNavigate();
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);

  useEffect(() => {
    // טעינת מבחנים שמורים
    const exams = loadExams();
    setSavedExams(exams);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const selectedExamId = formData.get("selectedExamId") as string;

    const newSettings: ChildSettings = {
      childName: (formData.get("childName") as string) || "ילד",
      maxNumber: Number(formData.get("maxNumber")) === 10 ? 10 : 5,
      sessionLength: Number(formData.get("sessionLength")) as 5 | 7 | 10,
      showHints: formData.get("showHints") === "on",
      animationsEnabled: formData.get("animationsEnabled") === "on",
      soundsEnabled: formData.get("soundsEnabled") === "on",
      selectedExamId: selectedExamId || undefined,
    };

    setSettings(newSettings);
    navigate("/");
  };

  return (
    <div className="page page-right">
      <h2 className="title">מוד הורה</h2>
      <p className="subtitle">
        הגדרות בסיסיות ל-{settings.childName}. השינויים נשמרים במכשיר.
      </p>

      <form className="parent-form" onSubmit={handleSubmit}>
        <label className="form-group">
          <span>שם הילד/ה</span>
          <input
            name="childName"
            defaultValue={settings.childName}
            placeholder="שם"
          />
        </label>

        <label className="form-group">
          <span>מספרים עד:</span>
          <select name="maxNumber" defaultValue={settings.maxNumber}>
            <option value={5}>עד 5</option>
            <option value={10}>עד 10</option>
          </select>
        </label>

        <label className="form-group">
          <span>אורך סשן (מספר תרגילים):</span>
          <select name="sessionLength" defaultValue={settings.sessionLength}>
            <option value={5}>5 תרגילים</option>
            <option value={7}>7 תרגילים</option>
            <option value={10}>10 תרגילים</option>
          </select>
        </label>

        <label className="form-group">
          <span>בחר תרגילים מהמורה:</span>
          <select name="selectedExamId" defaultValue={settings.selectedExamId || ""}>
            <option value="">ברירת מחדל (ספירה עד 5)</option>
            {savedExams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} ({exam.questions.length} תרגילים)
              </option>
            ))}
          </select>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            name="showHints"
            defaultChecked={settings.showHints}
          />
          <span>הצגת רמז לילד</span>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            name="animationsEnabled"
            defaultChecked={settings.animationsEnabled}
          />
          <span>הפעלת אנימציה קלה</span>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            name="soundsEnabled"
            defaultChecked={settings.soundsEnabled}
          />
          <span>צליל / קריינות</span>
        </label>

        <div className="buttons parent-buttons">
          <button type="submit">שמירה וחזרה</button>
          <button type="button" onClick={() => navigate("/")}>
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/session" element={<SessionPage />} />
      <Route path="/parent" element={<ParentPage />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/year-plan" element={<YearPlanPage />} />
    </Routes>
  );
}
