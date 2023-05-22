
const {MessageEmbed, MessageActionRow, MessageButton,MessageSelectMenu,Client,CommandInteraction } = require('discord.js');
const Discord = require('discord.js')

const db = require("quick.db")
module.exports = {
    name: "setlogs",
    description: "Permet de configuré les logs",
    category : "utility",
    options : [{
        name : "salon",
        type : "CHANNEL",
        description : "le salon ou je dois envoyer les logs",
       required : false,
    }],
   /**
    * 
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */
    run: async (client, interaction) => {
      let message = interaction
      let channel = interaction.options.getChannel("salon")
      if(!channel)  channel = interaction.channel
      db.set(`${message.guild.id}.voclog`, channel.id)
      message.followUp(`Le salon ${channel} sera maintenant **utilisé pour envoyer les logs**`)
       
    }}