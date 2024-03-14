const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const API_KEY = process.env.GPT_API_KEY;

const configuration = new Configuration({
  apiKey: API_KEY,
});

const OpenAI = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Generate Image")
    .addStringOption((option) =>
      option.setName("image").setDescription("Generate Image").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("size").setDescription("Size image").setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices;

    if (focusedOption.name === "size") {
      choices = ["256x256", "512x512", "1024x1024"];
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
    });

    try {
      const size =
        interaction.options.getString("size") == null
          ? "256x256"
          : interaction.options.getString("size");
      const generateImage = await OpenAI.createImage({
        prompt: interaction.options.getString("image"),
        n: 1,
        size: size,
      });

      await interaction.editReply({
        content: generateImage.data.data[0].url,
      });
    } catch (error) {
      if (error.response) {
        await interaction.editReply({
          content: error.response.data.error.message,
        });
      } else {
        await interaction.editReply({
          content: error.message,
        });
      }
    }
    //   .then((Response) => {
    //     Response.data.data[0].url;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
};
