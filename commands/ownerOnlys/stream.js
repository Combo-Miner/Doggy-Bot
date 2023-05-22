const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "stream",
    helpname : "stream <contenu>",
    description: "Permet de changer le statut du bot en stream",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
       
        if (args.length) {
            let str_content = args.join(" ")
            client.user.setActivity(str_content, {
                type: "STREAMING",
                url: "https://www.twitch.tv/ez"
              })

    return message.channel.send(` ${message.author}, Vous avez définis le statut de votre bot en \`${str_content}\``)
    .catch(e => { message.channel.send(` ${message.author}, Une erreur est survenue. \n \`Plus d'informations:\` \`🔻\` \`\`\`${e}\`\`\``); });
    
    } else {
        message.channel.send(` ${message.author}, Vous avez fournie aucune valeur.`);
        }
    }



    } 
