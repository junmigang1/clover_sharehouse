import type { ReactNode } from "react";
import Icon from "./Icon";
import { useNavigation, type TabKey } from "../hooks/useNavigation";
import { house, me } from "../data/members";
import Avatar from "./Avatar";

export type ViewMode = "web" | "app";

const DESKTOP_NAV: { key: TabKey; label: string; desc: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { key: "home", label: "홈", desc: "운영 현황", icon: "home" },
  { key: "community", label: "커뮤니티", desc: "소통과 투표", icon: "community" },
  { key: "marketplace", label: "마켓", desc: "근처 하우스 거래", icon: "market" },
  { key: "ai", label: "AI 도우미", desc: "공지와 말투 변환", icon: "ai" },
  { key: "my", label: "MY", desc: "내 정보", icon: "user" },
];

export function MobileFrame({
  children,
  mode,
  onModeChange,
}: {
  children: ReactNode;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className={`frame-stage frame-stage--${mode}`}>
      <div className="frame">
        <DesktopSidebar mode={mode} onModeChange={onModeChange} />
        <ModeSwitch mode={mode} onModeChange={onModeChange} />
        <div className="app-content">
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({
  mode,
  onModeChange,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}) {
  const { activeTab, switchTab } = useNavigation();
  return (
    <aside className="desktop-sidebar" aria-label="주요 메뉴">
      <div className="desktop-brand">
        <div className="desktop-brand__mark">N</div>
        <div>
          <div className="desktop-brand__title">NestHub</div>
          <div className="desktop-brand__sub">{house.name}</div>
        </div>
      </div>

      <div className="version-toggle version-toggle--sidebar" aria-label="버전 선택">
        <button className={mode === "web" ? "version-toggle__item version-toggle__item--active" : "version-toggle__item"} onClick={() => onModeChange("web")}>
          웹 버전
        </button>
        <button className={mode === "app" ? "version-toggle__item version-toggle__item--active" : "version-toggle__item"} onClick={() => onModeChange("app")}>
          앱 버전
        </button>
      </div>

      <nav className="desktop-nav">
        {DESKTOP_NAV.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              className={`desktop-nav__item${active ? " desktop-nav__item--active" : ""}`}
              onClick={() => switchTab(item.key)}
            >
              <span className="desktop-nav__icon">
                <Icon name={item.icon} size={20} />
              </span>
              <span>
                <span className="desktop-nav__label">{item.label}</span>
                <span className="desktop-nav__desc">{item.desc}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="desktop-profile">
        <Avatar member={me} size={40} />
        <div>
          <div className="desktop-profile__name">유빈님</div>
          <div className="desktop-profile__sub">{me.room}</div>
        </div>
      </div>
    </aside>
  );
}

function ModeSwitch({
  mode,
  onModeChange,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="version-toggle version-toggle--floating" aria-label="버전 선택">
      <button className={mode === "web" ? "version-toggle__item version-toggle__item--active" : "version-toggle__item"} onClick={() => onModeChange("web")}>
        웹
      </button>
      <button className={mode === "app" ? "version-toggle__item version-toggle__item--active" : "version-toggle__item"} onClick={() => onModeChange("app")}>
        앱
      </button>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="statusbar__icons" aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M1 4.2a11 11 0 0 1 14 0" />
          <path d="M3.5 6.8a7 7 0 0 1 9 0" />
          <path d="M6 9.3a3 3 0 0 1 4 0" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="1" width="22" height="11" rx="3" stroke="currentColor" strokeOpacity="0.38" />
          <rect x="2" y="2.5" width="17" height="8" rx="1.6" fill="currentColor" />
          <rect x="24" y="4.5" width="2" height="4" rx="1" fill="currentColor" fillOpacity="0.38" />
        </svg>
      </div>
    </div>
  );
}

export function TopBar({
  title,
  sub,
  action,
  onAction,
  actionIcon,
  showBack,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
  actionIcon?: Parameters<typeof Icon>[0]["name"];
  showBack?: boolean;
}) {
  const { goBack, canGoBack } = useNavigation();
  const back = showBack ?? canGoBack;
  return (
    <div className="topbar">
      {back && (
        <button className="topbar__back" onClick={goBack} aria-label="뒤로 가기">
          <Icon name="chevron-left" size={24} />
        </button>
      )}
      <div className="topbar__copy">
        <div className="topbar__title">{title}</div>
        {sub && <div className="topbar__sub">{sub}</div>}
      </div>
      <div className="topbar__spacer" />
      {(action || actionIcon) && (
        <button className="topbar__action" onClick={onAction} aria-label={action ?? title}>
          {actionIcon && <Icon name={actionIcon} size={20} />}
          {action}
        </button>
      )}
    </div>
  );
}

export function Screen({
  children,
  flush = false,
}: {
  children: ReactNode;
  flush?: boolean;
}) {
  return <main className={`screen${flush ? " screen--flush" : ""}`}>{children}</main>;
}
