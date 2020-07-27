const search = require('yt-search');

module.exports ={
    name: "search",
    description: "Procura um termo de um vídeo no YouTube",
    async execute(message, args){ 
        search(args.join(' '), function(err, res) {
            if(err){
                return message.channel.send("Ocorreu um erro na procura.");  
            } 
        
            let videos = res.videos.slice(0, 5);
    
            let resp = '';
            for(var i in videos){
                resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
            }
            resp += `\nEscolha um número entre \`1-${videos.length}\``;
    
            message.channel.send(resp);
    
            const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
            const collector = message.channel.createMessageCollector(filter);
    
            collector.videos = videos;
    
            collector.once('collect', function(m){
                let commandFile = require('./play.js');
                message.content = `!play ${[this.videos[parseInt(m.content)-1].url]}`;
                commandFile.execute(message);
            });
        });
    }
}
