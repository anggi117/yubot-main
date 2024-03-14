const fs = require("fs");
const ErrorLog = require("./errorlog");

function readFile(deck) {
  try {
    const file = fs.readFileSync(deck, "utf-8");

    const listId = parseCategory(file);
    return listId;
  } catch (error) {
    ErrorLog(error);
  }
}
function parseCategory(deck) {
  try {
    const filteredData = {};
    let currentCategory = "";

    deck.split("\n").forEach((decks) => {
      if (decks.startsWith("#")) {
        currentCategory = decks.substring(1).replace(" \r", "");

        filteredData[currentCategory] = [];
      } else if (decks.startsWith("!")) {
        currentCategory = decks.substring(1).replace(" \r", "");
        filteredData[currentCategory] = [];
      } else if (decks.trim() !== "" && currentCategory !== "") {
        filteredData[currentCategory].push(decks.trim());
      }
    });

    return filteredData;
  } catch (error) {
    ErrorLog(error);
  }
}

const deck = "assets/ydk/deck.ydk";
const readYdk = readFile(deck);

module.exports = readYdk;
