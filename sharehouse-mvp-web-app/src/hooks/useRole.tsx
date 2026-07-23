import { createContext, useContext, type ReactNode } from "react";

export type Role = "tenant" | "landlord";

interface RoleContext {
  role: Role;
  setRole: (role: Role) => void;
}

const Ctx = createContext<RoleContext | null>(null);

export function RoleProvider({
  role,
  setRole,
  children,
}: {
  role: Role;
  setRole: (role: Role) => void;
  children: ReactNode;
}) {
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}

export function useRole(): RoleContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
