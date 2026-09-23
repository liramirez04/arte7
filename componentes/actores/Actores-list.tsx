import React from 'react';

export interface Actor {
  id?: number | string;
  name: string;
  photo?: string;
  nationality: string;
  birthday?: string;
  biography: string;
}

interface ActorListProps {
  actors: Actor[];
}

export function ActorList({ actors }: ActorListProps) {
  if (!actors || actors.length === 0) {
    return <p>No hay actores disponibles.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {actors.map((actor) => (
        <li key={actor.id || actor.name} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
          <h3>{actor.name}</h3>
          {actor.photo && (
            <img 
              src={actor.photo} 
              alt={actor.name} 
              width={100} 
              style={{ borderRadius: '8px' }} 
            />
          )}
          <p><strong>Nacionalidad:</strong> {actor.nationality}</p>
          <p><strong>Biografía:</strong> {actor.biography}</p>
        </li>
      ))}
    </ul>
  );
}