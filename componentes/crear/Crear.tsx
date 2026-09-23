'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActorContext } from '@/context/ActorContext';
import { Actor } from '../actores/Actores-list';

export function Crear() {
  const { addActor } = useActorContext();
  const router = useRouter();

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthday, setBirthday] = useState('');
  const [biography, setBiography] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newActor: Actor = {
      id: Date.now(),
      name,
      photo,
      nationality,
      birthday,
      biography,
    };

    addActor(newActor);

    router.push('/actores');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>Crear Actor</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block' }}>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block' }}>URL Foto:</label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block' }}>Nacionalidad:</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block' }}>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block' }}>Biografía:</label>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows={4}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', marginTop: '10px' }}>
          Guardar Actor
        </button>
      </form>
    </div>
  );
}