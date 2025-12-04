/**
 * Validation Utilities
 *
 * Input validation and sanitization functions.
 */

import { WriteupCategory } from '@/types/writeup';
import { UserRole } from '@/types/user';
import { ChatChannel } from '@/types/chat';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate writeup category
 */
export function isValidWriteupCategory(category: string): category is WriteupCategory {
  const validCategories: WriteupCategory[] = [
    'Web',
    'Crypto',
    'Pwn',
    'Reverse Engineering',
    'Forensics',
    'Misc',
    'Steganography',
    'OSINT',
    'Mobile',
    'Hardware',
    'Blockchain',
  ];

  return validCategories.includes(category as WriteupCategory);
}

/**
 * Validate user role
 */
export function isValidUserRole(role: string): role is UserRole {
  return ['member', 'admin', 'founder'].includes(role);
}

/**
 * Validate chat channel
 */
export function isValidChatChannel(channel: string): channel is ChatChannel {
  return ['general', 'ops', 'intel', 'ai-lab'].includes(channel);
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize markdown content (basic sanitization)
 */
export function sanitizeMarkdown(content: string): string {
  // Basic sanitization - remove script tags and dangerous patterns
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .trim();
}

/**
 * Validate Discord ID format
 */
export function isValidDiscordId(discordId: string): boolean {
  // Discord IDs are 17-19 digit snowflakes
  const discordIdRegex = /^\d{17,19}$/;
  return discordIdRegex.test(discordId);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate invite token format (alphanumeric, 32 chars)
 */
export function isValidInviteToken(token: string): boolean {
  const tokenRegex = /^[a-zA-Z0-9]{32}$/;
  return tokenRegex.test(token);
}

/**
 * Validate username (alphanumeric, underscores, hyphens, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 *
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
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
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate random invite token
 */
export function generateInviteToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}
