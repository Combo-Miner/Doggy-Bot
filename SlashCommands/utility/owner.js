
const {MessageEmbed, MessageActionRow, MessageButton,MessageSelectMenu,Client,CommandInteraction } = require('discord.js');
const Discord = require('discord.js')
const db = require("quick.db")

module.exports = {
    name : "owner",
    category : "utility",
    description: "Permet de configurer les owners du bot",
    
  
    options: [{
      name : "add",
      type : "SUB_COMMAND",
      description : "Permet d'ajouter un owner",
  
      options : [{
        name : "user",
        type : "USER",
        description : "La personne a ajouter en tant que owner du bot ",
        required : true
      }]
  
    }, {
      name : "remove",
      type : "SUB_COMMAND",
      description : "Permet d'enlever un owner du bot",
      options : [{
        name : "user",
        type : "USER",
        description : "La personne a retirer des owners",
        required : true
      }]
    },{
        name : "clear",
        type : "SUB_COMMAND",
        description : "Permet de voir lclear tout les owners du bot"
      },{
      name : "list",
      type : "SUB_COMMAND",
      description : "Permet de voir la liste des owners du bot"
    }],
   
   /**
    * 
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */
    run: async (client, interaction,args) => { 
        const [ SubCmd] = args
        let message = interaction
        const color = client.config.color
        
        if(SubCmd == "add") { 
            if(message.member.id !== message.guild.ownerId) return interaction.followUp({content : "Vous n'êtes pas autorisé a faire cela",ephemeral : true})
            let user = interaction.options.getUser("user").id
           user = message.guild.members.cache.get(member)
 
        let link  = db.get(`owners_${message.guild.id}_${user.id}`)
        if(link == true) {
            return interaction.followUp(`${user.username} est déjà owner`)
        } else { 
        db.set(`owners_${message.guild.id}_${user.id}`, true)


         interaction.followUp(`${user.username} est mainteanant owner`)
    }
} else if(SubCmd == "remove")
{
    if(message.member.id !== message.guild.ownerId) return interaction.followUp({content : "Vous n'êtes pas autorisé a faire cela",ephemeral : true})
    let member = interaction.options.getUser("user").id
    member = message.guild.members.cache.get(member)
    let user = member
    let link = db.get(`owners_${message.guild.id}_${user.id}`)
    if(link == true ) {
        db.delete(`owners_${message.guild.id}_${user.id}`)
        interaction.followUp(`${user.username} n'est plus owner `)
    } else {
        interaction.followUp(`${user.username} n'est pas owner `)
    }
} else if(SubCmd == "list") {
    message.followUp({content : "Envoyé",ephemeral : true})
    const data = db.all().filter(data => data.ID.startsWith(`owners_${message.guild.id}`)).sort((a, b) => b.data - a.data)
    const count = 15;
    let p0 = 0;
    let p1 = count;
    let page = 1;

    let embed = new MessageEmbed()
    embed.setTitle(`Owner`)
        .setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
        .setColor(color)
        .setDescription(data
            // .filter(x => message.guild.members.cache.get(x.ID.split('_')[2]))
            .slice(p0, p1).map((m, c) => `<@${m.ID.split("_")[2]}> `).join("\n") || "Aucune personne");
    const msg = await message.channel.send({ allowedMentions: { repliedUser: false }, content: `.` });

    if (data.length > count) {
        const btn = new MessageActionRow()
            .addComponents(new MessageButton()
                .setCustomId(`owner1_${message.id}`)
                .setLabel('◀')
                .setStyle('PRIMARY'))
            .addComponents(new MessageButton()
                .setCustomId(`owner2_${message.id}`)
                .setLabel('▶')
                .setStyle('PRIMARY'));
        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [btn] });
        setTimeout(() => {
            message.delete();
            return msg.delete();
        }, 60000 * 5);

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 * 5 });
        collector.on("collect", async interaction => {
            if (interaction.user.id !== message.member.id) return;
            interaction.deferUpdate()

            if (interaction.customId === `owner1_${message.id}`) {
                if (p0 - count < 0) return;
                if (p0 - count === undefined || p1 - count === undefined) return;

                p0 = p0 - count;
                p1 = p1 - count;
                page = page - 1

                embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                    .setDescription(data
                        // .filter(x => message.guild.members.cache.get(x.ID.split('_')[2]))
                        .slice(p0, p1).map((m, c) => `<@${m.ID.split("_")[2]}> `).join("\n") || "Aucune personne");
                msg.edit({content : null, embeds: [embed] });
            }
            if (interaction.customId === `owner2_${message.id}`) {
                if (p1 + count > data.length + count) return;
                if (p0 + count === undefined || p1 + count === undefined) return;

                p0 = p0 + count;
                p1 = p1 + count;
                page++;

                embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                    .setDescription(data
                        // .filter(x => message.guild.members.cache.get(x.ID.split('_')[2]))
                        .slice(p0, p1).map((m, c) => `<@${m.ID.split("_")[2]}> `).join("\n") || "Aucune personne");
                msg.edit({ content : null,embeds: [embed] });
            }
        })
    } else {
        msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed] })
    }

     
} else if(SubCmd == "clear") {
    if(message.member.id !== message.guild.ownerId) return interaction.followUp({content : "Vous n'êtes pas autorisé a faire cela",ephemeral : true})
let tt = await db.all().filter(data => data.ID.startsWith(`owners_${message.guild.id}`));
interaction.followUp(`${tt.length === undefined||null ? 0:tt.length} ${tt.length > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} des owners`)


let delowner = 0;
for(let i = 0; i < tt.length; i++) {
  db.delete(tt[i].ID);
  delowner++;
}

}

      
       

    }
}