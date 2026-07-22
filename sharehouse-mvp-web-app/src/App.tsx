import { useMemo, useState } from "react";
import { MobileFrame } from "./components/Layout";
import Router from "./components/Router";
import BottomNav from "./components/BottomNav";
import { NavigationProvider, useNavigation } from "./hooks/useNavigation";
import { SeekerProvider } from "./hooks/useSeeker";
import { RoleProvider, type Role } from "./hooks/useRole";

const HIDE_NAV_ON = new Set(["itemDetail", "itemChat", "lordHouseEdit"]);

/** file:// 로 열면 replaceState 가 SecurityError 를 던질 수 있어 무시한다 */
function syncParam(key: string, value: string) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
  } catch {
    /* 로컬 파일에서 열린 경우 — URL 동기화는 생략하고 계속 동작 */
  }
}

function AppShell() {
  const { current } = useNavigation();
  const showBottomNav = !HIDE_NAV_ON.has(current.key);

  return (
    <MobileFrame>
      <Router />
      {showBottomNav && <BottomNav />}
    </MobileFrame>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("role") === "landlord" ? "landlord" : "tenant";
  });

  const changeRole = useMemo(
    () => (next: Role) => {
      setRole(next);
      syncParam("role", next);
    },
    []
  );

  return (
    <RoleProvider role={role} setRole={changeRole}>
      <SeekerProvider>
        {/* 역할이 바뀌면 네비게이션 스택을 해당 역할의 첫 화면으로 리셋 */}
        <NavigationProvider key={role} initialRoute={role === "landlord" ? "lordHome" : "home"}>
          <AppShell />
        </NavigationProvider>
      </SeekerProvider>
    </RoleProvider>
  );
}
