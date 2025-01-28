const Discord = require("discord.js");
const { readdirSync } = require("fs");

module.exports =  {
name: Discord.Events.InteractionCreate,

  run: async(client, interaction) => {
  if(interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    readdirSync('./commands').forEach(f => {

      const cmd = require(`../commands/${f}`);

      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {

		console.log(`Komut kullandı: ${interaction.user.tag} (${interaction.user.id}) (${interaction.guild.name}) `)

       return cmd.run(client, interaction);

      }


    });



  }
}

};