import { ActorProvider } from '@/context/ActorContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ActorProvider>
          {children}
        </ActorProvider>
      </body>
    </html>
  );
}
