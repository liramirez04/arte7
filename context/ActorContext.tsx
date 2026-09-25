'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useActors } from '@/hooks/useActors';

type ActorContextValue = ReturnType<typeof useActors>;

const ActorContext = createContext<ActorContextValue | null>(null);

export function ActorProvider({ children }: { children: ReactNode }) {
  const value = useActors();
  return <ActorContext.Provider value={value}>{children}</ActorContext.Provider>;
}

export function useActorContext() {
  const ctx = useContext(ActorContext);
  if (!ctx) throw new Error('useActorContext debe usarse dentro de <ActorProvider>');
  return ctx;
}
