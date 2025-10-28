import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/services/mongodb";
import Reserva from "../../../../models/Reserva";
import Room from "../../../../models/Salas"; 


async function getUserIdFromToken() {
  const tokenCookie = (await cookies()).get("auth-token"); 
  if (!tokenCookie) throw new Error("Token não encontrado");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(tokenCookie.value, secret);

  return payload.id as string;
}

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    const _ = Room.modelName;

    const minhasReservas = await Reserva.find({
      usuario: userId,
      status: "confirmada",
    })
      .populate("room", "name")
      .sort({ dataInicio: 1 });
    return NextResponse.json(minhasReservas);
  } catch (error: any) {
    console.error("--- ERRO FATAL NA API /api/reservas/minhas ---");
    console.error(error);
    console.error("------------------------------------------------");

    if (error.message === "Token não encontrado") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Erro ao buscar reservas", error: error.message },
      { status: 500 }
    );
  }
}