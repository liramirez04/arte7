'use client';

import { useCallback, useEffect, useState } from 'react';

// Campos tal como los devuelve/espera el backend BackArte7
export interface Actor {
  id: string; // UUID generado por el backend
  name: string;
  photo: string; // obligatorio y debe ser una URL válida
  nationality: string;
  birthDate: string; // se llama birthDate, no birthday
  biography: string;
}

// Lo que se envía al crear/editar (el backend genera el id)
export type ActorInput = Omit<Actor, 'id'>;

const API_URL = 'http://localhost:3000/api/v1/actors';

// NestJS devuelve { message: string | string[] } cuando falla la validación
async function getErrorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    const msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    return msg || fallback;
  } catch {
    return fallback;
  }
}

export function useActors() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActors = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('No se pudo cargar la lista de actores');
      const data: Actor[] = await res.json();
      setActors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  const addActor = async (data: ActorInput) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo crear el actor'));
    const created: Actor = await res.json();
    setActors((prev) => [...prev, created]);
    return created;
  };

  const updateActor = async (id: string, data: ActorInput) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo actualizar el actor'));
    const updated: Actor = await res.json();
    setActors((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteActor = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo eliminar el actor'));
    setActors((prev) => prev.filter((a) => a.id !== id));
  };

  const getActorById = (id: string) => actors.find((a) => a.id === id);

  return { actors, loading, error, addActor, updateActor, deleteActor, getActorById, refetch: fetchActors };
}
