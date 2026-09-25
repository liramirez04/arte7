'use client';

import { useCallback, useEffect, useState } from 'react';
import { ActorInput } from '@/hooks/useActors';

const API = 'http://localhost:3000/api/v1';

export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: string;
  movies?: { id: string }[];
}

export interface MovieActor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  director?: { id: string; name: string } | null;
  genre?: { id: string; type: string } | null;
  youtubeTrailer?: { id: string; name: string; url: string; duration: number; channel: string } | null;
  actors?: MovieActor[];
  platforms?: { id: string; name: string; url: string }[];
  reviews?: { id: string; text: string; score: number; creator: string }[];
  prizes?: Prize[];
}

export interface Option { id: string; label: string }

export interface MovieFormData {
  movie: {
    title: string; poster: string; duration: string; country: string;
    releaseDate: string; popularity: string; genreId: string; directorId: string;
  };
  trailer: { name: string; url: string; duration: string; channel: string };
  actor: ActorInput;
  prize: { name: string; category: string; year: string; status: string };
}

export function formatDate(date?: string) {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      msg = Array.isArray(body.message) ? body.message.join(', ') : body.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

function post<T>(url: string, body?: unknown) {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([request<Movie[]>(`${API}/movies`), request<Prize[]>(`${API}/prizes`)])
      .then(([moviesData, prizesData]) => {
        const withPrizes = moviesData.map((movie) => ({
          ...movie,
          prizes: prizesData.filter((p) => p.movies?.some((m) => m.id === movie.id)),
        }));
        setMovies(withPrizes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { movies, loading, error };
}

export function useMovie(id: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      request<Movie>(`${API}/movies/${id}`),
      request<Prize[]>(`${API}/movies/${id}/prizes`).catch(() => [] as Prize[]),
    ])
      .then(([movieData, prizes]) => setMovie({ ...movieData, prizes }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, loading, error };
}

export function useMovieOptions() {
  const [genres, setGenres] = useState<Option[]>([]);
  const [directors, setDirectors] = useState<Option[]>([]);

  useEffect(() => {
    request<{ id: string; type: string }[]>(`${API}/genres`)
      .then((data) => setGenres(data.map((g) => ({ id: g.id, label: g.type }))))
      .catch(() => setGenres([]));
    request<{ id: string; name: string }[]>(`${API}/directors`)
      .then((data) => setDirectors(data.map((d) => ({ id: d.id, label: d.name }))))
      .catch(() => setDirectors([]));
  }, []);

  return { genres, directors };
}

export function useCreateMovie() {
  const [step, setStep] = useState<string | null>(null);

  const createMovie = useCallback(async (form: MovieFormData) => {
    let current = '';
    const go = (label: string) => { current = label; setStep(label); };
    try {
      go('Creando tráiler…');
      const trailer = await post<{ id: string }>(`${API}/youtube-trailers`, {
        name: form.trailer.name,
        url: form.trailer.url,
        duration: Number(form.trailer.duration),
        channel: form.trailer.channel,
      });

      go('Creando película…');
      const movie = await post<Movie>(`${API}/movies`, {
        title: form.movie.title,
        poster: form.movie.poster,
        duration: Number(form.movie.duration),
        country: form.movie.country,
        releaseDate: form.movie.releaseDate,
        popularity: Number(form.movie.popularity),
        genre: { id: form.movie.genreId },
        director: { id: form.movie.directorId },
        youtubeTrailer: { id: trailer.id },
      });

      go('Creando actor…');
      const actor = await post<{ id: string }>(`${API}/actors`, form.actor);

      go('Asignando película al actor…');
      await post(`${API}/actors/${actor.id}/movies/${movie.id}`);

      go('Creando premio…');
      const prize = await post<{ id: string }>(`${API}/prizes`, {
        name: form.prize.name,
        category: form.prize.category,
        year: Number(form.prize.year),
        status: form.prize.status,
      });

      go('Asignando premio a la película…');
      await post(`${API}/movies/${movie.id}/prizes/${prize.id}`);

      return movie.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error';
      throw new Error(`${msg} (paso: ${current.replace('…', '')})`);
    } finally {
      setStep(null);
    }
  }, []);

  return { createMovie, step };
}
