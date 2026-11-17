import React from 'react';

export interface AvatarEmojiOption {
  emoji: string;
  label: string;
  bgGradient: string;
}

export const AVATAR_EMOJI_OPTIONS: AvatarEmojiOption[] = [
  { emoji: '👨‍💻', label: 'Systems Coder', bgGradient: 'from-indigo-600 to-violet-600' },
  { emoji: '👩‍💻', label: 'Tech Lead', bgGradient: 'from-violet-600 to-purple-600' },
  { emoji: '🚀', label: 'Rocket Builder', bgGradient: 'from-blue-600 to-cyan-600' },
  { emoji: '⚡', label: 'Algorithmic Ace', bgGradient: 'from-amber-500 to-orange-600' },
  { emoji: '🦊', label: 'Clever Fox', bgGradient: 'from-orange-500 to-rose-600' },
  { emoji: '🦉', label: 'Night Owl', bgGradient: 'from-slate-700 to-slate-900' },
  { emoji: '🤖', label: 'AI Architect', bgGradient: 'from-cyan-600 to-blue-700' },
  { emoji: '🦾', label: 'Cyber Engineer', bgGradient: 'from-emerald-600 to-teal-700' },
  { emoji: '🎓', label: 'Campus Scholar', bgGradient: 'from-indigo-700 to-blue-800' },
  { emoji: '🔥', label: 'Streak Master', bgGradient: 'from-rose-600 to-orange-600' },
  { emoji: '🧠', label: 'Graph Thinker', bgGradient: 'from-fuchsia-600 to-pink-600' },
  { emoji: '🛡️', label: 'Security Pro', bgGradient: 'from-teal-600 to-emerald-700' },
];

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
  isVerified?: boolean;
}

function getDefaultAvatarOption(name: string): AvatarEmojiOption {
  const lower = (name || '').toLowerCase();
  if (lower.includes('shishir')) return AVATAR_EMOJI_OPTIONS[0]; // 👨‍💻
  if (lower.includes('shreya') || lower.includes('ananya') || lower.includes('priya')) {
    return AVATAR_EMOJI_OPTIONS[1]; // 👩‍💻
  }
  if (lower.includes('shiwansh')) return AVATAR_EMOJI_OPTIONS[2]; // 🚀
  if (lower.includes('simran')) return AVATAR_EMOJI_OPTIONS[8]; // 🎓

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_EMOJI_OPTIONS.length;
  return AVATAR_EMOJI_OPTIONS[index];
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = '',
  showBadge = false,
  isVerified = false,
}) => {
  const matchedOption = avatar
    ? AVATAR_EMOJI_OPTIONS.find((o) => o.emoji === avatar)
    : undefined;
  const fallbackOption = getDefaultAvatarOption(name || 'User');

  // Use custom emoji if provided (ignoring legacy http URLs), otherwise fallback emoji
  const displayEmoji =
    avatar && !avatar.startsWith('http') && avatar.trim().length > 0
      ? avatar.trim()
      : fallbackOption.emoji;
  const gradient = matchedOption ? matchedOption.bgGradient : fallbackOption.bgGradient;

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs rounded-md',
    sm: 'w-8 h-8 text-base rounded-lg',
    md: 'w-10 h-10 text-lg rounded-xl',
    lg: 'w-12 h-12 text-2xl rounded-xl',
    xl: 'w-16 h-16 text-3xl rounded-2xl',
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`bg-gradient-to-tr ${gradient} text-white flex items-center justify-center select-none shadow-xs border border-white/20 ${sizeClasses[size]} ${className}`}
        aria-label={name}
        title={name}
      >
        <span className="leading-none">{displayEmoji}</span>
      </div>
      {showBadge && isVerified && (
        <span
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold shadow-2xs"
          title="Verified C++ Developer"
        >
          ✓
        </span>
      )}
    </div>
  );
};
