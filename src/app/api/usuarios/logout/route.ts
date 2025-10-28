import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // "Apaga" o cookie de autenticação
    (await
          cookies()).set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0, // Diz ao navegador para expirar o cookie imediatamente
    });

    return NextResponse.json({ message: 'Logout realizado com sucesso' });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}