'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useActorContext } from '@/context/ActorContext';
import { Actor } from '@/hooks/useActors';
import { ActorList } from './ActorList';
import styles from '../ui/styles.module.css';

export function Actors() {
  const { actors, loading, error, deleteActor } = useActorContext();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (actor: Actor) => {
    if (!window.confirm(`¿Eliminar a ${actor.name}? Esta acción no se puede deshacer.`)) return;
    setDeletingId(actor.id);
    try {
      await deleteActor(actor.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar el actor');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = actors.filter((a) =>
    `${a.name} ${a.nationality}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Actores</h1>
          <p className={styles.subtitle}>Todos los actores registrados en la plataforma.</p>
        </div>
        <Link href="/actors/create" className={`${styles.button} ${styles.primary}`}>Crear actor</Link>
      </header>

      {loading && <p className={styles.status}>Cargando actores…</p>}

      {error && (
        <p className={styles.errorBox}>
          {error}. Revisa que el backend esté corriendo (docker-compose up) en el puerto 3000.
        </p>
      )}

      {!loading && !error && (
        <>
          <div className={styles.toolbar}>
            <input
              type="search"
              placeholder="Buscar por nombre o nacionalidad"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
              aria-label="Buscar actores"
            />
            <span className={styles.count}>{filtered.length} de {actors.length} actores</span>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{actors.length === 0 ? 'Todavía no hay actores registrados.' : 'Ningún actor coincide con la búsqueda.'}</p>
              {actors.length === 0 && (
                <Link href="/actors/create" className={`${styles.button} ${styles.primary}`}>Crear el primero</Link>
              )}
            </div>
          ) : (
            <ActorList actors={filtered} onDelete={handleDelete} deletingId={deletingId} />
          )}
        </>
      )}
    </section>
  );
}
