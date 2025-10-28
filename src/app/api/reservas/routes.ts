import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/services/mongodb';
import Reserva from '../../../models/Reserva';
import Room from '../../../models/Salas';       
import Usuario from '../../../models/Usuario'; 


async function getUserIdFromToken() {
 
  const tokenCookie = (await cookies()).get('auth-token'); 
  if (!tokenCookie) throw new Error('Token não encontrado');
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(tokenCookie.value, secret);
  return payload.id as string;
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(); 
    const body = await request.json();
    
    const { sala, dataInicio, dataFim } = body;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    
    const _ = Room.modelName;
    const __ = Usuario.modelName;

    const conflito = await Reserva.findOne({
      room: sala, 
      status: 'confirmada',
      $or: [
        { dataInicio: { $lt: fim }, dataFim: { $gt: inicio } },
      ]
    });

    if (conflito) {
      return NextResponse.json(
        { message: 'Horário indisponível. Já existe uma reserva neste período.' },
        { status: 409 }
      );
    }

    const novaReserva = new Reserva({
      room: sala, 
      usuario: userId,
      dataInicio: inicio,
      dataFim: fim
    });

    await novaReserva.save();
    return NextResponse.json(novaReserva, { status: 201 });

  } catch (error: any) {
    console.error('--- ERRO FATAL POST /api/reservas ---', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');

    const query: any = { status: 'confirmada' };

    if (data) {
      const dataInicio = new Date(data);
      dataInicio.setUTCHours(0, 0, 0, 0); 
      const dataFim = new Date(data);
      dataFim.setUTCHours(23, 59, 59, 999);
      query.dataInicio = { $gte: dataInicio, $lte: dataFim };
    }

    const _ = Room.modelName;
    const __ = Usuario.modelName;

    const reservas = await Reserva.find(query)
      .populate('room', 'name') 
      .populate('usuario', 'nome email') 
      .sort({ dataInicio: 1 }); 

    return NextResponse.json(reservas);

  } catch (error: any) {
    console.error('--- ERRO FATAL GET /api/reservas ---', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}