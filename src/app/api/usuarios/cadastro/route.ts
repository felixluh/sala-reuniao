import { NextResponse } from 'next/server';
import * as UsuarioController from '../../../../controllers/UsuarioController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, funcao } = body;

    // Validação básica
    if (!nome || !email || !senha || !funcao) {
        return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const newUser = await UsuarioController.registerUser({ nome, email, senha, funcao });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    // Retorna a mensagem de erro específica (ex: email já cadastrado)
    return NextResponse.json({ message: error.message || 'Erro ao registrar usuário' }, { status: 400 });
  }
}