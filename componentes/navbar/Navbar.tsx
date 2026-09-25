'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../ui/styles.module.css';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/actors', label: 'Actores', active: pathname.startsWith('/actors') && pathname !== '/actors/create' },
    { href: '/actors/create', label: 'Nuevo actor', active: pathname === '/actors/create' },
    { href: '/movies', label: 'Películas', active: pathname.startsWith('/movies') && pathname !== '/movies/create' },
    { href: '/movies/create', label: 'Nueva película', active: pathname === '/movies/create' },
  ];

  return (
    <header className={styles.nav}>
      <nav className={styles.navInner}>
        <Link href="/" className={styles.brand}>Arte7</Link>
        <div className={styles.navLinks}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${link.active ? styles.navLinkActive : ''}`}
              aria-current={link.active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}