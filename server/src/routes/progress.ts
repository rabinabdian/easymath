import { Router, Response } from 'express';
import { query, getClient } from '../db/connection.js';
import { authRequired } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';
import type {
  AuthRequest,
  StudentAttempt,
  CreateAttemptRequest,
  AttemptResponse,
  ProgressResponse,
  MonthBadge,
} from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authRequired);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify student belongs to teacher
 */
async function verifyStudentOwnership(
  studentId: string,
  teacherId: string
): Promise<boolean> {
  const result = await query(
    `SELECT id FROM students WHERE id = $1 AND teacher_id = $2`,
    [studentId, teacherId]
  );

  return result.rows.length > 0;
}

/**
 * Upsert month badge if score is high enough
 */
async function upsertMonthBadge(
  client: any,
  studentId: string,
  yearLabel: string,
  month: string,
  scorePercent: number
): Promise<MonthBadge | null> {
  if (scorePercent < 60) {
    return null; // No badge if score is below 60%
  }

  const badgeResult = await client.query(
    `INSERT INTO student_month_badges (student_id, year_label, month, best_score)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (student_id, year_label, month)
     DO UPDATE SET best_score = GREATEST(student_month_badges.best_score, $4),
                   updated_at = NOW()
     RETURNING month, best_score, updated_at`,
    [studentId, yearLabel, month, Math.round(scorePercent)]
  );

  const badge = badgeResult.rows[0];

  return {
    month: badge.month,
    bestScore: badge.best_score,
    earnedAt: badge.updated_at.toISOString(),
  };
}

// ============================================
// POST /students/:id/attempts
// ============================================

router.post('/:id/attempts', async (req: AuthRequest, res: Response) => {
  const client = await getClient();

  try {
    const teacherId = req.user!.sub;
    const studentId = req.params.id;
    const { score, total, sourceType, examId, context } =
      req.body as CreateAttemptRequest;

    // Validate input
    if (
      score === undefined ||
      total === undefined ||
      !sourceType ||
      score < 0 ||
      total <= 0 ||
      score > total
    ) {
      throw new ApiError(400, 'Invalid attempt data');
    }

    // Verify student belongs to teacher
    const ownsStudent = await verifyStudentOwnership(studentId, teacherId);
    if (!ownsStudent) {
      throw new ApiError(404, 'Student not found');
    }

    await client.query('BEGIN');

    // Save attempt
    const attemptResult = await client.query<StudentAttempt>(
      `INSERT INTO student_attempts (student_id, exam_id, source_type, score, total, context_json)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        studentId,
        examId || null,
        sourceType,
        score,
        total,
        context ? JSON.stringify(context) : null,
      ]
    );

    const attempt = attemptResult.rows[0];

    // Calculate score percentage
    const scorePercent = (score / total) * 100;

    // Upsert badge if context has month and year
    let badge: MonthBadge | null = null;
    if (context?.month && context?.yearLabel) {
      badge = await upsertMonthBadge(
        client,
        studentId,
        context.yearLabel,
        context.month,
        scorePercent
      );
    }

    await client.query('COMMIT');

    const response: AttemptResponse = {
      attempt: {
        id: attempt.id,
        score: attempt.score,
        total: attempt.total,
        sourceType: attempt.source_type,
        createdAt: attempt.created_at.toISOString(),
      },
      ...(badge && { badgeAwarded: badge }),
    };

    res.status(201).json(response);
  } catch (err) {
    await client.query('ROLLBACK');

    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Create attempt error:', err);
      res.status(500).json({ error: 'Failed to record attempt' });
    }
  } finally {
    client.release();
  }
});

// ============================================
// GET /students/:id/progress
// ============================================

router.get('/:id/progress', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const studentId = req.params.id;

    // Verify student belongs to teacher
    const ownsStudent = await verifyStudentOwnership(studentId, teacherId);
    if (!ownsStudent) {
      throw new ApiError(404, 'Student not found');
    }

    // Get month badges
    const badgesResult = await query(
      `SELECT month, best_score, updated_at
       FROM student_month_badges
       WHERE student_id = $1
       ORDER BY updated_at DESC`,
      [studentId]
    );

    const monthBadges: MonthBadge[] = badgesResult.rows.map((row) => ({
      month: row.month,
      bestScore: row.best_score,
      earnedAt: row.updated_at.toISOString(),
    }));

    // Get recent attempts
    const attemptsResult = await query<StudentAttempt>(
      `SELECT * FROM student_attempts
       WHERE student_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [studentId]
    );

    const recentAttempts = attemptsResult.rows.map((a) => ({
      id: a.id,
      score: a.score,
      total: a.total,
      sourceType: a.source_type,
      createdAt: a.created_at.toISOString(),
    }));

    // Calculate stats
    const statsResult = await query(
      `SELECT COUNT(*) as total_attempts,
              AVG(CAST(score AS FLOAT) / CAST(total AS FLOAT) * 100) as avg_score
       FROM student_attempts
       WHERE student_id = $1`,
      [studentId]
    );

    const stats = {
      totalAttempts: parseInt(statsResult.rows[0].total_attempts) || 0,
      averageScore: Math.round(statsResult.rows[0].avg_score || 0),
    };

    const response: ProgressResponse = {
      monthBadges,
      recentAttempts,
      stats,
    };

    res.json(response);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Get progress error:', err);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }
});

export default router;
