import { Router, Response } from 'express';
import { query, getClient } from '../db/connection.js';
import { authRequired } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';
import type {
  AuthRequest,
  Exam,
  ExamWithQuestions,
  CreateExamRequest,
} from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authRequired);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get exam questions
 */
async function getExamQuestions(examId: string): Promise<string[]> {
  const result = await query(
    `SELECT question_id FROM exam_questions
     WHERE exam_id = $1
     ORDER BY order_index ASC`,
    [examId]
  );

  return result.rows.map((row) => row.question_id);
}

/**
 * Build ExamWithQuestions from Exam
 */
async function buildExamWithQuestions(
  exam: Exam
): Promise<ExamWithQuestions> {
  const questions = await getExamQuestions(exam.id);

  return {
    ...exam,
    questions,
  };
}

// ============================================
// GET /exams
// ============================================

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;

    const examsResult = await query<Exam>(
      `SELECT * FROM exams WHERE teacher_id = $1 ORDER BY created_at DESC`,
      [teacherId]
    );

    const exams = examsResult.rows;

    // Build exams with questions
    const examsWithQuestions = await Promise.all(
      exams.map((e) => buildExamWithQuestions(e))
    );

    res.json(examsWithQuestions);
  } catch (err) {
    console.error('Get exams error:', err);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// ============================================
// POST /exams
// ============================================

router.post('/', async (req: AuthRequest, res: Response) => {
  const client = await getClient();

  try {
    const teacherId = req.user!.sub;
    const { title, grade, subject, questions, meta } =
      req.body as CreateExamRequest;

    // Validate input
    if (!title || !grade || !subject || !questions || questions.length === 0) {
      throw new ApiError(
        400,
        'title, grade, subject, and questions are required'
      );
    }

    await client.query('BEGIN');

    // Create exam
    const examResult = await client.query<Exam>(
      `INSERT INTO exams (teacher_id, title, grade, subject, meta_json)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [teacherId, title, grade, subject, meta ? JSON.stringify(meta) : null]
    );

    const exam = examResult.rows[0];

    // Insert questions
    for (let i = 0; i < questions.length; i++) {
      await client.query(
        `INSERT INTO exam_questions (exam_id, question_id, order_index)
         VALUES ($1, $2, $3)`,
        [exam.id, questions[i], i]
      );
    }

    await client.query('COMMIT');

    const examWithQuestions = await buildExamWithQuestions(exam);

    res.status(201).json(examWithQuestions);
  } catch (err) {
    await client.query('ROLLBACK');

    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Create exam error:', err);
      res.status(500).json({ error: 'Failed to create exam' });
    }
  } finally {
    client.release();
  }
});

// ============================================
// GET /exams/:id
// ============================================

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const examId = req.params.id;

    const examResult = await query<Exam>(
      `SELECT * FROM exams WHERE id = $1 AND teacher_id = $2`,
      [examId, teacherId]
    );

    if (examResult.rows.length === 0) {
      throw new ApiError(404, 'Exam not found');
    }

    const exam = examResult.rows[0];
    const examWithQuestions = await buildExamWithQuestions(exam);

    res.json(examWithQuestions);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Get exam error:', err);
      res.status(500).json({ error: 'Failed to fetch exam' });
    }
  }
});

// ============================================
// DELETE /exams/:id
// ============================================

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const examId = req.params.id;

    const deleteResult = await query(
      `DELETE FROM exams WHERE id = $1 AND teacher_id = $2`,
      [examId, teacherId]
    );

    if (deleteResult.rowCount === 0) {
      throw new ApiError(404, 'Exam not found');
    }

    res.status(204).send();
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Delete exam error:', err);
      res.status(500).json({ error: 'Failed to delete exam' });
    }
  }
});

export default router;
