import type { Member } from "../types";

interface AvatarProps {
  member?: Member;
  name?: string;
  color?: string;
  size?: number;
  showEmoji?: boolean;
}

export default function Avatar({
  member,
  name,
  color,
  size = 40,
  showEmoji = true,
}: AvatarProps) {
  const bg = member?.color ?? color ?? "#8b5cf6";
  const label = member?.name ?? name ?? "?";
  const names = label.trim().split(/\s+/);
  const initials = names.length > 1 ? `${names[0][0]}${names[1][0]}` : label.slice(0, 2);
  const content = showEmoji && member?.emoji ? member.emoji : initials.toUpperCase();

  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: Math.max(11, size * 0.34),
      }}
    >
      {content}
    </span>
  );
}
