import Icon from "./Icon";
import { useNavigation, type TabKey } from "../hooks/useNavigation";
import { useRole } from "../hooks/useRole";

type Tab = { key: TabKey; label: string; icon: Parameters<typeof Icon>[0]["name"] };

const TENANT_TABS: Tab[] = [
  { key: "home", label: "홈", icon: "home" },
  { key: "community", label: "커뮤니티", icon: "community" },
  { key: "marketplace", label: "마켓", icon: "market" },
  { key: "ai", label: "찾기", icon: "ai" },
  { key: "my", label: "MY", icon: "user" },
];

const LANDLORD_TABS: Tab[] = [
  { key: "lordHome", label: "현황", icon: "home" },
  { key: "lordHouses", label: "내 매물", icon: "market" },
  { key: "lordApplicants", label: "신청", icon: "user" },
  { key: "community", label: "커뮤니티", icon: "community" },
  { key: "lordReviews", label: "리포트", icon: "check-circle" },
];

export default function BottomNav() {
  const { activeTab, switchTab } = useNavigation();
  const { role } = useRole();
  const tabs = role === "landlord" ? LANDLORD_TABS : TENANT_TABS;

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {tabs.map((tab) => {
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
