import mongoose, { Document, Model, Schema } from "mongoose";

//atributos da sala
export interface ISala extends Document {
    _id: string;
    nome: string;
    capacidade: number;
    status: string;
    recursos: string[]; // projetor, ar-condicionado, etc...
}

//construtor da Sala (Schema)
const SalaSchema:  Schema<ISala> = new Schema({
    nome: { type: String, required: true},
    capacidade: { type: Number, required: true},
    status: { type: String, enum: ["disponivel", "indisponivel"], default: "disponivel"}, // define se a sala está ocupada ou não
    recursos: {type: [String], required: true}
})

const Sala: Model<ISala> = mongoose.models.Sala || mongoose.model<ISala>("Sala", SalaSchema);

//exporta o modelo da Sala
export default Sala;

