import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "subscriber";
export type SessionUser = {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
};

type AuthCtx = {
  user: SessionUser | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginSubscriber: (phone: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "cabletv_session_v1";

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
        loginAdmin: async (email) => {
          await new Promise(r => setTimeout(r, 400));
          save({ id: "admin-1", name: "Operator Admin", role: "admin", email });
        },
        loginSubscriber: async (phone) => {
          await new Promise(r => setTimeout(r, 400));
          save({ id: "s1", name: "Rahul Sharma", role: "subscriber", phone });
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
