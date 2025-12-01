# Backend Architecture - EasyMath

## Overview

This document outlines the backend architecture for EasyMath, transitioning from localStorage to a cloud-based backend with database persistence.

## Technology Stack (Proposed)

- **Database**: PostgreSQL (recommended) or any SQL database
- **Backend Framework**: Node.js + Express / NestJS / Fastify (flexible)
- **ORM**: Prisma / TypeORM (optional)
- **Authentication**: JWT-based auth
- **Hosting**: Cloud provider (AWS, GCP, Azure, or Vercel/Railway)

---

## Database Schema

### Tables

#### 1. `teachers`
Teacher/user accounts who manage students and exams.

```sql
CREATE TABLE teachers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier
- `email`: Teacher's email (used for login)
- `password_hash`: Hashed password (bcrypt/argon2)
- `name`: Teacher's display name
- `created_at`: Account creation timestamp

#### 2. `students`
Student profiles managed by teachers.

```sql
CREATE TABLE students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  grade       TEXT NOT NULL,
  year_label  TEXT NOT NULL,
  avatar      TEXT NOT NULL,  -- 'boy' | 'girl' | 'robot' | 'star'
  color       TEXT NOT NULL,  -- hex color (e.g., '#f97316')
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_teacher ON students(teacher_id);
```

**Fields:**
- `id`: Unique identifier
- `teacher_id`: Foreign key to teachers table
- `name`: Student name
- `grade`: Grade level (e.g., "א׳", "ב׳")
- `year_label`: School year (e.g., "תשפ״ו")
- `avatar`: Avatar type ('boy' | 'girl' | 'robot' | 'star')
- `color`: Hex color for UI personalization
- `created_at`: Record creation timestamp

#### 3. `exams`
Saved exam templates created by teachers.

```sql
CREATE TABLE exams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  grade        TEXT NOT NULL,
  subject      TEXT NOT NULL,
  meta_json    JSONB,      -- Extra metadata: topic, difficulty, etc.
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_teacher ON exams(teacher_id);
```

**Fields:**
- `id`: Unique identifier
- `teacher_id`: Foreign key to teachers table
- `title`: Exam title
- `grade`: Target grade
- `subject`: Subject (e.g., "חשבון")
- `meta_json`: Additional metadata (JSON): topic, difficulty, etc.
- `created_at`: Creation timestamp

#### 4. `exam_questions`
Junction table linking exams to questions.

```sql
CREATE TABLE exam_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id     UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,  -- Question ID from frontend QUESTIONS array
  order_index INT NOT NULL
);

CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);
```

**Fields:**
- `id`: Unique identifier
- `exam_id`: Foreign key to exams table
- `question_id`: ID of the question (matches frontend question bank)
- `order_index`: Question order in exam

#### 5. `student_attempts`
Records of student game/exam attempts.

```sql
CREATE TABLE student_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id      UUID,  -- Optional: NULL for ad-hoc games
  source_type  TEXT NOT NULL,  -- 'exam' | 'game' | 'ad-hoc'
  score        INT NOT NULL,   -- Number of correct answers
  total        INT NOT NULL,   -- Total number of questions
  context_json JSONB,          -- Additional context: month, weekIndex, topic, etc.
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_attempts_student ON student_attempts(student_id);
CREATE INDEX idx_student_attempts_exam ON student_attempts(exam_id);
```

**Fields:**
- `id`: Unique identifier
- `student_id`: Foreign key to students table
- `exam_id`: Optional foreign key to exams (NULL for games)
- `source_type`: Type of attempt ('exam' | 'game' | 'ad-hoc')
- `score`: Number of correct answers
- `total`: Total questions attempted
- `context_json`: Additional context (month, week, topic, etc.)
- `created_at`: Attempt timestamp

#### 6. `student_month_badges`
Monthly achievement badges for students.

```sql
CREATE TABLE student_month_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  year_label  TEXT NOT NULL,
  month       TEXT NOT NULL,  -- Month name (e.g., "ספטמבר")
  best_score  INT NOT NULL,   -- Best score percentage (0-100)
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, year_label, month)
);

CREATE INDEX idx_badges_student ON student_month_badges(student_id);
```

**Fields:**
- `id`: Unique identifier
- `student_id`: Foreign key to students table
- `year_label`: School year
- `month`: Month name in Hebrew
- `best_score`: Best score percentage for that month
- `updated_at`: Last update timestamp
- **Constraint**: Unique per (student_id, year_label, month)

---

## API Endpoints

Base path: `/api`

### Authentication

#### `POST /api/auth/register`
Register a new teacher account.

**Request:**
```json
{
  "email": "teacher@example.com",
  "password": "securepassword",
  "name": "Teacher Name"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "teacher": {
    "id": "uuid",
    "email": "teacher@example.com",
    "name": "Teacher Name"
  }
}
```

#### `POST /api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "teacher@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "teacher": {
    "id": "uuid",
    "email": "teacher@example.com",
    "name": "Teacher Name"
  }
}
```

**Note:** All subsequent requests require `Authorization: Bearer <token>` header.

---

### Students

#### `GET /api/students`
Get all students for the authenticated teacher.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "profile": {
      "id": "uuid",
      "name": "נועם",
      "grade": "א׳",
      "yearLabel": "תשפ״ו",
      "avatar": "girl",
      "color": "#f97316"
    },
    "progress": {
      "monthBadges": [
        {
          "month": "נובמבר",
          "bestScore": 85
        }
      ]
    }
  }
]
```

