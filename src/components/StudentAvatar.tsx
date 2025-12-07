// src/components/StudentAvatar.tsx
import type { AvatarType } from '../types/students';
import { avatarEmoji } from '../utils/avatar';

interface StudentAvatarProps {
  photoUrl?: string;
  avatar?: AvatarType;
  color?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * StudentAvatar - Displays student's photo or avatar emoji
 *
 * Features:
 * - Shows student photo if available (photoUrl)
 * - Falls back to avatar emoji if no photo
 * - Supports multiple sizes
 * - Shows student name on hover
 */
export function StudentAvatar({
  photoUrl,
  avatar = 'boy',
  color = '#3b82f6',
  name = 'תלמיד',
  size = 'small',
  className = ''
}: StudentAvatarProps) {
  const sizeClasses = {
    small: 'w-10 h-10 text-xl',
    medium: 'w-16 h-16 text-3xl',
    large: 'w-24 h-24 text-5xl'
  };

  const containerSize = sizeClasses[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white shadow-sm border-2 overflow-hidden ${containerSize} ${className}`}
      style={{ borderColor: color }}
      title={name}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show avatar emoji instead
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const emoji = document.createElement('span');
              emoji.textContent = avatarEmoji(avatar);
              emoji.className = 'select-none';
              parent.appendChild(emoji);
            }
          }}
        />
      ) : (
        <span className="select-none">{avatarEmoji(avatar)}</span>
      )}
    </div>
  );
}
