module.exports = {
    name: "skip",
    description: "Passa para a próxima música na fila - ***Temporariamente desabilitado***",
    execute(message){
        return(message.channel.send('Este comando está temporariamente desabilidado amigo, foi mal 😔'));
        const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel){
            return message.channel.send('É preciso estar conectado em um canal de voz para pular a música');  
        } 
		if (!serverQueue){
            return message.channel.send('Não há músicas para serem puladas');
        } 
		serverQueue.connection.dispatcher.end();
    },
};