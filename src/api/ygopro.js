require("dotenv").config();
const axios = require("axios");
module.exports = (name) => {
  try {
    const data = axios
      .get(`${process.env.API_YGO}/cardinfo.php?fname=${name}&format=tcg`)
      .then((res) => res.data.data[0]);

    return data;
  } catch (error) {
    console.log(error);
  }
};
