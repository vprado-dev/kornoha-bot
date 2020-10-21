const Discord = require('discord.js');
const emotes = [":one:",":two:",":three:",":four:",":five:",":six:",":seven:",":eight:",":nine:"];
const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟' ];
const movieRegex = RegExp(/"(.*?)"/);
module.exports = {
    name: "poll",
    description: "Faz uma enquete do tema de sua preferência - Uso exclusivo do dono do servidor",
    execute(message, client){
        const split = message.content.split(movieRegex);
        const args = split.slice(1).filter(e => String(e).trim());
        let txt = '';
        const channel = client.channels.cache.get('768105809552211999');
        if( message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true }) ){
            if(args.length>9){
                return message.channel.send("Limite de filmes da votação excedido!");
            }
            const movies = createJson(args);
            for(var property in movies[0]){
                txt += `\n${property} - ${movies[0][property]}`;
            }
            const pollEmbed = new Discord.MessageEmbed()
            .setColor('#2dea1b')
            .setAuthor('Votação KNH Filmes', 'https://images-ext-1.discordapp.net/external/DbG1O555i2nyT8DfcVn97EYy3lFDL1GBSK8rMbMUs2s/https/i.imgur.com/Bw4O11S.png')
            .setDescription('Vote usando os **emotes**\n'+txt);
            return channel.send(pollEmbed).then(function(sentMessage){
                for(var i=0; i<Object.keys(movies[0]).length; i++) {
                    sentMessage.react(reactions[i]);
                }
            });
        }else{
            return message.channel.send("Você não possui permissao para usar esse comando!");
        }
    },
}

function createJson(args) {
    jsonObj = [];
    item = {};
    for(var i in args){
        item[emotes[i]] = args[i];
    }
    jsonObj.push(item);
    return jsonObj;
}