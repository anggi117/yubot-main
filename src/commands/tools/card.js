const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ygopro = require("../../api/ygopro");
const mdm = require("../../api/masterduelmeta");

const raritys = function (rarity) {
  switch (rarity) {
    case "UR": {
      const rarityEmoji = "<:ur:959362086603997244>";
      return rarityEmoji;
    }

    case "SR": {
      const rarityEmoji = "<:sr:959368233830465547>";
      return rarityEmoji;
    }

    case "R": {
      const rarityEmoji = "<:r:959368527393996850>";
      return rarityEmoji;
    }

    case "N": {
      const rarityEmoji = "<:n:959368423786295326>";
      return rarityEmoji;
    }

    default: {
      const rarityEmoji = "";
      return rarityEmoji;
    }
  }
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Get data of card")
    .addStringOption((option) =>
      option.setName("name").setDescription("Name of card").setRequired(true)
    ),

  async execute(interaction, client) {
    const check = interaction.options.getString("name");

    const ygoProData = await ygopro(check);
    const data = await mdm(ygoProData.name);

    const raritysEmoji = raritys(data.rarity);
    console.log("=====================Ini data MD=====================");
    const convertName = encodeURIComponent(data.name);
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${data.name} ${raritysEmoji}`)
      .setURL(`https://masterduelmeta.com/cards/${convertName}`)
      .setDescription(`${data.description}`)
      .setThumbnail(
        `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${ygoProData.id}.jpg`
      )
      .addFields(
        {
          name: "Regular field title",
          value: `Card name : ${data.name}\nType : ${data.type}\nDescription : ${data.description}`,
        },
        { name: "\u200B", value: "\u200B" },
        { name: "Attack", value: `${data.atk}`, inline: true },
        { name: "Defense", value: `${data.def}`, inline: true }
      )
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${ygoProData.id}.jpg`,
      });
    await interaction.reply({
      embeds: [embed],
    });
  },
};
