import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { getOperatorById, type Operator } from "@/lib/mock-data";

type Ctx = { operator: Operator | null };
const BrandCtx = createContext<Ctx>({ operator: null });

/**
 * Used in the subscriber portal to brand the UI with the operator's
 * primary color, name, and support details. Applies a CSS override so
 * existing components that read `--primary` automatically re-theme.
 */
export function OperatorBrandProvider({ operatorId, children }: { operatorId?: string; children: ReactNode }) {
  const operator = useMemo(() => (operatorId ? getOperatorById(operatorId) ?? null : null), [operatorId]);

  useEffect(() => {
    if (!operator) return;
    const root = document.documentElement;
    const prev = {
      primary: root.style.getPropertyValue("--primary"),
      ring: root.style.getPropertyValue("--ring"),
    };
    root.style.setProperty("--primary", operator.branding.primaryColor);
    root.style.setProperty("--ring", operator.branding.primaryColor);
    return () => {
      root.style.setProperty("--primary", prev.primary);
      root.style.setProperty("--ring", prev.ring);
    };
  }, [operator]);

  return <BrandCtx.Provider value={{ operator }}>{children}</BrandCtx.Provider>;
}

export const useOperatorBrand = () => useContext(BrandCtx);
