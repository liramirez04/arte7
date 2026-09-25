'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMovie, useMovieOptions, MovieFormData } from '@/hooks/useMovies';
import { useActorContext } from '@/context/ActorContext';
import styles from '../ui/styles.module.css';

const EMPTY: MovieFormData = {
  movie: { title: '', poster: '', duration: '', country: '', releaseDate: '', popularity: '', genreId: '', directorId: '' },
  trailer: { name: '', url: '', duration: '', channel: '' },
  actor: { name: '', photo: '', nationality: '', birthDate: '', biography: '' },
  prize: { name: '', category: '', year: '', status: 'won' },
};

type Section = keyof MovieFormData;
type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export function CreateMovie() {
  const router = useRouter();
  const { refetch } = useActorContext();
  const { genres, directors } = useMovieOptions();
  const { createMovie, step } = useCreateMovie();
  const [form, setForm] = useState<MovieFormData>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  
  const handleChange = (section: Section) => (e: FieldEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const movieId = await createMovie(form);
      refetch(); 
      router.push(`/movies/${movieId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la película');
    }
  };

  const m = handleChange('movie');
  const t = handleChange('trailer');
  const a = handleChange('actor');
  const p = handleChange('prize');

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Crear película</h1>
          <p className={styles.subtitle}>Se crean la película, su actor principal y su premio, y luego se asocian.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <p className={styles.errorBox}>{error}</p>}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Película</legend>
          <label className={styles.field}>Título
            <input name="title" value={form.movie.title} onChange={m} required className={styles.input} />
          </label>
          <label className={styles.field}>URL del póster
            <input name="poster" type="url" value={form.movie.poster} onChange={m} required className={styles.input} />
          </label>
          <div className={styles.row}>
            <label className={styles.field}>Fecha de estreno
              <input name="releaseDate" type="date" value={form.movie.releaseDate} onChange={m} required className={styles.input} />
            </label>
            <label className={styles.field}>País
              <input name="country" value={form.movie.country} onChange={m} required className={styles.input} />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>Duración (min)
              <input name="duration" type="number" min="1" value={form.movie.duration} onChange={m} required className={styles.input} />
            </label>
            <label className={styles.field}>Popularidad (1 a 5)
              <input name="popularity" type="number" min="1" max="5" value={form.movie.popularity} onChange={m} required className={styles.input} />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>Género
              <select name="genreId" value={form.movie.genreId} onChange={m} required className={styles.input}>
                <option value="">Selecciona un género</option>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </label>
            <label className={styles.field}>Director
              <select name="directorId" value={form.movie.directorId} onChange={m} required className={styles.input}>
                <option value="">Selecciona un director</option>
                {directors.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Tráiler de YouTube</legend>
          <div className={styles.row}>
            <label className={styles.field}>Nombre
              <input name="name" value={form.trailer.name} onChange={t} required className={styles.input} />
            </label>
            <label className={styles.field}>Canal
              <input name="channel" value={form.trailer.channel} onChange={t} required className={styles.input} />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>URL
              <input name="url" type="url" value={form.trailer.url} onChange={t} required className={styles.input} />
            </label>
            <label className={styles.field}>Duración (min)
              <input name="duration" type="number" min="1" value={form.trailer.duration} onChange={t} required className={styles.input} />
            </label>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Actor principal</legend>
          <div className={styles.row}>
            <label className={styles.field}>Nombre
              <input name="name" value={form.actor.name} onChange={a} required className={styles.input} />
            </label>
            <label className={styles.field}>Nacionalidad
              <input name="nationality" value={form.actor.nationality} onChange={a} required className={styles.input} />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>URL de la foto
              <input name="photo" type="url" value={form.actor.photo} onChange={a} required className={styles.input} />
            </label>
            <label className={styles.field}>Fecha de nacimiento
              <input name="birthDate" type="date" value={form.actor.birthDate} onChange={a} required className={styles.input} />
            </label>
          </div>
          <label className={styles.field}>Biografía
            <textarea name="biography" value={form.actor.biography} onChange={a} required className={styles.input} />
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Premio</legend>
          <div className={styles.row}>
            <label className={styles.field}>Nombre
              <input name="name" value={form.prize.name} onChange={p} required className={styles.input} />
            </label>
            <label className={styles.field}>Categoría
              <input name="category" value={form.prize.category} onChange={p} required className={styles.input} />
            </label>
          </div>
          <div className={styles.row}>
            <label className={styles.field}>Año
              <input name="year" type="number" min="1900" value={form.prize.year} onChange={p} required className={styles.input} />
            </label>
            <label className={styles.field}>Estado
              <select name="status" value={form.prize.status} onChange={p} className={styles.input}>
                <option value="won">Ganado</option>
                <option value="nominated">Nominado</option>
              </select>
            </label>
          </div>
        </fieldset>

        <div className={styles.formActions}>
          <button type="button" onClick={() => router.push('/movies')} className={`${styles.button} ${styles.secondary}`}>
            Cancelar
          </button>
          <button type="submit" disabled={step !== null} className={`${styles.button} ${styles.primary}`}>
            {step ?? 'Crear película'}
          </button>
        </div>
      </form>
    </section>
  );
}
