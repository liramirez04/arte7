'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMovie, formatDate } from '@/hooks/useMovies';
import { Poster } from './Poster';
import styles from '../ui/styles.module.css';

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { movie, loading, error } = useMovie(id);

  if (loading) return <p className={styles.status}>Cargando película…</p>;

  if (error || !movie) {
    return (
      <section className={styles.page}>
        <div className={styles.empty}>
          <p>No encontramos esta película.</p>
          <Link href="/movies" className={`${styles.button} ${styles.primary}`}>Volver a películas</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Link href="/movies" className={styles.backLink}>Volver a películas</Link>

      <div className={styles.detail}>
        <Poster src={movie.poster} title={movie.title} className={styles.detailPoster} />

        <div>
          <h1 className={styles.title}>{movie.title}</h1>
          {movie.genre && <span className={styles.chip}>{movie.genre.type}</span>}

          <dl className={styles.infoList}>
            <dt>Estreno</dt><dd>{formatDate(movie.releaseDate)}</dd>
            <dt>Duración</dt><dd>{movie.duration} min</dd>
            <dt>País</dt><dd>{movie.country}</dd>
            <dt>Popularidad</dt><dd>{movie.popularity}</dd>
            <dt>Director</dt><dd>{movie.director?.name ?? 'Sin director'}</dd>
            <dt>Tráiler</dt>
            <dd>
              {movie.youtubeTrailer
                ? <a href={movie.youtubeTrailer.url} target="_blank" rel="noreferrer">{movie.youtubeTrailer.name}</a>
                : 'Sin tráiler'}
            </dd>
          </dl>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Actores</h2>
      {movie.actors && movie.actors.length > 0 ? (
        <ul className={styles.actorRows}>
          {movie.actors.map((actor) => (
            <li key={actor.id} className={styles.actorRow}>
              <img src={actor.photo} alt={actor.name} className={styles.smallPhoto} />
              <div>
                <strong>{actor.name}</strong>
                <div className={styles.meta}>{actor.nationality}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.meta}>Esta película no tiene actores asociados.</p>
      )}

      <h2 className={styles.sectionTitle}>Premios</h2>
      {movie.prizes && movie.prizes.length > 0 ? (
        <ul className={styles.plainList}>
          {movie.prizes.map((prize) => (
            <li key={prize.id}>
              <strong>{prize.name}</strong> — {prize.category} ({prize.year}) ·{' '}
              {prize.status === 'won' ? 'Ganado' : 'Nominado'}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.meta}>Esta película no tiene premios.</p>
      )}

      <h2 className={styles.sectionTitle}>Plataformas</h2>
      {movie.platforms && movie.platforms.length > 0 ? (
        <ul className={styles.plainList}>
          {movie.platforms.map((p) => <li key={p.id}>{p.name}</li>)}
        </ul>
      ) : (
        <p className={styles.meta}>No está en ninguna plataforma.</p>
      )}

      <h2 className={styles.sectionTitle}>Reseñas</h2>
      {movie.reviews && movie.reviews.length > 0 ? (
        <ul className={styles.plainList}>
          {movie.reviews.map((r) => (
            <li key={r.id}><strong>{r.creator}</strong> ({r.score}/5): {r.text}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.meta}>Sin reseñas.</p>
      )}
    </section>
  );
}
