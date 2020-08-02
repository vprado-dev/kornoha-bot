require('./join');
module.exports = {
    name: "leave",
    description: "Desconecta o bot do canal que você está",
    async execute(message){
        const voiceChannel =  message.member.voice.channel;
        const queue = message.client.queue;
        const guild = message.guild;
        if(!voiceChannel)
            return message.channel.send(
                "Você precisa estar conectado a um canal de voz né amigão"
            );
        try {
            connection = await voiceChannel.leave();
            queue.delete(guild.id);
        } catch (err) {
            console.log(err);
            return message.channel.send(err);
        }
    }
}