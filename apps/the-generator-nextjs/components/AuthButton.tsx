'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (session) {
    return (
      <Button variant="outline" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    );
  }

  return (
    <Button variant="default" onClick={handleSignIn}>
      Iniciar sesión
    </Button>
  );
}
