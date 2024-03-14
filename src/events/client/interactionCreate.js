const { InteractionType, InteractionCollector } = require("discord.js");
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
        if (e.response) {
          if (
            e.message == `Request failed with status code ${e.response.status}`
          ) {
            if (
              e.response.data.error ==
              "No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage."
            ) {
              await interaction.reply({
                content: "Card not found.",
                ephemeral: true,
              });
            } else {
              ErrorLog(e);
            }
          } else {
            ErrorLog(e);
          }

          return false;
        }
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
