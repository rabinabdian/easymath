import { Routes, Route, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1 className="title">Easymath</h1>
      <p className="subtitle">חשבון פשוט לילדים</p>

      <div className="buttons">
        <button onClick={() => navigate("/session")}>התחל תרגול</button>
        <button onClick={() => navigate("/parent")}>כניסת הורה</button>
      </div>
    </div>
  );
}

function SessionPage() {
  return (
    <div className="page">
      <h2 className="title">תרגול</h2>
      <p>כאן בעתיד יהיה מסך תרגיל לילד 👶</p>
    </div>
  );
}

function ParentPage() {
  return (
    <div className="page">
      <h2 className="title">מוד הורה</h2>
      <p>כאן בעתיד יהיו הגדרות לילד.</p>
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
