const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
    prefix
} = require('./config.json');
var dotenv = require('dotenv');
dotenv.config();
const token = process.env.BOT_TOKEN;


const client = new Client();
client.options.http.api = "https://discord.com/api";
client.commands = new Discord.Collection();


const commandArqs = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const arq of commandArqs){
    const command = require(`./commands/${arq}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity('Novo prefixo "k!"'); //Acho que economiza uns dados da api
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
    let role = member.guild.roles.cache.find(r => r.name === "Toki");
    member.roles.add(role);
});

client.login(token);