const client = require("../../index") 
const dbs = require('quick.db')

;

client.on("messageCreate", async (message) => {
    var config = client.config
    if(message.channel.type == "DM") return;
 
  let prefix = client.config.prefix
    if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(prefix)
     
    )
        return;
      
                
                if (message.author.bot) return;
               

              
            
            
                const [cmd, ...args] = message.content 
                    .slice(prefix.length)
                    .trim()
                    .split(/ +/g);
                const Discord = require('discord.js')
            
            
                const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()))
                if(!command) return;
                
            
            
                if (command) {  
                    if(client.config.owners.includes(message.member.id) )   {
                        
                        await command.run(client, message, args);
                        
                        

                    }else return;
                    

                    
            }
        
       })

