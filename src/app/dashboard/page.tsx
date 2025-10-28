import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AdminDashboard from '../componentes/AdminDashboard'
import UserDashboard from '../componentes/UserDashboard'; 
import { createSecretKey } from 'crypto';

interface UserPayload {
  id: string;
  email: string;
  nome: string;
  funcao: 'admin' | 'user';
}


async function getPayloadFromToken(): Promise<UserPayload | null> {
  const tokenCookie = (await cookies()).get('auth-token');
  if (!tokenCookie) {
    return null;
  }

  const JWT_SECRET_KEY = process.env.JWT_SECRET;
  if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET não está definido no .env.local');
  }

  // Use createSecretKey para garantir um KeyLike compatível com `jose`
  const secretKey = createSecretKey(Buffer.from(JWT_SECRET_KEY, 'utf-8'));

  try {
    const { payload } = await jwtVerify(tokenCookie.value, secretKey);
    return payload as unknown as UserPayload;
  } catch (error) {
    console.error("Erro ao verificar token no dashboard:", error);
    return null;
  }
}


// A Página Principal do Dashboard
export default async function DashboardPage() {
  const payload = await getPayloadFromToken();

  // Se o middleware falhou ou o token é inválido
  if (!payload) {
    redirect('/login');
  }

  // O ROTEADOR DE PERMISSÃO
  if (payload.funcao === 'admin') {
    // Se for admin, mostre o painel de admin
    return <AdminDashboard />;
  } else {
    // Para qualquer outra função, mostre o painel de usuário
    return <UserDashboard />;
  }
}