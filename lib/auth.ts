import { cookies } from 'next/headers';

export interface User {
  id: number;
  username: string;
  name: string;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const user = JSON.parse(sessionCookie.value);
    return user;
  } catch {
    return null;
  }
}

export async function setSession(user: User) {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
