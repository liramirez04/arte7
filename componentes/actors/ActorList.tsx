import Link from 'next/link';
import { Actor } from '@/hooks/useActors';
import styles from '../ui/styles.module.css';

interface ActorListProps {
  actors: Actor[];
  onDelete: (actor: Actor) => void;
  deletingId: string | null;
}

function formatDate(date: string) {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export function ActorList({ actors, onDelete, deletingId }: ActorListProps) {
  return (
    <ul className={styles.grid}>
      {actors.map((actor) => (
        <li key={actor.id} className={styles.card}>
          <img src={actor.photo} alt={`Foto de ${actor.name}`} className={styles.cardPhoto} />

          <div className={styles.cardBody}>
            <h2 className={styles.cardName}>{actor.name}</h2>
            <div className={styles.meta}>
              <span className={styles.chip}>{actor.nationality}</span>
              <span>Nació el {formatDate(actor.birthDate)}</span>
            </div>
            <p className={styles.bio}>{actor.biography}</p>

            <div className={styles.cardActions}>
              <Link href={`/actors/${actor.id}/edit`} className={`${styles.button} ${styles.secondary}`}>
                Editar
              </Link>
              <button
                type="button"
                onClick={() => onDelete(actor)}
                disabled={deletingId === actor.id}
                className={`${styles.button} ${styles.danger}`}
              >
                {deletingId === actor.id ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
