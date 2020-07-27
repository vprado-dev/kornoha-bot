module.exports = {
    name : "resume",
    description : "Retoma a música que está tocando",
    execute(message){
        const serverQueue = message.client.queue.get(message.guild.id);
        if(serverQueue && !serverQueue.playing){
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send("Tocando novamente");
        }else{
            return message.channel.send("Não há músicas tocando");
        }
    }
}