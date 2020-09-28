module.exports = {
    name: "join",
    description: "Faz com que o bot entre no canal de voz que você está conectado",
    async execute(message){
        const voiceChannel =  message.member.voice.channel;
        if(!voiceChannel)
            return message.channel.send(
                "Você precisa estar conectado a um canal de voz né amigão"
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
            "Preciso de permissões para falar nesse canal"
            );
        }

        try {
            var connection = await voiceChannel.join();
        } catch (err) {
            console.log(err);
            return message.channel.send(err);
        }
    }
}