import mongoose from "mongoose";

//converte string em URL
const MongoUri = process.env.DATABASE_URL;

if(!MongoUri){
    throw new Error("Define o DATABASE_URL no .env.local")
}

//criar uma variavel para armazenar a conexão
let cached = (global as any).mongoose;
//vai armazenar previamente do global do node, caso já exista uma conexão com o mongoDB

//caso não exista nenhuma conecxão previamente estabelecida
if(!cached){
    cached = (global as any).mongoose = { conectada:null, promessa: null}; 
}

//função de conexão com o mongoDB
async function connectMongo() {
    //verifica se conexão já existe, se já existe retona a conexão previamente estabelecida
    if(cached.conecteda) {
        console.log("MongoDB já estava conectada (cached).");
        return cached.conectada;
    }
    
    //verificar se existe uma promessa de conexão
    if(!cached.promessa){ // se nula
        const aguarde = {bufferCommands:false}; //desativo o buffer de comandos
        //caso não exista uma promessa de conexão cria uma nova promessa
        cached.promessa =  mongoose.connect(MongoUri!, aguarde)
        .then((mongoose)=> {
            console.log("Conectado ao MongoDB");
            return mongoose;
        });
    }
    //estabelecer a conexão aguardando a promessa
    try {
        //cria a conexão a partir da promessa que estva pendente
        cached.conectada = await cached.promessa;
    } catch (error){
        cached.promessa = null; //se der erro zera a promessa
        throw error;
    }

    return cached.conectada;
}

export default connectMongo;

