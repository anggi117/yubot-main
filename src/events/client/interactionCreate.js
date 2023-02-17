const { InteractionType } = require("discord.js");
const { ErrorLog } = require("../../helpers");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
        return;
      } catch (e) {
        await interaction.reply({
          content: "Something went wrong while executing this command...",
          ephemeral: true,
        });
        ErrorLog(e);
      }
    } else if (
      interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (e) {
        ErrorLog(e);
      }
    }
  },
};
