// src/utils/avatar.ts
import type { AvatarType } from '../types/students';

/**
 * Maps avatar type to emoji representation
 */
export function avatarEmoji(type: AvatarType): string {
  switch (type) {
    case 'boy':
      return '👦';
    case 'girl':
      return '👧';
    case 'robot':
      return '🤖';
    case 'star':
      return '⭐';
    default:
      return '🙂';
  }
}
