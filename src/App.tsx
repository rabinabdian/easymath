// src/App.tsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { countTo5Exercises, type CountExercise } from "./data/countTo5";
import { useChildSettings, type ChildSettings } from "./context/ChildSettingsContext";

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
      </div>
    </div>
  );
}

type FeedbackState = "idle" | "correct" | "wrong" | "finished";

function SessionPage() {
  const { settings } = useChildSettings();
  const navigate = useNavigate();

  // כרגע יש לנו רק תרגילי ספירה עד 5
  // בהמשך נוסיף מערכים נוספים ונבחר לפי maxNumber
  const allExercises: CountExercise[] = countTo5Exercises;

  const sessionExercises = allExercises.slice(0, settings.sessionLength);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  const current = sessionExercises[currentIndex];

  const handleAnswer = (answer: number) => {
    if (feedback === "finished") return;

    if (answer === current.correctAnswer) {
      if (settings.soundsEnabled) {
        // אפשר להוסיף צליל בעתיד
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
            }}
          >
            עוד סשן
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-right">
      <h2 className="title">ספור ולחץ על המספר הנכון</h2>

      <div className="subtitle-small">
        תרגיל {currentIndex + 1} מתוך {sessionExercises.length}
      </div>

      {/* אזור האייקונים */}
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

      {/* אופציות תשובה */}
      <div className="buttons options-row">
        {current.options.map((option: number) => (
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

function ParentPage() {
  const { settings, setSettings } = useChildSettings();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newSettings: ChildSettings = {
      childName: (formData.get("childName") as string) || "ילד",
      maxNumber: Number(formData.get("maxNumber")) === 10 ? 10 : 5,
      sessionLength: Number(formData.get("sessionLength")) as
        | 5
        | 7
        | 10,
      showHints: formData.get("showHints") === "on",
      animationsEnabled: formData.get("animationsEnabled") === "on",
      soundsEnabled: formData.get("soundsEnabled") === "on",
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
          <select
            name="sessionLength"
            defaultValue={settings.sessionLength}
          >
            <option value={5}>5 תרגילים</option>
            <option value={7}>7 תרגילים</option>
            <option value={10}>10 תרגילים</option>
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
          <span>צליל פידבק על תשובה</span>
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
    </Routes>
  );
}
