'use client';

import { useRouter } from 'next/navigation';
import { useActorContext } from '@/context/ActorContext';
import { ActorInput } from '@/hooks/useActors';
import { ActorForm } from './ActorForm';
import styles from '../ui/styles.module.css';

export function CreateActor() {
  const { addActor } = useActorContext();
  const router = useRouter();

  const handleCreate = async (data: ActorInput) => {
    await addActor(data);
    router.push('/actors');
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Crear actor</h1>
          <p className={styles.subtitle}>Todos los campos son obligatorios.</p>
        </div>
      </header>
      <ActorForm submitLabel="Crear actor" onSubmit={handleCreate} onCancel={() => router.push('/actors')} />
    </section>
  );
}