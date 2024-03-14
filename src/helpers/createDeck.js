const Jimp = require("jimp");

async function createDeck(deck) {
  const cardWidth = 200;
  const cardHeight = 300;
  const cardsPerRow = 10;

  const numRows = Math.ceil(deck.length / cardsPerRow);
  const finalWidth = cardsPerRow * cardWidth;
  const finalHeight = numRows * cardHeight;

  const deckImage = new Jimp(finalWidth, finalHeight, "#ffffff");

  for (let i = 0; i < deck.length; i++) {
    const cardImage = await Jimp.read(deck[i].image_url);
    const x = (i % cardsPerRow) * cardWidth;
    const y = Math.floor(i / cardsPerRow) * cardHeight;
    deckImage.composite(cardImage.resize(cardWidth, cardHeight), x, y);
  }

  const outputFilename = "deck_image.png"; // Nama file gambar tunggal
  await deckImage.writeAsync(outputFilename);
}

module.exports = createDeck;
