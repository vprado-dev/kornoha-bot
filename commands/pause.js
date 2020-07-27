module.exports = {
    name : "pause",
    description : "Pausa a música que está tocando",
    execute(message){
        const serverQueue = message.client.queue.get(message.guild.id);
        if(serverQueue && serverQueue.playing){
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send("Pausado");
        }else{
            return message.channel.send("Não há músicas tocando");
        }
    }
}