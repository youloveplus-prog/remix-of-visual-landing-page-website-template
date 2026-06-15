import { createContext, useContext } from "react";

export interface LegalPresenceValue {
  counts: Record<number, number>;
  total: number;
}

export const LegalPresenceContext = createContext<LegalPresenceValue>({
  counts: {},
  total: 0,
});

export const useLegalPresenceContext = () => useContext(LegalPresenceContext);
