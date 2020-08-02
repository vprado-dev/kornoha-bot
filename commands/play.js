const ytdl = require("ytdl-core");

module.exports = {
    name: "play",
    description: "Toca música no canal que você está!",
    async execute(message) {
        try {
          const args = message.content.split(" ");
          const queue = message.client.queue;
          const serverQueue = message.client.queue.get(message.guild.id);
    
          const voiceChannel = message.member.voice.channel;
          if (!voiceChannel)
            return message.channel.send(
              "Você precisa estar conectado a um canal de voz né amigão"
            );
          const permissions = voiceChannel.permissionsFor(message.client.user);
          if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
              "Preciso de permissões para falar nesse canal"
            );
          }
    
          const songInfo = await ytdl.getInfo(args[1]);
          const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          };
    
          if (!serverQueue) {
            const queueContruct = {
              textChannel: message.channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
            };
    
            queue.set(message.guild.id, queueContruct);
    
            queueContruct.songs.push(song);
    
            try {
              var connection = await voiceChannel.join();
              queueContruct.connection = connection;
              this.play(message, queueContruct.songs[0]);
            } catch (err) {
              console.log(err);
              queue.delete(message.guild.id);
              return message.channel.send(err);
            }
          } else {
            serverQueue.songs.push(song);
            return message.channel.send(
              `${song.title} foi adicionada a fila!`
            );
          }
        } catch (error) {
          console.log(error);
          message.channel.send(error.message);
        }
      },
    
      play(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);
    
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
    
        const dispatcher = serverQueue.connection
          .play( ytdl(song.url, {filter : 'audioonly'}) )
          .on("finish", () => {
            serverQueue.songs.shift();
            this.play(message, serverQueue.songs[0]);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Tocando... **${song.title}**`);
      }
};