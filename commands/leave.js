module.exports = {
    name: "leave",
    description: "Faz com que o bot se desconecte do canal que você está",
    async execute(message){
        const voiceChannel =  message.member.voice.channel;

        if(!voiceChannel)
            return message.channel.send(
                "Você precisa estar conectado a um canal de voz né amigão"
            );
        try {
            var connection = await voiceChannel.leave();
        } catch (err) {
            console.log(err);
            return message.channel.send(err);
        }
    }
}