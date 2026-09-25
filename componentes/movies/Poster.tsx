'use client';

import { useState } from 'react';
import styles from '../ui/styles.module.css';

export function Poster({ src, title, className }: { src: string; title: string; className: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`${className} ${styles.posterFallback}`}>{title.charAt(0)}</div>;
  }

  return (
    <img src={src} alt={`Póster de ${title}`} className={className} onError={() => setFailed(true)} />
  );
}
