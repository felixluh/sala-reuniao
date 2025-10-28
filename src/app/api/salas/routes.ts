import { NextResponse } from 'next/server';
import dbConnect from '@/services/mongodb';
import Room from '../../../models/Salas'; 

export async function GET() {
  try {
    await dbConnect();

    const rooms = await Room.find({}).sort({ name: 1 }); 
    
    return NextResponse.json(rooms);

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
   
    const { name, capacity, features } = body; 

   
    if (!name || !capacity) {
      return NextResponse.json(
        { message: 'Nome e capacidade são obrigatórios.' },
        { status: 400 }
      );
    }

    
    const newRoom = new Room({
      nome: name,           
      capacidade: capacity, 
      recursos: features || []  
    });

    
    const savedRoom = await newRoom.save();
    return NextResponse.json(savedRoom, { status: 201 });

  } catch (error: any) {
   
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Já existe uma sala com este nome.' },
        { status: 409 } 
      );
    }

    console.error('--- ERRO FATAL NA API POST /api/rooms ---');
    console.error(error);
    console.error('------------------------------------------');
    
    return NextResponse.json(
      { message: 'Erro ao criar a sala.', error: error.message }, 
      { status: 500 }
    );
  }
}