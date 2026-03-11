// src/pages/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect to teacher dashboard
  if (user) {
    navigate('/teacher', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signInWithMagicLink(email.trim());
    setLoading(false);
    if (error) {
      setError('שגיאה בשליחת הקישור. נסה שנית.');
    } else {
      setSent(true);
    }
  };

  return (
    <div
      className="page page-right"
      style={{ maxWidth: 400, margin: '0 auto', padding: '2rem 1rem' }}
      dir="rtl"
    >
      <h1 className="title">כניסת מורה</h1>
      <p className="subtitle">EasyMath – ממשק ניהול</p>

      {sent ? (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 12,
            padding: '1.5rem',
            textAlign: 'center',
            marginTop: '2rem',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📧</div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>הקישור נשלח!</p>
          <p style={{ color: '#374151', fontSize: '0.9rem' }}>
            בדוק את האימייל <strong>{email}</strong> ולחץ על הקישור לכניסה.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}
            >
              כתובת אימייל
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            style={{ width: '100%' }}
          >
            {loading ? 'שולח...' : '✉️ שלח קישור כניסה'}
          </button>

          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.82rem',
              marginTop: '0.75rem',
            }}
          >
            ישלח קישור חד-פעמי לאימייל שלך — ללא סיסמה
          </p>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline',
          }}
        >
          ← חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}
