module.exports = {
    name : "pause",
    description : "Pausa a música que está tocando - ***Temporariamente desabilitado***",
    execute(message){
        return(message.channel.send('Este comando está temporariamente desabilidado amigo, foi mal 😔'));
        message.react('⏸️');
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