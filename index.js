const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
    prefix
} = require('./config.json');
var dotenv = require('dotenv');
dotenv.config();
const token = process.env.BOT_token;


const client = new Client();
client.commands = new Discord.Collection();



const commandArqs = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const arq of commandArqs){
    const command = require(`./commands/${arq}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Pronto!');
});

client.once('reconnecting', () =>{
    console.log('Reconectando...');
});

client.once('disconnect', () =>{
    console.log('Desconectando...');
});


client.on('message', async message =>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const nomeComando = args.shift().toLowerCase();
    const comando = client.commands.get(nomeComando);
    
    if(message.author.bot){
        return;
    }
    if( !message.content.startsWith(prefix) ){
        return;
    }

    try{
        if(nomeComando == "kick" || nomeComando == "userinfo"){
            comando.execute(message, client);
        }else if(nomeComando == "search"){
            comando.execute(message, args);
        }else{
            comando.execute(message);
        }
    }catch (erro){
        console.error(erro);
        message.reply('Não foi possível executar o comando.');
    }
});

client.login(token);