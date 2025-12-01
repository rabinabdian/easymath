import { Router, Response } from 'express';
import { query } from '../db/connection.js';
import { authRequired } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';
import type {
  AuthRequest,
  Student,
  StudentRecord,
  StudentProfile,
  CreateStudentRequest,
  UpdateStudentRequest,
  MonthBadge,
} from '../types/index.js';

const router = Router();

// All routes require authentication
router.use(authRequired);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert DB student to StudentProfile
 */
function toStudentProfile(student: Student): StudentProfile {
  return {
    id: student.id,
    name: student.name,
    grade: student.grade,
    yearLabel: student.year_label,
    avatar: student.avatar,
    color: student.color,
  };
}

/**
 * Get student badges
 */
async function getStudentBadges(studentId: string): Promise<MonthBadge[]> {
  const badgesResult = await query(
    `SELECT month, best_score, updated_at
     FROM student_month_badges
     WHERE student_id = $1
     ORDER BY updated_at DESC`,
    [studentId]
  );

  return badgesResult.rows.map((row) => ({
    month: row.month,
    bestScore: row.best_score,
    earnedAt: row.updated_at.toISOString(),
  }));
}

/**
 * Build StudentRecord from student and badges
 */
async function buildStudentRecord(student: Student): Promise<StudentRecord> {
  const badges = await getStudentBadges(student.id);

  return {
    profile: toStudentProfile(student),
    progress: {
      monthBadges: badges,
    },
  };
}

// ============================================
// GET /students
// ============================================

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;

    const studentsResult = await query<Student>(
      `SELECT * FROM students WHERE teacher_id = $1 ORDER BY created_at DESC`,
      [teacherId]
    );

    const students = studentsResult.rows;

    // Build student records with badges
    const records = await Promise.all(
      students.map((s) => buildStudentRecord(s))
    );

    res.json(records);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ============================================
// POST /students
// ============================================

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const { name, grade, yearLabel, avatar, color } =
      req.body as CreateStudentRequest;

    // Validate input
    if (!name || !grade || !yearLabel || !avatar || !color) {
      throw new ApiError(
        400,
        'name, grade, yearLabel, avatar, and color are required'
      );
    }

    // Create student
    const studentResult = await query<Student>(
      `INSERT INTO students (teacher_id, name, grade, year_label, avatar, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [teacherId, name, grade, yearLabel, avatar, color]
    );

    const student = studentResult.rows[0];
    const record = await buildStudentRecord(student);

    res.status(201).json(record);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Create student error:', err);
      res.status(500).json({ error: 'Failed to create student' });
    }
  }
});

// ============================================
// GET /students/:id
// ============================================

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const studentId = req.params.id;

    const studentResult = await query<Student>(
      `SELECT * FROM students WHERE id = $1 AND teacher_id = $2`,
      [studentId, teacherId]
    );

    if (studentResult.rows.length === 0) {
      throw new ApiError(404, 'Student not found');
    }

    const student = studentResult.rows[0];
    const record = await buildStudentRecord(student);

    res.json(record);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Get student error:', err);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  }
});

// ============================================
// PATCH /students/:id
// ============================================

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const studentId = req.params.id;
    const updates = req.body as UpdateStudentRequest;

    // Check if student exists and belongs to teacher
    const checkResult = await query<Student>(
      `SELECT * FROM students WHERE id = $1 AND teacher_id = $2`,
      [studentId, teacherId]
    );

    if (checkResult.rows.length === 0) {
      throw new ApiError(404, 'Student not found');
    }

    // Build update query dynamically
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.grade !== undefined) {
      fields.push(`grade = $${paramIndex++}`);
      values.push(updates.grade);
    }
    if (updates.avatar !== undefined) {
      fields.push(`avatar = $${paramIndex++}`);
      values.push(updates.avatar);
    }
    if (updates.color !== undefined) {
      fields.push(`color = $${paramIndex++}`);
      values.push(updates.color);
    }

    if (fields.length === 0) {
      throw new ApiError(400, 'No fields to update');
    }

    values.push(studentId, teacherId);

    const updateResult = await query<Student>(
      `UPDATE students
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex++} AND teacher_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    const student = updateResult.rows[0];
    const record = await buildStudentRecord(student);

    res.json(record);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Update student error:', err);
      res.status(500).json({ error: 'Failed to update student' });
    }
  }
});

// ============================================
// DELETE /students/:id
// ============================================

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user!.sub;
    const studentId = req.params.id;

    const deleteResult = await query(
      `DELETE FROM students WHERE id = $1 AND teacher_id = $2`,
      [studentId, teacherId]
    );

    if (deleteResult.rowCount === 0) {
      throw new ApiError(404, 'Student not found');
    }

    res.status(204).send();
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Delete student error:', err);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }
});

export default router;
