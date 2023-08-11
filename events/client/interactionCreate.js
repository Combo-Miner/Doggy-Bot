const client = require("../../index");
const db = require("quick.db")

client.on("interactionCreate", async (interaction) => {
    
    if (interaction.isCommand()) {
        
       

        const cmd = client.slashCommands.get(interaction.commandName);
        
        if (!cmd)  return interaction.followUp({ content: "Une erreur c'est produite" ,ephemeral : true});
           

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        let user = interaction.user
        let message = interaction
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
   
        if(cmd.name !== "help"){
            if(db.get(`owners_${message.guild.id}_${user.id}`) == true || interaction.user.id == message.guild.ownerId || client.config.owners.includes(user.id)){

            }else {
                return interaction.reply({content : "Vous n'êtes autorisé a éxécuter cette commande",ephemeral : true})
            }
        }
        await interaction.deferReply({ephemeral : true})


        cmd.run(client, interaction, args);
    }

});