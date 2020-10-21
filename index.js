const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
    prefix
} = require('./config.json');
var dotenv = require('dotenv');
dotenv.config();
const token = process.env.BOT_token;


const client = new Client();
client.options.http.api = "https://discord.com/api"
client.commands = new Discord.Collection();


const commandArqs = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const arq of commandArqs){
    const command = require(`./commands/${arq}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    // client.user.setActivity("!help para ver os comandos"); Acho que economiza uns dados da api
    console.log('Pronto!');
});

client.once('reconnecting', () =>{
    console.log('Reconectando...');
});

client.once('disconnect', () =>{
    console.log('Desconectando...');
});


client.on('message',async message =>{
    const args = message.content.slice(prefix.length).split(/ +/);
    const nomeComando = args.shift().toLowerCase();
    const comando = client.commands.get(nomeComando);
    if(message.author.bot){
        return;
    }
    if( !message.content.startsWith(prefix) ){
        return;
    }
    //ECONOMIZAR DADOS DA API HEROKU
    // if(message.channel.name != "comandos"){ 
    //     return message.reply("Comando é no canal comandos né meu brother")
    //     .then(msg =>{
    //         msg.delete({ timeout: 5000 });
    //     });
    // }
    try{
        if(nomeComando == "kick" || nomeComando == "userinfo" || nomeComando == "vtnc" ||
          nomeComando == "poll" || nomeComando == "pickwin"){
            comando.execute(message, client);
        }else{
            comando.execute(message);
        }
    }catch (erro){
        console.error(erro);
        message.reply('Não foi possível executar o comando.');
    }
});

client.on('guildMemberAdd', member =>{
    console.log(`User: ${member.user.username} has joined in the server!`);
});

client.login(token);