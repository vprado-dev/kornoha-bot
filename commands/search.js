const search = require('yt-search');
var runningFlag = false;
module.exports ={
    name: "search",
    description: "Procura um título de um vídeo no YouTube",
    execute(message){
        if(!runningFlag){
            const args = message.content.slice('!'.length).split(/ +/);
            args.shift().toLowerCase();
            try{
                search(args.join(' '), function(err, res) {
                    runningFlag = true;
                    if(err){
                        return message.channel.send("Ocorreu um erro na procura.");  
                    } 
                    let videos = res.videos.slice(0, 5);
        
                    let resp = '';
                    for(var i in videos){
                        resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
                    }
                    resp += `\nEscolha um número entre \`1-${videos.length}\``;
                    resp += `\nOu clique no :x: para poder realizar outra busca`;
            
                    message.channel.send(resp).then(async function(sentMessage){
                        await sentMessage.react('❌');
                        const filter = (reaction, user) => {
                            return reaction.emoji.name === `❌` && (user.id === sentMessage.author.id || user.id === message.author.id);
                        };
                        sentMessage.awaitReactions(filter, { max: 2, time: 10000, errors: ['time'] })
                        .then(() =>{
                            sentMessage.edit(":x: Pesquisa encerrada");
                            collector.stop();
                            runningFlag = false;
                            return;
                        })
                        .catch(() => {
                            //Caso o tempo chegue ao limite
                            sentMessage.reactions.removeAll()
                            .then(() => {
                                sentMessage.edit(":x: Pesquisa encerrada");
                                collector.stop();
                                runningFlag = false;
                                return;
                            })
                            .catch(error => 
                            console.error('Ocorreu um erro ao limpar as reçações', error)
                            );
                        });
                        
                    });
        
                    const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0 && m.author.id === m.author.id;
                    const collector = message.channel.createMessageCollector(filter,  {max: 1, time : 10000} );
                    
                   
                    collector.videos = videos;
                    collector.once('collect', function(m){
                        let commandFile = require('./play.js');
                        message.content = `!play ${[this.videos[parseInt(m.content)-1].url]}`;
                        commandFile.execute(message);
                        runningFlag = false;
                    });

                    collector.on('end', () => {
                        runningFlag = false;
                    });

                });
                
            }catch(e){
                console.log(e);
            }
            
        }else{
            return message.channel.send("Pesquisa em andamento irmão...");
        }
    }
}
