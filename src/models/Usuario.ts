//classe de modelagem dos Usuários
//mongoose é a biblioteca que faz a modelagem do banco de dados MongoDB

import mongoose, {Document, Model, Schema} from "mongoose";
//importe do Bcrypt
import bcrypt from "bcryptjs";

//atributos do Usuário
export interface IUsuario extends Document {
    _id: string;
    nome: string;
    email: string;
    senha?: string; 
    funcao: string;// admin ou cliente
    compareSenha(senhaUsuario: string):Promise<boolean>
//devolve para o usuário se a senha bate com a senha criptografada

}

//construtor do Usuário (Schema)
const UsuarioSchema: Schema<IUsuario> = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true, select: false},
    funcao: {type: String, enum: ["user", "admin"], required: true}
})

//criptografia da senha antes de salvar no bamco de dados
//método para criptografar a senha
UsuarioSchema.pre<IUsuario>("save", async function (next){
    if(!this.isModified('senha') || !this.senha) return next;
    try {
        const salt = await bcrypt.genSalt(10); //torna a senha mais segura
        this.senha = await bcrypt.hashSync(this.senha, salt); //criptografa a senha
        next();
    }catch (error:any){
        next(error);
    }
});

//método para comparar a senha
UsuarioSchema.methods.compareSenha = function (senhaUsuario:string):Promise<boolean>{
    return bcrypt.compare(senhaUsuario, this.senha);
}

//toMap <=> fromMap
const Usuario: Model<IUsuario> = mongoose.models.Usuario || mongoose.model<IUsuario>("Usuario", UsuarioSchema);

//exporta o modelo do Usuário
export default Usuario;