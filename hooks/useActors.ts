'use client';

import { useState, useEffect } from 'react';

export function useActors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/actors')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener la lista de actores');
        return res.json();
      })
      .then((data) => {
        setActors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { actors, setActors, loading, error };
}