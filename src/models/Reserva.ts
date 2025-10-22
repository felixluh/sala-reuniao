import mongoose, { Document, Model, mongo, Schema} from "mongoose";

//atributos da Reserva
export interface IReserva extends Document {
    _id: string;
    salaId: string;
    usuarioId: string;
    data: Date; // formato "yyyy-mm-dd"
    horarioInicio: Date; // formato "HH:mm"
    horarioFim: Date; // formato "HH:mm"
    motivo: string;
    status: string;
}

interface IReservaModel extends Model<IReserva>{
    checkConflict(salaId:string, data:Date, horarioInicio:Date, horarioFim:Date):Promise<boolean>;
}

//construtor da Reserva (Schema)
const ReservaSchema: Schema<IReserva> = new Schema({
    salaId: { type: String, required: true},
    usuarioId: { type: String, required: true},
    data: { type: Date, default: Date.now, required: true},
    horarioInicio: { type: Date, required: true},
    horarioFim: { type: Date, required: true},
    motivo: { type: String, required: true},
    status: {type: String, enum: ["pendente", "confirmada", "cancelada"], default: "confirmada"}
})

const Reserva: Model<IReserva> = mongoose.models.Reserva || mongoose.model<IReserva>("Reserva", ReservaSchema);

//exporta o modelo da Reseva
export default Reserva;

