'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useActorContext } from '@/context/ActorContext';
import { ActorInput } from '@/hooks/useActors';
import { ActorForm } from './ActorForm';
import styles from '../ui/styles.module.css';

export function EditActor() {
  const { id } = useParams<{ id: string }>();
  const { getActorById, updateActor, loading } = useActorContext();
  const router = useRouter();

  if (loading) return <p className={styles.status}>Cargando actor…</p>;

  const actor = getActorById(id);

  if (!actor) {
    return (
      <section className={styles.page}>
        <div className={styles.empty}>
          <p>No encontramos este actor. Puede que ya haya sido eliminado.</p>
          <Link href="/actors" className={`${styles.button} ${styles.primary}`}>Volver a actores</Link>
        </div>
      </section>
    );
  }

  const initialValues: ActorInput = {
    name: actor.name,
    photo: actor.photo,
    nationality: actor.nationality,
    birthDate: actor.birthDate ? actor.birthDate.slice(0, 10) : '', 
    biography: actor.biography,
  };

  const handleUpdate = async (data: ActorInput) => {
    await updateActor(actor.id, data);
    router.push('/actors');
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Editar actor</h1>
          <p className={styles.subtitle}>Estás editando a {actor.name}.</p>
        </div>
      </header>
      <ActorForm
        key={actor.id}
        initialValues={initialValues}
        submitLabel="Guardar cambios"
        onSubmit={handleUpdate}
        onCancel={() => router.push('/actors')}
      />
    </section>
  );
}
