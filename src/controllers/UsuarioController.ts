import connectMongo from "../service/mongodb";
import Usuario, {IUsuario} from "../models/Usuario";


//getAll para obter todos os usuários
export const getAllUsuario = async() =>{
    await connectMongo(); //garante que a conexão com o mongoDB está estabelecida
    const usuarios = await Usuario.find([]);// busca todos os usuários no banco de dados
    return usuarios;
};

//getOne para obter um usuário pelo ID
export const getOneUsuario = async (id:string) =>{
    await connectMongo(); 
    const usuario = await Usuario.findById(id); // busca o usuário pelo ID
    return usuario;
};

// create para criar um novo Usuário
export const createUsuario = async(data: Partial<IUsuario>) => {
    await connectMongo();
    const novoUsuario = new Usuario(data); // cria uma nova instância do Usuário
    const novoUsuarioId = novoUsuario.save(); // salva o novo Usuário no banco de dados
    return novoUsuarioId; // retorna o ID do novo Usuário criado
};

// update para atualizar um Usuário existente
export const updateUsuario = async(id: string, data: Partial<IUsuario>) => {
    await connectMongo();
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, data, {new:true}); //atualiza o Usuário pelo ID
    return usuarioAtualizado;
};

// delete para remover um usuário pelo ID
export const deleteUsuario = async (id:string) => {
    await connectMongo();
    await Usuario.findByIdAndDelete(id); // remove o Usuário pelo ID
};

//método para autenticar o usuário (login) a senha é comparada com a criptografada
export const autenticarUsuario = async (email: string, senha: string) => {
    await connectMongo();
    //buscar o usuário pelo email, incluido a senha
    const usuario = await Usuario.find({email}).select("+senha");
    //se não encontrar o usuário
    if(!usuario || usuario.length == 0) return null;
    // se encontrar, comparar a senha
    const senhaSecreta = await usuario[0].compareSenha(senha); //booleana
    if(!senhaSecreta) return null; //senha incorreta
    // se deu certo, retorna o usuário
    return usuario[0];
}