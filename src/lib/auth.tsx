import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { OPERATORS, SUBSCRIBERS, getOperatorByCode } from "./mock-data";

export type Role = "super_admin" | "operator_admin" | "subscriber";

export type SessionUser = {
  id: string;
  name: string;
  role: Role;
  operator_id?: string;   // required for operator_admin + subscriber
  operator_code?: string; // for subscriber branding lookup
  email?: string;
  phone?: string;
};

type AuthCtx = {
  user: SessionUser | null;
  loginSuperAdmin: (email: string, password: string) => Promise<void>;
  loginOperator: (email: string, password: string) => Promise<void>;
  loginSubscriber: (operatorCode: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "cabletv_session_v2";

const SUPER_ADMIN = { email: "owner@cablehub.app", password: "super123" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* noop */ }
    }
  }, []);

  const save = (u: SessionUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  return (
    <Ctx.Provider
      value={{
        user,
        loginSuperAdmin: async (email, password) => {
          await new Promise(r => setTimeout(r, 300));
          if (email.trim().toLowerCase() !== SUPER_ADMIN.email || password !== SUPER_ADMIN.password) {
            throw new Error("Invalid super admin credentials");
          }
          save({ id: "sa-1", name: "Platform Owner", role: "super_admin", email });
        },
        loginOperator: async (email, password) => {
          await new Promise(r => setTimeout(r, 300));
          const op = OPERATORS.find(
            o => o.adminEmail.toLowerCase() === email.trim().toLowerCase() && o.adminPassword === password,
          );
          if (!op) throw new Error("Invalid operator credentials");
          if (op.status !== "active") throw new Error("Operator account is inactive");
          save({
            id: `oa-${op.id}`,
            name: op.contactPerson,
            role: "operator_admin",
            operator_id: op.id,
            operator_code: op.code,
            email,
          });
        },
        loginSubscriber: async (operatorCode, phone, password) => {
          await new Promise(r => setTimeout(r, 300));
          const op = getOperatorByCode(operatorCode.trim());
          if (!op) throw new Error("Invalid operator code");
          if (op.status !== "active") throw new Error("This operator is currently inactive");
          const sub = SUBSCRIBERS.find(
            s => s.operator_id === op.id && s.phone === phone.trim() && s.password === password,
          );
          if (!sub) throw new Error("Invalid phone or password");
          if (sub.status !== "active") throw new Error("Your subscription is inactive. Please contact your operator.");
          save({
            id: sub.id,
            name: sub.name,
            role: "subscriber",
            operator_id: op.id,
            operator_code: op.code,
            phone,
          });
        },
        logout: () => save(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

// Used by route beforeLoad guards (which run on the client only in this project).
export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
