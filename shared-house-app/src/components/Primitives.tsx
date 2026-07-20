import type { ReactNode, CSSProperties } from "react";
import Icon from "./Icon";

/* ---------- Card ---------- */
export function Card({
  children,
  onClick,
  pad = true,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  pad?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`card${pad ? " card--pad" : ""}${onClick ? " pressable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={style}
    >
      {children}
    </div>
  );
}

/* ---------- SectionHeader ---------- */
export function SectionHeader({
  title,
  more,
  onMore,
}: {
  title: string;
  more?: string;
  onMore?: () => void;
}) {
  return (
    <div className="section-head">
      <span className="section-head__title">{title}</span>
      {more && (
        <span className="section-head__more" onClick={onMore}>
          {more}
        </span>
      )}
    </div>
  );
}

/* ---------- Tag ---------- */
export function Tag({
  children,
  variant = "gray",
}: {
  children: ReactNode;
  variant?: "green" | "amber" | "coral" | "violet" | "gray";
}) {
  return <span className={`tag tag--${variant}`}>{children}</span>;
}

/* ---------- Button ---------- */
export function Button({
  children,
  onClick,
  variant = "primary",
  block = false,
  sm = false,
  icon,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "soft" | "neutral" | "ghost";
  block?: boolean;
  sm?: boolean;
  icon?: Parameters<typeof Icon>[0]["name"];
  style?: CSSProperties;
}) {
  return (
    <button
      className={`btn btn--${variant}${block ? " btn--block" : ""}${
        sm ? " btn--sm" : ""
      }`}
      onClick={onClick}
      style={style}
    >
      {icon && <Icon name={icon} size={sm ? 16 : 19} />}
      {children}
    </button>
  );
}

/* ---------- ListRow ---------- */
export function ListRow({
  leading,
  title,
  sub,
  trailing,
  onClick,
  chevron,
}: {
  leading?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  chevron?: boolean;
}) {
  return (
    <div
      className={`row${onClick ? " pressable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {leading}
      <div className="row__body">
        <div className="row__title ellipsis">{title}</div>
        {sub && <div className="row__sub ellipsis">{sub}</div>}
      </div>
      {trailing}
      {chevron && (
        <span className="row__chev">
          <Icon name="chevron-right" size={18} />
        </span>
      )}
    </div>
  );
}
