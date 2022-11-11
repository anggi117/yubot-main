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

const card = function (data) {
  if (data.type == "Monster") {
    const typeRace = `[${data.monsterType[0]} / ${data.race} / ${data.type}]`;
    const createData = {
      typeRace: typeRace,
    };
    switch (data.monsterType[0]) {
      case "Link": {
        createData.description = data.description;
      }
      case "Pendulum": {
        const pendulumEffect = data.description
          .split("[ Pendulum Effect ] ")[1]
          .split("[ Monster Effect ]")[0];

        const monsterEffect = data.description
          .split("[ Monster Effect ] ")[1]
          .split("[ Pendulum Effect ]")[0];

        const description = `**Pendulum Effect**\n${pendulumEffect}**Monster Effect**\n${monsterEffect}`;
        createData.description = description;
        break;
      }

      default: {
        createData.description = data.description;
        break;
      }
    }
    return createData;
  }
  const typeRace = `[${data.race} / ${data.type}]`;
  const createData = {
    typeRace: typeRace,
    description: data.description,
  };
  return createData;
};

const obtain = function (data) {
  let forEmbed = "";
  for (let i = 0; i < data.obtain.length; i++) {
    const datas = {
      name: data.obtain[i].source.name,
      url: data.obtain[i].source.name.split(" ").join("-"),
    };

    forEmbed += `[${datas.name}](https://masterduelmeta.com/article/sets/${datas.url})\n`;
  }
  return forEmbed;
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
    const cards = card(data);
    const convertName = encodeURIComponent(data.name);
    const obtains = obtain(data);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${data.name} ${raritysEmoji}`)
      .setURL(`https://masterduelmeta.com/cards/${convertName}`)
      .setDescription(
        `Attribute: ${data.attribute}\nLevel / Rank: ${data.level}\nATK / DEF : ${data.atk} / ${data.def}`
      )
      .setThumbnail(`https://s3.lain.dev/ygo/${ygoProData.id}.webp`)
      .addFields({
        name: cards.typeRace,
        value: cards.description,
      })
      .addFields({
        name: "**How To Obtain**",
        value: obtains,
      })
      .setTimestamp();
    // .setFooter({
    //   text: "Some footer text here",
    //   iconURL: `https://storage.googleapis.com/ygoprodeck.com/pics_artgame/${ygoProData.id}.jpg`,
    // });
    await interaction.reply({
      embeds: [embed],
    });
  },
};
