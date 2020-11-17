module.exports = {
    name : "resume",
    description : "Retoma a música que está tocando - ***Temporariamente desabilitado***",
    execute(message){
        return(message.channel.send('Este comando está temporariamente desabilidado amigo, foi mal 😔'));
        message.react('▶️');
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