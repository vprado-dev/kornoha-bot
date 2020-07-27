module.exports = {
	name: 'stop',
	description: 'Exclui todas as músicas da fila',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel){
            return message.channel.send('É preciso estar conectado em um canal de voz para limpar a fila');
        }
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};