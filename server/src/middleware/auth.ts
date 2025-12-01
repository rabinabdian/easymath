import { Response, NextFunction } from 'express';
import { extractBearerToken, verifyAccessToken } from '../utils/jwt.js';
import type { AuthRequest, UserRole } from '../types/index.js';

/**
 * Middleware to verify JWT access token
 * Attaches user info to req.user if valid
 */
export function authRequired(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);

  if (!token) {
    res.status(401).json({ error: 'Missing authentication token' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
}

/**
 * Middleware to require specific role(s)
 * Must be used AFTER authRequired middleware
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `This endpoint requires one of: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
}

/**
 * Optional auth middleware
 * Attaches user if token is present, but doesn't require it
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Invalid token, but we don't fail - just continue without user
    }
  }

  next();
}
