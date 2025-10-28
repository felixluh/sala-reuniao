import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import * as UsuarioController from "../../../../controllers/UsuarioController";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;
    const { user, token } = await UsuarioController.loginUser({ email, senha });

    // Configure o cookie com o token
    (await
      // Configure o cookie com o token
      cookies()).set({
      name: "auth-token", // O nome que o middleware está procurando
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas (mesmo tempo de expiração do token)
    });

    // Retorne apenas os dados do usuário. O token está no cookie.
    return NextResponse.json({ user });
  } catch (error: any) {
    // Retorna a mensagem de erro 
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor" },
      { status: 401 }
    );
  }
}