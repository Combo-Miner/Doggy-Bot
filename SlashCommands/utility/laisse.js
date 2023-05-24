const { Client, Message, MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name : "laisse",
  category : "utility",
  description: "Permet de configurer les suggestion",
  

  options: [{
    name : "add",
    type : "SUB_COMMAND",
    description : "Permet d'attacher une personne en laisse",

    options : [{
      name : "user",
      type : "USER",
      description : "La personne a mettre en laisse",
      required : true
    }]

  },{
    name : "force-remove",
    type : "SUB_COMMAND",
    description : "Permet de force remove un utilisateur en laisse",
    options : [{
      name : "user",
      type : "USER",
      description : "La personne a enlever en laisse",
      required : true
    }]
  }, {
    name : "remove",
    type : "SUB_COMMAND",
    description : "Permet d'enlever une personne en laisse",
    options : [{
      name : "user",
      type : "USER",
      description : "La personne a enlever en laisse",
      required : true
    }]
  },{
    name : "list",
    type : "SUB_COMMAND",
    description : "Permet de voir la liste des utilisateur en laisse"
  }],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client,interaction,args) => {
    const footer = client.user.username
    const color = client.config.color
    const config = client.config
    const [SubCmd] = args
    let message = interaction
  
    let logs = db.get(`${message.guild.id}.voclog`)

    if (args[0] == 'list') {

        const data = db.all().filter(data => data.ID.startsWith(`toutou_${message.guild.id}`)).sort((a, b) => b.data - a.data)
        const count = 15;
        let p0 = 0;
        let p1 = count;
        let page = 1;

        let embed = new MessageEmbed()
        embed.setTitle(`Liste des toutous`)
            .setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
            .setColor(color)
            .setDescription(data
                .slice(p0, p1).map((m, c) => `> :guide_dog: \`Utilisateur\` : <@${m.ID.split("_")[2]}> (\`${m.ID.split("_")[2]}>\`)\n> <:default:1020027688133595197> \`Maître\` : <@${m.ID.split("_")[3]}> (\`${m.ID.split("_")[3]}\`)`).join("\n\n") || "Aucune personne");
        const msg = await message.channel.send({ content: `.` });
        interaction.followUp({content : "Envoyé",ephemeral : true})

        if (data.length > count) {
            const btn = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId(`laisse1_${message.id}`)
                    .setLabel('◀')
                    .setStyle('PRIMARY'))
                .addComponents(new MessageButton()
                    .setCustomId(`laisse2_${message.id}`)
                    .setLabel('▶')
                    .setStyle('PRIMARY'));
            msg.edit({ embeds: [embed], components: [btn] });
            setTimeout(() => {
                message.delete();
                return msg.delete();
            }, 60000 * 5);

            const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 * 5 });
            collector.on("collect", async interaction => {
                if (interaction.user.id !== message.member.id) return;
                interaction.deferUpdate()

                if (interaction.customId === `laisse1_${message.id}`) {
                    if (p0 - count < 0) return;
                    if (p0 - count === undefined || p1 - count === undefined) return;

                    p0 = p0 - count;
                    p1 = p1 - count;
                    page = page - 1

                    embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                        .setDescription(data
                            .slice(p0, p1).map((m, c) => `<@${m.ID.split("_")[2]}> toutou de <@${m.ID.split("_")[3]}> `).join("\n") || "Aucune personne");
                    msg.edit({ content : null,embeds: [embed] });
                }
                if (interaction.customId === `laisse2_${message.id}`) {
                    if (p1 + count > data.length + count) return;
                    if (p0 + count === undefined || p1 + count === undefined) return;

                    p0 = p0 + count;
                    p1 = p1 + count;
                    page++;

                    embed.setFooter({ text: `${page} / ${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)}` })
                        .setDescription(data
                            .slice(p0, p1).map((m, c) => `<@${m.ID.split("_")[2]}> toutou de <@${m.ID.split("_")[3]}> `).join("\n") || "Aucune personne");
                    msg.edit({content : null, embeds: [embed] });
                }
            })
        } else {
            msg.edit({ content : null,embeds: [embed] })
        }

        return
    }

    if (SubCmd == 'force-remove') {

      let member =message.guild.members.cache.get( interaction.options.getUser("user").id)

        let data = db.all().filter(d => d.ID.startsWith("toutou_" + message.guild.id + "_" + member.id)).map(r => r.ID).toString()
        if (data) {
            let userMissing = data.split("_")[3].toString()
            db.delete("toutou_" + message.guild.id + "_" + member.id + "_" + userMissing)

            const embed = new MessageEmbed().setDescription(`🦮 L'utilisateur <@${member.id}> (\`${member.id}\`) a été détaché de force !`).setColor(color)
            message.followUp({ embeds: [embed] })
            member.setNickname(null).catch(() => { })
            return
        }
        else {
            const embed = new MessageEmbed().setDescription(`<@${member.id}> n'est pas en laisse !`).setColor(color)
            message.followUp({ embeds: [embed] })
            return
        }
    }

    if (SubCmd == 'remove') {


        let member =message.guild.members.cache.get( interaction.options.getUser("user").id)

        let data = db.all().filter(d => d.ID.startsWith("toutou_" + message.guild.id + "_" + member.id)).map(r => r.ID).toString()
        if (data) {
            let userMissing = data.split("_")[3].toString()
            await member.setNickname(null)
            db.delete("toutou_" + message.guild.id + "_" + member.id + "_" + userMissing)
            const embed = new MessageEmbed().setDescription(`🦮 L'utilisateur <@${member.id}> (\`${member.id}\`) n'est plus votre toutou !`).setColor(color)
            message.followUp({ embeds: [embed] })
            member.setNickname(null).catch(() => { })


            if (logs) {

                const embed = new MessageEmbed()
                    .setTitle(`<a:delete:1016710010669105215> Toutou detaché(e)`)
                    .setTimestamp()
                    .setColor(color)
                    .setFooter(footer)
                    .setDescription(`
**Ancien maitre** <@${message.member.id}> 
\`\`\`diff
- Utilisateur : ${member.user.tag}
- ID : ${member.id}\`\`\`
                `)

                client.channels.cache.get(logs).send({ embeds: [embed] })
            }

        } else {
            const embed = new MessageEmbed().setDescription(`<@${member.id}> n'est pas en laisse !`).setColor(color)
            message.followUp({ embeds: [embed] })
            return
        }

        return
    }

    if (SubCmd === "add") {

        let member =message.guild.members.cache.get( interaction.options.getUser("user").id)
        if(check(member.id,message.member.id,interaction) === false) return;

       
        let data = db.all().filter(r => r.ID.startsWith("toutou_" + message.guild.id + "_" + member.id)).map(r => r.ID).toString()

        if (data) {
            const embed = new MessageEmbed().setDescription(`<@${member.id}> a déjà un maître !`).setColor(color)
           await  message.followUp({ embeds: [embed] })
            return
        }
        await member.setNickname(`🦮${member.user.username}(👑${message.member.user.username})`).catch(e=> false)
        const embed = new MessageEmbed().setDescription(`🦮 L'utilisateur ${member} (\`${member.id}\`) est devenu votre toutou !`).setColor(color)
        message.followUp({ embeds: [embed] })
        db.set("toutou_" + message.guild.id + "_" + member.id + "_" + message.member.id, true)
        if (member.voice.channel) {
            if (message.member.voice.channel) {
                member.voice.setChannel(message.member.voice.channelId)

            }
        }

        if (logs) {

            const embed = new MessageEmbed()
                .setTitle(`<:valid:1012776943218851932> Nouveau toutou`)
                .setTimestamp()
                .setColor(color)
                .setFooter(footer)
                .setDescription(`
**Nouveau maitre** <@${message.member.id}> 
\`\`\`css
+ Utilisateur : ${member.user.tag}
+ ID : ${member.id}\`\`\`
            `)

            client.channels.cache.get(logs).send({ embeds: [embed] })
        }

    }
    }   

  
}



function check(id,author,i) {
    if(id == author) {
        i.followUp({content : "Vous ne pouvez pas vous laisse vous même",ephemeral : true})
        return false;
    }
    let owners = db.get(`owners_${i.guild.id}_${id}`) || i.guild.ownerId == id;
    if(owners == true){
          i.followUp({content : "Vous ne pouvez pas laisse un owner",ephemeral : true})
        return false;
        }
    return true;
    
    
}