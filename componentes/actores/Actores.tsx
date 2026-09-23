'use client';

import React from 'react';
import { useActorContext } from '@/context/ActorContext';
import { ActorList } from './Actores-list';

export function Actores() {
  const { actors, loading, error } = useActorContext();

  if (loading) return <p>Cargando actores...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Actores</h1>
      <ActorList actors={actors} />
    </div>
  );
}