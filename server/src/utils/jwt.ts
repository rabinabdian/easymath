import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { AccessTokenPayload, RefreshTokenPayload } from '../types/index.js';

// ============================================
// CONFIGURATION
// ============================================

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// ============================================
// ACCESS TOKEN FUNCTIONS
// ============================================

/**
 * Sign an access token
 */
export function signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Verify an access token
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
}

// ============================================
// REFRESH TOKEN FUNCTIONS
// ============================================

/**
 * Sign a refresh token
 */
export function signRefreshToken(
  userId: string,
  jti: string
): string {
  const payload: Omit<RefreshTokenPayload, 'iat' | 'exp'> = {
    sub: userId,
    type: 'refresh',
    jti,
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify a refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return payload;
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Get expiration date for refresh token
 */
export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days from now
  return expiry;
}

// ============================================
// HASHING UTILITIES
// ============================================

/**
 * Hash a refresh token for storage in database
 * Uses SHA-256 hash to prevent token theft if DB is compromised
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a random JTI (JWT ID) for refresh token
 */
export function generateJti(): string {
  return crypto.randomUUID();
}

// ============================================
// TOKEN EXTRACTION
// ============================================

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Extract refresh token from cookie
 */
export function extractRefreshToken(cookies: Record<string, string>): string | null {
  return cookies.refreshToken || null;
}
