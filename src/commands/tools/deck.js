const fs = require("fs");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { searchById } = require("../../api/ygopro");
const masterduelmeta = require("../../api/masterduelmeta");
const { ErrorLog, readYdk, createDeck } = require("../../helpers");

const parseCardId = async function () {
  try {
    const mainDeck = readYdk.main;
    // let dataDeck = [];
    const dataDeck = await Promise.all(
      mainDeck.map(async (deck) => {
        const card = await searchById(deck);

        const createDataDeck = {
          id: card.id,
          name: card.name,
          image_url: card.card_images[0].image_url,

        };

        return createDataDeck;
      })
    );

    await createDeck(dataDeck);
  } catch (error) {
    ErrorLog(error);
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deck")
    .setDescription("Get recommended deck by name deck")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Example : Branded Tearlaments")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  
  /**
   * autocomplete for show list choices when slash command used
   */
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused(); // Get interaction what user type
    const choices = ["Deck 1", "Deck 2"]; // List Choice
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    ); // Filter choice value when user type or we can call it search choice
    await interaction.respond(
      filtered.map((choice) => ({
        name: choice,
        value: choice,
      })) // Respond bot will showing list choice
    );
  },

  async execute(interaction, client) {
    await interaction.reply({ content: "Waiting for processing deck" });
    await parseCardId();
    const embed = new EmbedBuilder()
      //   .setThumbnail(
      //     "https://s3.duellinksmeta.com/cards/60c2b3aca0e24f2d54a535f9_w420.webp"
      //   )
      .setTitle("Deck Runick Spright Fur Hire")
      .setDescription("Example deck")
      .setImage("attachment://deck_image.png");

    await interaction.deleteReply();
    await interaction.channel.send({
      embeds: [embed],
      files: ["deck_image.png"],
    });
  },
};