#### `POST /api/students`
Create a new student.

**Request:**
```json
{
  "name": "נועם",
  "grade": "א׳",
  "yearLabel": "תשפ״ו",
  "avatar": "girl",
  "color": "#f97316"
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "name": "נועם",
    "grade": "א׳",
    "yearLabel": "תשפ״ו",
    "avatar": "girl",
    "color": "#f97316"
  },
  "progress": {
    "monthBadges": []
  }
}
```

#### `PATCH /api/students/:id`
Update student profile.

**Request:**
```json
{
  "name": "נועם (updated)",
  "avatar": "robot",
  "color": "#3b82f6"
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "name": "נועם (updated)",
    "grade": "א׳",
    "yearLabel": "תשפ״ו",
    "avatar": "robot",
    "color": "#3b82f6"
  }
}
```

#### `DELETE /api/students/:id`
Delete a student.

**Response:**
```json
{
  "success": true
}
```

---

### Exams

#### `GET /api/exams`
Get all exams for the authenticated teacher.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "חיבור עד 10 – אמצע שנה",
    "grade": "א׳",
    "subject": "חשבון",
    "questions": [
      "add_basic_001",
      "add_basic_002"
    ],
    "meta": {
      "topic": "addition",
      "difficulty": "easy-medium"
    },
    "createdAt": "2024-12-01T10:00:00Z"
  }
]
```

#### `POST /api/exams`
Create a new exam.

**Request:**
```json
{
  "title": "חיבור עד 10 – מבחן",
  "grade": "א׳",
  "subject": "חשבון",
  "questions": [
    "add_basic_001",
    "add_basic_002",
    "add_word_015"
  ],
  "meta": {
    "topic": "addition",
    "difficulty": "easy-medium"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "חיבור עד 10 – מבחן",
  "grade": "א׳",
  "subject": "חשבון",
  "questions": ["add_basic_001", "add_basic_002", "add_word_015"],
  "meta": {
    "topic": "addition",
    "difficulty": "easy-medium"
  },
  "createdAt": "2024-12-01T10:30:00Z"
}
```

#### `GET /api/exams/:id`
Get a specific exam.

**Response:**
```json
{
  "id": "uuid",
  "title": "...",
  "questions": ["..."],
  ...
}
```

#### `DELETE /api/exams/:id`
Delete an exam.

**Response:**
```json
{
  "success": true
}
```

---

### Progress & Attempts

#### `POST /api/students/:id/attempts`
Record a student attempt (game or exam).

**Request:**
```json
{
  "score": 9,
  "total": 10,
  "sourceType": "game",
  "examId": null,
  "context": {
    "month": "נובמבר",
    "weekIndex": 7,
    "topic": "addition"
  }
}
```

**Backend Logic:**
1. Save the attempt to `student_attempts` table
2. Calculate percentage: `percent = (score / total) * 100`
3. If percent >= 60:
   - Upsert `student_month_badges` for the given month
   - Update `best_score` if current score is higher

**Response:**
```json
{
  "attempt": {
    "id": "uuid",
    "studentId": "uuid",
    "score": 9,
    "total": 10,
    "sourceType": "game",
    "context": {
      "month": "נובמבר",
      "weekIndex": 7
    },
    "createdAt": "2024-12-01T11:00:00Z"
  },
  "badgeAwarded": {
    "month": "נובמבר",
    "bestScore": 90
  }
}
```

#### `GET /api/students/:id/progress`
Get student progress (badges and recent attempts).

**Response:**
```json
{
  "monthBadges": [
    {
      "month": "נובמבר",
      "bestScore": 90
    },
    {
      "month": "דצמבר",
      "bestScore": 85
    }
  ],
  "recentAttempts": [
    {
      "id": "uuid",
      "score": 9,
      "total": 10,
      "sourceType": "game",
      "createdAt": "2024-12-01T11:00:00Z"
    }
  ],
  "stats": {
    "totalAttempts": 25,
    "averageScore": 82
  }
}
```

---

## Frontend Integration

### API Client

Create a centralized API client for all backend communication:

**File:** `src/utils/apiClient.ts`

```typescript
// src/utils/apiClient.ts
import type { StudentRecord, AvatarType } from '../types/students';

const API_BASE = '/api';

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // For cookie-based auth
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  // Students
  getStudents: () => api<StudentRecord[]>('/students'),

  createStudent: (payload: {
    name: string;
    grade: string;
    yearLabel: string;
    avatar: AvatarType;
    color: string;
  }) => api<StudentRecord>('/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  updateStudent: (id: string, payload: Partial<{
    name: string;
    grade: string;
    avatar: AvatarType;
    color: string;
  }>) => api<StudentRecord>(`/students/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }),

  deleteStudent: (id: string) => api<{ success: boolean }>(`/students/${id}`, {
    method: 'DELETE',
  }),

  // Progress
  saveAttempt: (studentId: string, payload: {
    score: number;
    total: number;
    sourceType: 'game' | 'exam' | 'ad-hoc';
    examId?: string | null;
    context?: Record<string, any>;
  }) => api(`/students/${studentId}/attempts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  getProgress: (studentId: string) => api(`/students/${studentId}/progress`),

  // Exams
  getExams: () => api('/exams'),

  saveExam: (payload: {
    title: string;
    grade: string;
    subject: string;
    questions: string[];
    meta?: Record<string, any>;
  }) => api('/exams', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  deleteExam: (id: string) => api<{ success: boolean }>(`/exams/${id}`, {
    method: 'DELETE',
  }),
};
```

### Migration Strategy

**Phase 1: Dual Mode** (Current + Backend)
- Keep localStorage as fallback
- Add backend calls with try/catch
- If backend fails, use localStorage

**Phase 2: Backend Primary**
- Backend is primary data source
- localStorage cache only
- Sync on load/save

**Phase 3: Backend Only**
- Remove localStorage code
- Full cloud sync

**Example Migration in TeacherDashboard:**

```typescript
// In useEffect (init)
useEffect(() => {
  const initStudents = async () => {
    try {
      // Try to load from backend
      const backendStudents = await apiClient.getStudents();
      setStudents(backendStudents);
      if (backendStudents.length > 0) {
        setSelectedStudentId(backendStudents[0].profile.id);
      }
    } catch (error) {
      console.warn('Backend unavailable, using localStorage', error);
      // Fallback to localStorage
      const localStudents = loadStudentRecords();
      setStudents(localStudents);
      if (localStudents.length > 0) {
        setSelectedStudentId(localStudents[0].profile.id);
      }
    }
  };

  initStudents();
}, []);

// When adding a student
const handleAddStudent = async () => {
  if (!yearPlan || !newStudentName.trim()) return;

  try {
    // Try backend first
    const rec = await apiClient.createStudent({
      name: newStudentName.trim(),
      grade: 'א׳',
      yearLabel: yearPlan.yearLabel,
      avatar: newStudentAvatar,
      color: newStudentColor,
    });

    setStudents((prev) => [...prev, rec]);
    setSelectedStudentId(rec.profile.id);
    setNewStudentName('');
  } catch (error) {
    console.warn('Backend unavailable, saving to localStorage', error);
    // Fallback to localStorage
    const rec = createStudent(
      newStudentName.trim(),
      'א׳',
      yearPlan.yearLabel,
      newStudentAvatar,
      newStudentColor
    );
    setStudents((prev) => [...prev, rec]);
    setSelectedStudentId(rec.profile.id);
    setNewStudentName('');
    saveStudentRecords([...students, rec]);
  }
};
```

---

## Security Considerations

1. **Authentication:**
   - Use JWT with short expiry (15-30 mins)
   - Implement refresh tokens for extended sessions
   - Hash passwords with bcrypt/argon2

2. **Authorization:**
   - Always verify teacher_id matches authenticated user
   - Prevent cross-teacher data access

3. **Input Validation:**
   - Validate all inputs server-side
   - Sanitize user data before storage
   - Use parameterized queries (prevent SQL injection)

4. **Rate Limiting:**
   - Limit API calls per user/IP
   - Prevent abuse and DoS attacks

5. **CORS:**
   - Configure CORS properly for production domain
   - Don't allow wildcard origins in production

---

## Deployment Recommendations

### Option 1: Full Stack on Vercel/Railway
- Frontend: Vercel
- Backend: Railway/Render
- Database: Railway Postgres / Neon

### Option 2: Serverless
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: PlanetScale / Neon / Supabase

### Option 3: Traditional
- Frontend: Netlify/Vercel
- Backend: DigitalOcean/AWS EC2
- Database: AWS RDS / Managed Postgres

---

## Next Steps

1. ✅ Implement avatar + color UI (Done)
2. ✅ Create apiClient utility (Done)
3. 🔲 Set up backend project (Express/NestJS)
4. 🔲 Implement database schema
5. 🔲 Build API endpoints
6. 🔲 Add authentication/authorization
7. 🔲 Integrate frontend with backend
8. 🔲 Deploy to production

---

**Last Updated:** 2024-12-01
**Status:** Architecture documented, ready for implementation
