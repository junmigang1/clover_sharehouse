import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/** 화면 키 — 각 탭의 루트 + 상세 화면 */
export type RouteKey =
  | "home"
  | "expenses"
  | "announcements"
  | "announcementDetail"
  | "community"
  | "postDetail"
  | "marketplace"
  | "itemDetail"
  | "itemChat"
  | "ai"
  | "aiTool"
  | "listings"
  | "houseDetail"
  | "compareHouses"
  | "lifestyleSetup"
  | "my"
  | "members"
  | "cleaningRotation"
  | "notifications"
  | "settings"
  | "profile"
  | "announcementCompose"
  | "anonBoard"
  | "tourRequest"
  | "moveInRequest"
  | "memberChat"
  | "houseInfo"
  /* ===== 임대인 모드 ===== */
  | "lordHome"
  | "lordHouses"
  | "lordHouseEdit"
  | "lordInvite"
  | "lordApplicants"
  | "lordApplicantDetail"
  | "lordReviews";

export type TabKey =
  | "home"
  | "community"
  | "marketplace"
  | "ai"
  | "my"
  | "lordHome"
  | "lordHouses"
  | "lordApplicants"
  | "lordReviews";

export interface Route {
  key: RouteKey;
  params?: Record<string, unknown>;
}

/** 어떤 화면이 어떤 탭에 속하는지 (하단 네비 활성화용) */
const ROUTE_TAB: Record<RouteKey, TabKey> = {
  home: "home",
  expenses: "home",
  announcements: "home",
  announcementDetail: "home",
  community: "community",
  postDetail: "community",
  marketplace: "marketplace",
  itemDetail: "marketplace",
  itemChat: "marketplace",
  ai: "ai",
  aiTool: "ai",
  listings: "ai",
  houseDetail: "ai",
  compareHouses: "ai",
  lifestyleSetup: "ai",
  my: "my",
  members: "my",
  cleaningRotation: "my",
  notifications: "my",
  settings: "my",
  profile: "my",
  announcementCompose: "home",
  anonBoard: "home",
  tourRequest: "ai",
  moveInRequest: "ai",
  memberChat: "home",
  houseInfo: "community",
  lordHome: "lordHome",
  lordHouses: "lordHouses",
  lordHouseEdit: "lordHouses",
  lordInvite: "lordHouses",
  lordApplicants: "lordApplicants",
  lordApplicantDetail: "lordApplicants",
  lordReviews: "lordReviews",
};

const TAB_ROOT: Record<TabKey, RouteKey> = {
  home: "home",
  community: "community",
  marketplace: "marketplace",
  ai: "ai",
  my: "my",
  lordHome: "lordHome",
  lordHouses: "lordHouses",
  lordApplicants: "lordApplicants",
  lordReviews: "lordReviews",
};

interface NavContext {
  current: Route;
  activeTab: TabKey;
  canGoBack: boolean;
  navigate: (key: RouteKey, params?: Record<string, unknown>) => void;
  goBack: () => void;
  switchTab: (tab: TabKey) => void;
}

const Ctx = createContext<NavContext | null>(null);

export function NavigationProvider({
  children,
  initialRoute = "home",
}: {
  children: ReactNode;
  initialRoute?: RouteKey;
}) {
  const [stack, setStack] = useState<Route[]>([{ key: initialRoute }]);

  const navigate = useCallback(
    (key: RouteKey, params?: Record<string, unknown>) => {
      setStack((s) => [...s, { key, params }]);
    },
    []
  );

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const switchTab = useCallback((tab: TabKey) => {
    setStack((s) => {
      const currentTab = ROUTE_TAB[s[s.length - 1].key];
      // 같은 탭을 다시 누르면 해당 탭 루트로 리셋
      if (currentTab === tab) return [{ key: TAB_ROOT[tab] }];
      return [{ key: TAB_ROOT[tab] }];
    });
  }, []);

  const current = stack[stack.length - 1];
  const value: NavContext = {
    current,
    activeTab: ROUTE_TAB[current.key],
    canGoBack: stack.length > 1,
    navigate,
    goBack,
    switchTab,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNavigation(): NavContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
