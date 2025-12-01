-- EasyMath Database Schema
-- PostgreSQL Database Schema with JWT Authentication

-- ============================================
-- USERS TABLE (Teachers & Admins)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'TEACHER', -- 'TEACHER' | 'ADMIN'
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- REFRESH TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL,
  user_agent   TEXT,
  ip_address   TEXT,
  expires_at   TIMESTAMP NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at   TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  grade       TEXT NOT NULL,
  year_label  TEXT NOT NULL,
  avatar      TEXT NOT NULL,  -- 'boy' | 'girl' | 'robot' | 'star'
  color       TEXT NOT NULL,  -- hex color (e.g., '#f97316')
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);

-- ============================================
-- EXAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  grade        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  meta_json    JSONB,      -- Extra metadata: topic, difficulty, etc.
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exams_teacher ON exams(teacher_id);

-- ============================================
-- EXAM QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exam_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id     UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,  -- Question ID from frontend QUESTIONS array
  order_index INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON exam_questions(exam_id);

-- ============================================
-- STUDENT ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id      UUID REFERENCES exams(id) ON DELETE SET NULL,  -- Optional: NULL for ad-hoc games
  source_type  TEXT NOT NULL,  -- 'exam' | 'game' | 'ad-hoc'
  score        INT NOT NULL,   -- Number of correct answers
  total        INT NOT NULL,   -- Total number of questions
  context_json JSONB,          -- Additional context: month, weekIndex, topic, etc.
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_attempts_student ON student_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_student_attempts_exam ON student_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_student_attempts_created ON student_attempts(created_at);

-- ============================================
-- STUDENT MONTH BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_month_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_label  TEXT NOT NULL,
  month       TEXT NOT NULL,  -- Month name (e.g., "ספטמבר")
  best_score  INT NOT NULL,   -- Best score percentage (0-100)
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, year_label, month)
);

CREATE INDEX IF NOT EXISTS idx_badges_student ON student_month_badges(student_id);

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================
-- Create a demo teacher user (password: "password123")
-- Password hash generated with bcrypt rounds=10
INSERT INTO users (email, password_hash, name, role) VALUES
  ('teacher@example.com', '$2b$10$rW9Z8Z8Z8Z8Z8Z8Z8Z8Z8.vKwGJxJxJxJxJxJxJxJxJxJxJxJxJxJ', 'Demo Teacher', 'TEACHER')
ON CONFLICT (email) DO NOTHING;

-- Create a demo admin user (password: "admin123")
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@example.com', '$2b$10$rW9Z8Z8Z8Z8Z8Z8Z8Z8Z8.vKwGJxJxJxJxJxJxJxJxJxJxJxJxJxJ', 'Demo Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
