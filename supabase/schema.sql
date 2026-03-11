-- EasyMath Database Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New Query

-- ============================================================
-- TABLES
-- ============================================================

-- Students table (owned by the authenticated teacher)
create table if not exists public.students (
  id          text        primary key,
  teacher_id  uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  grade       text        not null,
  year_label  text        not null,
  avatar      text        not null default 'boy',
  color       text        not null default '#3b82f6',
  photo_url   text,
  created_at  timestamptz not null default now()
);

-- Exams table (owned by the authenticated teacher)
create table if not exists public.exams (
  id          text        primary key,
  teacher_id  uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  questions   jsonb       not null default '[]',
  created_at  timestamptz not null default now()
);

-- Attempts table (linked to a student, cascades on student delete)
create table if not exists public.attempts (
  id          text        primary key,
  student_id  text        not null references public.students(id) on delete cascade,
  score       numeric     not null,
  total       numeric     not null,
  percent     numeric     not null,
  month       text,
  week_index  integer,
  timestamp   timestamptz not null
);

-- Badges table (one badge per month per student)
create table if not exists public.badges (
  id          uuid        primary key default gen_random_uuid(),
  student_id  text        not null references public.students(id) on delete cascade,
  month       text        not null,
  best_score  numeric     not null,
  earned_at   timestamptz not null,
  unique (student_id, month)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Each teacher sees only their own data
-- ============================================================

alter table public.students enable row level security;
alter table public.exams    enable row level security;
alter table public.attempts enable row level security;
alter table public.badges   enable row level security;

-- Students: teacher owns the rows
create policy "teacher_manage_students" on public.students
  for all using (auth.uid() = teacher_id);

-- Exams: teacher owns the rows
create policy "teacher_manage_exams" on public.exams
  for all using (auth.uid() = teacher_id);

-- Attempts: accessible via student ownership
create policy "teacher_manage_attempts" on public.attempts
  for all using (
    exists (
      select 1 from public.students s
      where s.id = attempts.student_id
        and s.teacher_id = auth.uid()
    )
  );

-- Badges: accessible via student ownership
create policy "teacher_manage_badges" on public.badges
  for all using (
    exists (
      select 1 from public.students s
      where s.id = badges.student_id
        and s.teacher_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES (for query performance)
-- ============================================================

create index if not exists idx_students_teacher  on public.students(teacher_id);
create index if not exists idx_exams_teacher     on public.exams(teacher_id);
create index if not exists idx_attempts_student  on public.attempts(student_id);
create index if not exists idx_badges_student    on public.badges(student_id);
