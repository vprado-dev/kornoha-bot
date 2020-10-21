const Discord = require('discord.js');
const winnerRegex = RegExp(/"(.*?)"/);
module.exports = {
    name: "pickwin",
    description: "Escolhe um vencedor da enquete - Uso exclusivo do dono do servidor",
    execute(message, client){
        const split = message.content.split(winnerRegex);
        const arg = split.slice(1).filter(e => String(e).trim());
        const channel = client.channels.cache.get('768105809552211999');
        if( message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true }) ){
            if(arg.length > 1){
                return message.channel.send("Apenas um filme pode ser vencedor da votação!");
            }
            const winnerEmbed = new Discord.MessageEmbed()
            .setColor('ff4c56')
            .setDescription(`O filme por volta das 20h será ***${arg}***!`);
            return channel.send(winnerEmbed);
        }else{
            return message.channel.send("Você não possui permissao para usar esse comando!");
        }
        
    }
}