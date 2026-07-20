import Icon from "./Icon";
import { useNavigation, type TabKey } from "../hooks/useNavigation";

const TABS: { key: TabKey; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { key: "home", label: "홈", icon: "home" },
  { key: "community", label: "커뮤니티", icon: "community" },
  { key: "marketplace", label: "마켓", icon: "market" },
  { key: "ai", label: "AI", icon: "ai" },
  { key: "my", label: "MY", icon: "user" },
];

export default function BottomNav() {
  const { activeTab, switchTab } = useNavigation();
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            className={`bottom-nav__item${active ? " bottom-nav__item--active" : ""}`}
            onClick={() => switchTab(tab.key)}
          >
            <span className="bottom-nav__icon">
              <Icon name={tab.icon} size={22} strokeWidth={active ? 2.3 : 1.9} />
            </span>
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
