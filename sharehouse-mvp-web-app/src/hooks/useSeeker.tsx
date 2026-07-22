import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LifestyleAxisKey, MyLifestyle } from "../types";
import { DEFAULT_MY_LIFESTYLE } from "../data/lifestyle";

interface SeekerContext {
  liked: string[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  my: MyLifestyle;
  setAxis: (key: LifestyleAxisKey, value: number) => void;
  setNoSmoke: (value: boolean) => void;
  setCommuteHub: (hub: string) => void;
  markSet: () => void;
}

const Ctx = createContext<SeekerContext | null>(null);

export function SeekerProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<string[]>([]);
  const [my, setMy] = useState<MyLifestyle>(DEFAULT_MY_LIFESTYLE);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isLiked = useCallback((id: string) => liked.includes(id), [liked]);

  const setAxis = useCallback((key: LifestyleAxisKey, value: number) => {
    setMy((prev) => ({ ...prev, axes: { ...prev.axes, [key]: value } }));
  }, []);

  const setNoSmoke = useCallback((value: boolean) => {
    setMy((prev) => ({ ...prev, noSmoke: value }));
  }, []);

  const setCommuteHub = useCallback((hub: string) => {
    setMy((prev) => ({ ...prev, commuteHub: hub }));
  }, []);

  const markSet = useCallback(() => {
    setMy((prev) => ({ ...prev, set: true }));
  }, []);

  const value = useMemo<SeekerContext>(
    () => ({ liked, isLiked, toggleLike, my, setAxis, setNoSmoke, setCommuteHub, markSet }),
    [liked, isLiked, toggleLike, my, setAxis, setNoSmoke, setCommuteHub, markSet]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSeeker(): SeekerContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSeeker must be used within SeekerProvider");
  return ctx;
}
