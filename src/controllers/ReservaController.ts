import Reserva, {IReserva} from "../models/Reserva";
import connectMongo from "../service/mongodb";

//getAll
export const getAllReserva = async() =>{
    await connectMongo();
    const reserva = await Reserva.find(); //busca todas as reservas
    return reserva;
};

//getone
export const getOneReserva = async(id:string) =>{
    await connectMongo();
    const reserva = await Reserva.findById(id); // busca uma reserva
    return reserva;
};

//create
export const createReserva = async(data: Partial<IReserva>) =>{
    await connectMongo();
    const novaReserva = new Reserva(data); // cria um usuario a partir do Schema
    const novaReservaId = novaReserva.save();
    return novaReservaId; //retorna o novo usuário já com o ID
};

//update
export const updateReserva = async(id:string, data: Partial<IReserva>) =>{
    await connectMongo();
    const ReservaAtualizado = await Reserva.findByIdAndUpdate(id, data, {new:true});
    return ReservaAtualizado; //retorna o novo usuário Atualizado
};

//delete
export const deleteReserva = async(id: string) =>{
    await connectMongo();
    await Reserva.findByIdAndDelete(id);
};