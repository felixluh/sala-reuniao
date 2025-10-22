import Sala, {ISala} from "../models/Salas";
import connectMongo from "../service/mongodb";

//getAll para as Salas
export const getAllSala = async() =>{
    await connectMongo();
    const salas = await Sala.find(); //busca todas as salas no banco de dados
    return salas;
};

//getOne
export const getOneSala = async(id:string) =>{
    await connectMongo();
    const sala = await Sala.findById(id); //busca uma sala pelo id
    return sala;
};

//create
export const createSala = async(data: Partial<ISala>) =>{
    await connectMongo();
    const novaSala = new Sala(data); //cria uma nova sala
    const novaSalaId = novaSala.save();
    return novaSalaId;
};

//update
export const updateSala = async(id:string, data: Partial<ISala>) =>{
    await connectMongo();
    const salaAtualizada = await Sala.findByIdAndUpdate(id, data, {new:true}); //atualiza a sala pelo id
    return salaAtualizada; 
};

//delete
export const deleteSala = async(id:string) =>{
    await connectMongo();
    await Sala.findByIdAndDelete(id); //deleta a sala
};