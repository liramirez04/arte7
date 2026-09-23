'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Actor } from '@/components/actores/Actores-list';

interface ActorContextType {
  actors: Actor[];
  loading: boolean;
  error: string | null;
  addActor: (actor: Actor) => void;
  updateActor: (updatedActor: Actor) => void;
  deleteActor: (id: number | string) => void; 
}

const ActorContext = createContext<ActorContextType | undefined>(undefined);

export function ActorProvider({ children }: { children: ReactNode }) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/actors')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener la lista de actores');
        return res.json();
      })
      .then((data: Actor[]) => {
        setActors(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addActor = (newActor: Actor) => {
    setActors((prev) => [newActor, ...prev]);
  };

  const updateActor = (updatedActor: Actor) => {
    setActors((prev) =>
      prev.map((actor) => (actor.id === updatedActor.id ? updatedActor : actor))
    );
  };

  const deleteActor = (id: number | string) => {
    setActors((prev) => prev.filter((actor) => actor.id !== id));
  };

  return (
    <ActorContext.Provider
      value={{ actors, loading, error, addActor, updateActor, deleteActor }}
    >
      {children}
    </ActorContext.Provider>
  );
}

export function useActorContext() {
  const context = useContext(ActorContext);
  if (!context) {
    throw new Error('useActorContext debe usarse dentro de un ActorProvider');
  }
  return context;
}