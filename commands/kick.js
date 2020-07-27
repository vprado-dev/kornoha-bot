
const { getUserFromMention } = require('../util/getUser')

module.exports = {
    name: 'kick',
    description: 'Kick em um usuário',
    execute(message, client){
        const split = message.content.split(/ +/);
        const args = split.slice(1);


        const member = getUserFromMention(args[0], client);

        if(!member)
        {
            return message.reply('Precisa mencionar alguém né meu parceiro');
        }

        if( !message.member.hasPermission(['KICK_MEMBERS']) ){
            return message.reply('Não é possível kickar o usuário');
        }
        return  message.guild.member(member).kick()
        .then(() => message.reply(`${member.username} Foi kickado.`))
        .catch(error => message.reply('Um erro inesperado ocorreu.'));

    }
}