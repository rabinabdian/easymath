import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateJti,
  getRefreshTokenExpiry,
  extractRefreshToken,
} from '../utils/jwt.js';
import { ApiError } from '../middleware/errorHandler.js';
import type {
  User,
  UserPublic,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshResponse,
} from '../types/index.js';

const router = Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert DB user to public user (without password hash)
 */
function toPublicUser(user: User): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/**
 * Set refresh token cookie
 */
function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

/**
 * Clear refresh token cookie
 */
function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

// ============================================
// POST /auth/register
// ============================================

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as RegisterRequest;

    // Validate input
    if (!email || !password || !name) {
      throw new ApiError(400, 'Email, password, and name are required');
    }

    // Check if user already exists
    const existingResult = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingResult.rows.length > 0) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await query<User>(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email.toLowerCase(), passwordHash, name, 'TEACHER']
    );

    const user = userResult.rows[0];

    // Generate tokens
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const jti = generateJti();
    const refreshToken = signRefreshToken(user.id, jti);
    const refreshTokenHash = hashToken(refreshToken);

    // Store refresh token in DB
    await query(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        jti,
        user.id,
        refreshTokenHash,
        req.get('user-agent'),
        req.ip,
        getRefreshTokenExpiry(),
      ]
    );

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return access token and user info
    const response: AuthResponse = {
      accessToken,
      user: toPublicUser(user),
    };

    res.status(201).json(response);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// ============================================
// POST /auth/login
// ============================================

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user
    const userResult = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const user = userResult.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const jti = generateJti();
    const refreshToken = signRefreshToken(user.id, jti);
    const refreshTokenHash = hashToken(refreshToken);

    // Store refresh token in DB
    await query(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        jti,
        user.id,
        refreshTokenHash,
        req.get('user-agent'),
        req.ip,
        getRefreshTokenExpiry(),
      ]
    );

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return access token and user info
    const response: AuthResponse = {
      accessToken,
      user: toPublicUser(user),
    };

    res.json(response);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
});

// ============================================
// POST /auth/refresh
// ============================================

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = extractRefreshToken(req.cookies);

    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token provided');
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const { sub: userId, jti } = payload;
    const tokenHash = hashToken(refreshToken);

    // Check if token exists in DB and is not revoked
    const tokenResult = await query(
      `SELECT * FROM refresh_tokens
       WHERE id = $1 AND user_id = $2 AND token_hash = $3 AND revoked_at IS NULL`,
      [jti, userId, tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      throw new ApiError(401, 'Refresh token not found or revoked');
    }

    const storedToken = tokenResult.rows[0];

    // Check if token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
      throw new ApiError(401, 'Refresh token expired');
    }

    // Get user info
    const userResult = await query<User>(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError(401, 'User not found');
    }

    const user = userResult.rows[0];

    // Revoke old refresh token (rotation)
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1',
      [jti]
    );

    // Generate new tokens
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const newJti = generateJti();
    const newRefreshToken = signRefreshToken(user.id, newJti);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    // Store new refresh token in DB
    await query(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        newJti,
        user.id,
        newRefreshTokenHash,
        req.get('user-agent'),
        req.ip,
        getRefreshTokenExpiry(),
      ]
    );

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    // Return new access token
    const response: RefreshResponse = {
      accessToken,
    };

    res.json(response);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Refresh error:', err);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }
});

// ============================================
// POST /auth/logout
// ============================================

router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = extractRefreshToken(req.cookies);

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        const { jti } = payload;

        // Revoke the refresh token
        await query(
          'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1',
          [jti]
        );
      } catch {
        // Token invalid, but we still clear the cookie
      }
    }

    // Clear refresh token cookie
    clearRefreshTokenCookie(res);

    res.status(204).send();
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ============================================
// POST /auth/logout-all
// ============================================

router.post('/logout-all', async (req: Request, res: Response) => {
  try {
    const refreshToken = extractRefreshToken(req.cookies);

    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token provided');
    }

    const payload = verifyRefreshToken(refreshToken);
    const { sub: userId } = payload;

    // Revoke all refresh tokens for this user
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    );

    // Clear refresh token cookie
    clearRefreshTokenCookie(res);

    res.status(204).send();
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      console.error('Logout-all error:', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
});

export default router;
