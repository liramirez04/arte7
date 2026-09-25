import type { Metadata } from 'next';
import './globals.css';
import { ActorProvider } from '@/context/ActorContext';
import { Navbar } from '@/componentes/navbar/Navbar';

export const metadata: Metadata = {
  title: 'Arte7',
  description: 'CRUD de actores - Parcial ISIS3710',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ActorProvider>
          <Navbar />
          <main>{children}</main>
        </ActorProvider>
      </body>
    </html>
  );
}
