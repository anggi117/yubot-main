const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ygopro = require("../../api/ygopro");
const mdm = require("../../api/masterduelmeta");
const { Redis, ErrorLog } = require("../../helpers");

const choiceName = async function (name) {
  if (name.length < 3) return [];

  try {
    const data = await ygopro.allData(name);
    const promises = data.data.slice(0, 25).map((d) => d.name);
    return await Promise.all(promises);
  } catch (error) {
    if (
      error.response.data.error ==
      "No card matching your query was found in the database. Please see https://db.ygoprodeck.com/api-guide/ for syntax usage."
    ) {
      return [];
    } else {
      ErrorLog(error);
      return false;
    }
  }
};

const arrowMapping = {
  "Top-Left": "↖️",
  Top: "⬆️",
  "Top-Right": "↗️",
  Left: "⬅️",
  Right: "➡️",
  "Bottom-Left": "↙️",
  Bottom: "⬇️",
  "Bottom-Right": "↘️",
};

const rarityMapping = {
  UR: "<:ur:959362086603997244>",
  SR: "<:sr:959368233830465547>",
  R: "<:r:959368527393996850>",
  N: "<:n:959368423786295326>",
};

// function getTypeCard(data) {
//   if (data.type == "Monster") {

//   }
// }
function parseLinkArrows(arrows) {
  if (Array.isArray(arrows) && arrows.length > 0) {
    return (
      arrows
        .map((x) => arrowMapping[x])
        .join(" ")
        // Add invisible character to force mobile to show small emojis
        .concat("\u{200B}")
    );
  }
}

function parseRarity(rarity) {
  return rarityMapping[rarity];
}

const card = function (data) {
  if (data.type == "Monster") {
    if (data.monsterType.includes("Tuner")) {
      console.log("ini tuner dek");
    } else {
      console.log("ini bukan tuner dek");
    }
    const typeRace = `[ ${data.monsterType[0]} / ${data.race} / ${data.type} ]`;
    const createData = {
      typeRace: typeRace,
    };
    switch (data.monsterType[0]) {
      case "Link": {
        createData.description = data.description;
        const arrow = parseLinkArrows(data.linkArrows);
        createData.levelDesc = `Attribute: ${data.attribute}\nLink Arrow : ${arrow} \n Link Rating: ${data.linkRating}\nATK : ${data.atk}`;
        break;
      }
      case "Pendulum": {
        let pendulumEffect, monsterEffect, description;

        if (
          data.description.includes("[ Pendulum Effect ]") ||
          data.description.includes("[ Monster Effect ]")
        ) {
          [pendulumEffect, monsterEffect] = data.description.includes(
            "[ Monster Effect ]"
          )
            ? data.description
                .split("[ Pendulum Effect ]")[1]
                .split("[ Monster Effect ]")
            : data.description
                .split("[ Pendulum Effect ]")[1]
                .split("[ Flavor Text ]");

          pendulumEffect = pendulumEffect.startsWith("\r\n")
            ? `**Pendulum Effect**${pendulumEffect}`
            : `**Pendulum Effect**\r\n${pendulumEffect}`;
          subEffect = data.description.includes("[ Monster Effect ]")
            ? `**Monster Effect**`
            : `**Flavor Text**`;

          monsterEffect = monsterEffect.startsWith("\r\n")
            ? `${subEffect}${monsterEffect}`
            : `${subEffect}\r\n${monsterEffect}`;

          pendulumEffect = pendulumEffect.replace(
            /----------------------------------------/g,
            ""
          );
          description = `${pendulumEffect}${monsterEffect}`;
        } else {
          description = data.description;
        }

        createData.description = description;
        createData.levelDesc = `Attribute: ${data.attribute}\nLevel / Rank: ${data.level}\nATK / DEF : ${data.atk} / ${data.def}`;
        break;
      }

      default: {
        createData.description = data.description;
        createData.levelDesc = `Attribute: ${data.attribute}\nLevel / Rank: ${data.level}\nATK / DEF : ${data.atk} / ${data.def}`;
        break;
      }
    }
    return createData;
  }
  const typeRace = `[ ${data.race} / ${data.type} ]`;
  const createData = {
    typeRace: typeRace,
    description: data.description,
  };
  return createData;
};

const obtain = function (data) {
  if (data.obtain.length !== 0) {
    let forEmbed = "";
    for (let i = 0; i < data.obtain.length; i++) {
      const callData = {
        name: data.obtain[i].source.name,
        url: data.obtain[i].source.name.split(" ").join("-"),
      };

      forEmbed += `[${callData.name}](https://masterduelmeta.com/article/sets/${callData.url})\n`;
    }
    return forEmbed;
  }
  const forEmbed = "Not released yet";
  return forEmbed;
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Get data of card")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of card")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = await choiceName(focusedValue);

    await interaction.respond(
      choices.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction, client) {
    const checkString = interaction.options.getString("name");

    const ygoProData = await ygopro.oneData(checkString);
    const data = await mdm(ygoProData.name);
    const rarityEmoji = parseRarity(data.rarity);
    const cards = card(data);
    const convertName = encodeURIComponent(data.name);
    const obtains = obtain(data);
    const title = data.rarity ? `${data.name} ${rarityEmoji}` : data.name;
    const embed =
      data.type == "Monster"
        ? new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(title)
            .setURL(`https://masterduelmeta.com/cards/${convertName}`)
            .setDescription(cards.levelDesc)
            .setThumbnail(
              `https://images.ygoprodeck.com/images/cards/${ygoProData.id}.jpg`
            )
            .addFields({
              name: `${cards.typeRace}\r\n`,
              value: cards.description,
            })
            .addFields({
              name: "**How To Obtain**",
              value: obtains,
            })
            .setTimestamp()
        : new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(title)
            .setURL(`https://masterduelmeta.com/cards/${convertName}`)
            .setThumbnail(
              `https://images.ygoprodeck.com/images/cards_cropped/${ygoProData.id}.jpg`
            )
            .addFields({
              name: cards.typeRace,
              value: cards.description,
            })
            .addFields({
              name: "**How To Obtain**",
              value: obtains,
            })
            .setTimestamp();
    await interaction.reply({
      embeds: [embed],
    });
  },
};
