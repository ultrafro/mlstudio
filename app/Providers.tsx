import { createContext } from "react";
import { DEFAULT_SESSION, StudioSession } from "./model";

export const SessionProivder = createContext<{
  session: StudioSession;
  setSession: (newSession: StudioSession) => void;
}>({
  session: { ...DEFAULT_SESSION },
  setSession: (newSession: StudioSession) => {},
});
