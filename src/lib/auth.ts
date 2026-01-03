/**
 * Authentication Utilities
 * Handles password hashing, JWT tokens, and auth helpers
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

/**
 * Hash password (using bcrypt approach)
 * Note: In production, use bcryptjs library
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Placeholder - implement with bcryptjs in production
  // For now: return base64 encoded (NOT SECURE - for demo only)
  return Buffer.from(password).toString('base64');
};

/**
 * Verify password
 * Note: In production, use bcryptjs library
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // Placeholder - implement with bcryptjs in production
  const decodedHash = Buffer.from(hash, 'base64').toString('utf-8');
  return password === decodedHash;
};

/**
 * Generate JWT Token
 */
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify JWT Token
 */
export const verifyToken = (
  token: string
): { userId: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Generate email verification token
 */
export const generateVerificationToken = (): {
  token: string;
  expiresAt: Date;
} => {
  const token = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expiresAt };
};

/**
 * Generate password reset token
 */
export const generateResetToken = (): {
  token: string;
  expiresAt: Date;
} => {
  const token = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expiresAt };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 */
export const isStrongPassword = (password: string): {
  isStrong: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = (role: string): boolean => {
  return role === 'ADMIN';
};

/**
 * Check if user is employee
 */
export const isEmployee = (role: string): boolean => {
  return role === 'EMPLOYEE';
};

/**
 * Get authorization header from request
 */
export const getAuthToken = (
  authHeader?: string
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
};
