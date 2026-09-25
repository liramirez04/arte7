import Link from 'next/link';
import styles from '../ui/styles.module.css';

export function Home() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Catálogo de cine Arte7</h1>
        <p className={styles.heroText}>
          Consulta y administra los actores y las películas registradas, con sus premios.
        </p>
        <div className={styles.heroActions}>
          <Link href="/actors" className={`${styles.button} ${styles.primary}`}>Ver actores</Link>
          <Link href="/movies" className={`${styles.button} ${styles.secondary}`}>Ver películas</Link>
        </div>
      </div>
    </section>
  );
}
