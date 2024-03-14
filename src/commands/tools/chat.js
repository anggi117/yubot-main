const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const API_KEY = process.env.GPT_API_KEY;

const configuration = new Configuration({
  apiKey: API_KEY,
});

const OpenAi = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with Chat GPT AI")
    .addStringOption((option) =>
      option
        .setName("chat")
        .setDescription("Chat with Chat GPT AI")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    try {
      const getResponseAi = await OpenAi.createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "user",
            content: interaction.options.getString("chat"),
          },
        ],
      });
      const messageQuestion = `${interaction.options.getString("chat")}`;
      const messageSend = `${getResponseAi.data.choices[0].message.content}`;
      const embed = new EmbedBuilder()
        .setTitle(messageQuestion)
        .setDescription(messageSend);

      await interaction.followUp({
        embeds: [embed],
      });
    } catch (error) {
      if (error.response) {
        await interaction.editReply({
          content: error.response.data.error.message,
        });
      } else {
        console.log(error);
        await interaction.editReply({
          content: error.message,
        });
      }
    }

    // interaction.user.send(newMessage); //Send Message to user
  },
};
