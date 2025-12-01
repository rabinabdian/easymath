import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize database with schema
 */
async function initDatabase() {
  console.log('🔧 Initializing database...');

  try {
    // Read schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = await readFile(schemaPath, 'utf-8');

    // Execute schema
    await pool.query(schema);

    console.log('✅ Database initialized successfully');
    console.log('');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - refresh_tokens');
    console.log('  - students');
    console.log('  - exams');
    console.log('  - exam_questions');
    console.log('  - student_attempts');
    console.log('  - student_month_badges');
    console.log('');
    console.log('Demo users created:');
    console.log('  - teacher@example.com (password: password123)');
    console.log('  - admin@example.com (password: admin123)');
    console.log('');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
