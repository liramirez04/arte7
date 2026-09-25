'use client';

import Link from 'next/link';
import { useMovies, formatDate } from '@/hooks/useMovies';
import { Poster } from './Poster';
import styles from '../ui/styles.module.css';

export function Movies() {
  const { movies, loading, error } = useMovies();

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Películas</h1>
          <p className={styles.subtitle}>Todas las películas registradas en la plataforma.</p>
        </div>
        <Link href="/movies/create" className={`${styles.button} ${styles.primary}`}>Crear película</Link>
      </header>

      {loading && <p className={styles.status}>Cargando películas…</p>}
      {error && <p className={styles.errorBox}>{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <div className={styles.empty}>
          <p>Todavía no hay películas registradas.</p>
          <Link href="/movies/create" className={`${styles.button} ${styles.primary}`}>Crear la primera</Link>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <ul className={styles.grid}>
          {movies.map((movie) => {
            const actor = movie.actors?.[0];
            const prize = movie.prizes?.[0];
            return (
              <li key={movie.id} className={styles.card}>
                <Poster src={movie.poster} title={movie.title} className={styles.moviePoster} />
                <div className={styles.cardBody}>
                  <h2 className={styles.cardName}>{movie.title}</h2>
                  <p className={styles.meta}>Estreno: {formatDate(movie.releaseDate)}</p>
                  <p className={styles.meta}>Actor: {actor ? actor.name : 'Sin actor'}</p>
                  <p className={styles.meta}>
                    Premio: {prize ? <span className={styles.chip}>{prize.name}</span> : 'Sin premio'}
                  </p>
                  <div className={styles.cardActions}>
                    <Link href={`/movies/${movie.id}`} className={`${styles.button} ${styles.secondary}`}>
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
