import { useMemo, useState } from "react";
import { MobileFrame, type ViewMode } from "./components/Layout";
import Router from "./components/Router";
import BottomNav from "./components/BottomNav";
import { NavigationProvider, useNavigation } from "./hooks/useNavigation";

const HIDE_NAV_ON = new Set(["itemDetail", "itemChat"]);

function AppShell() {
  const { current } = useNavigation();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("view") === "app" ? "app" : "web";
  });

  const showBottomNav = viewMode === "app" && !HIDE_NAV_ON.has(current.key);

  const setMode = useMemo(
    () => (mode: ViewMode) => {
      setViewMode(mode);
      const url = new URL(window.location.href);
      url.searchParams.set("view", mode);
      window.history.replaceState(null, "", url);
    },
    []
  );

  return (
    <MobileFrame mode={viewMode} onModeChange={setMode}>
      <Router />
      {showBottomNav && <BottomNav />}
    </MobileFrame>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AppShell />
    </NavigationProvider>
  );
}
