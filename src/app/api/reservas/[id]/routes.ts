import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/services/mongodb";
import Reserva from "../../../../models/Reserva";

async function getUserPayloadFromToken() {
  const tokenCookie = (await cookies()).get("auth-token");
  if (!tokenCookie) throw new Error("Token não encontrado");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(tokenCookie.value, secret);

  return {
    userId: payload.id as string,
    userFuncao: payload.funcao as "admin" | "user",
  };
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { userId, userFuncao } = await getUserPayloadFromToken();
    const reservaId = params.id; 

    const reserva = await Reserva.findById(reservaId);

    if (!reserva) {
      return NextResponse.json(
        { message: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    
    if (userFuncao === "admin" || reserva.usuario.toString() === userId) {
    
      reserva.status = "cancelada";
      await reserva.save();

      return NextResponse.json({ message: "Reserva cancelada com sucesso" });
    } else {
      return NextResponse.json({ message: "Não autorizado" }, { status: 403 }); 
    }
  } catch (error: any) {
    if (error.message === "Token não encontrado") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}