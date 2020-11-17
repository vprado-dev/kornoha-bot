module.exports = {
	name: 'stop',
	description: 'Exclui todas as músicas da fila - ***Temporariamente desabilitado***',
	execute(message) {
        return(message.channel.send('Este comando está temporariamente desabilidado amigo, foi mal 😔'));
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel){
            return message.channel.send('É preciso estar conectado em um canal de voz para limpar a fila');
        }
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};