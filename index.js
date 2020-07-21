const Discord = require('discord.js');
const { prefix, token} = require('./config.json')
const client = new Discord.Client();
const ytdl  = require('ytdl-core');

const queue = new Map();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message =>{
        if( message.content.startsWith(`${prefix}kick`) )
        {
            if( message.member.hasPermission(['KICK_MEMBERS']) )
            {
                console.log('Pode banir');
                let member = message.mentions.members.first();
                member.kick().then((member) =>{
                    // message.channel.send(":wave: " + member.displayName + "\nJá vai tarde meu cria");
                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle('Foi banido, cuzao')
	                    .setAuthor('Banido Lek')
                        .setDescription('Não faça merda, pois você pode ser o próximo\nSeu fodido');
                        // .setURL('Futuro site do bot')
                    message.channel.send(exampleEmbed);
                })
            }else{
                console.log('N pode banir');
            }
        }
    
});

client.on('message', async message =>{
    if( message.content.startsWith(`${prefix}join`) )
    {
        if(message.member.voice.channel)
        {
            const connection = await message.member.voice.channel.join().then(connection => {
                message.channel.send("Estou conectado, pronto para executar comandos");
            });
            // Always remember to handle errors appropriately!
        }else{
            message.reply('Precisa ta em um canal de voz amigão');
            return;
        }
    }
    
});

//Music
client.on('message', async message =>{
    // console.log(message.content);
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const serverQueue = queue.get(message.guild.id);

        if (message.content.startsWith(`${prefix}play`)) {
            execute(message, serverQueue);
            return;
        } else if (message.content.startsWith(`${prefix}skip`)) {
            skip(message, serverQueue);
            return;
        } else if (message.content.startsWith(`${prefix}stop`)) {
            stop(message, serverQueue);
            return;
        } else {
            message.channel.send('You need to enter a valid command!')
        }
    
});


async function execute(message, serverQueue){
    const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel){
        return message.channel.send(
            "Você precisa ta num canal de voz né amigão"
            );
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) 
    {
        return message.channel.send(
        "Eu não possuo permissao para falar nesse canal"
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

    try 
    {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} foi adicionado à fila!`);
  }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Tocando: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

client.login(token);