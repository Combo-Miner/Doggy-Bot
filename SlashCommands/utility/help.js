
const {MessageEmbed, MessageActionRow, MessageButton,MessageSelectMenu,Client,CommandInteraction } = require('discord.js');
const Discord = require('discord.js')

const db = require("quick.db")
module.exports = {
    name: "help",
    description: "Permet de configuré les logs",
    category : "utility",
    
   /**
    * 
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */
    run: async (client, interaction) => {
      let message = interaction
      let embed = new Discord.MessageEmbed().setColor(client.config.color).setTitle("📒 Liste des commandes")
      .addField("/laisse add","Permet d'attacher une personne en laisse")
      .addField("/laisse remove","Permet d'enlever une personne en laisse")
      .addField("/laisse force-remove","Permet de force remove un utilisateur en laisse")
      .addField("/laisse list","Permet de voir la liste des utilsateur en laisse")
      .addField("/setlogs","Permet de configuré les logs de laisse")
      .addField("/owner add","Permet d'ajouter un owner du bot")
      .addField("/owner remove","Permet de retirer un owner du bot")
      .addField("/owner clear","Permet de clear tout les owners du bot")
      .addField("/owner list","Permet de voir la liste des owners du bot")
      .addField("/help","Permet de voir la liste des commandes disponible sur le bot")
      .setFooter({iconURL : message.guild.iconURL(),text: message.guild.name.toString()})
      message.followUp({embeds : [embed]})
       
    }}