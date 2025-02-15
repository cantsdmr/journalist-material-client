import { createContext, useContext } from "react";

// Create a reusable pattern for all contexts
export function createCtx<ContextValue>() {
  const Context = createContext<ContextValue | null>(null);
  
  function useCtx() {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("Context must be used within provider");
    return ctx;
  }
  
  return [Context, useCtx] as const;
} 