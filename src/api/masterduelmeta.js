require("dotenv").config();
const axios = require("axios");

module.exports = (name) => {
  try {
    const names = encodeURIComponent(name);
    const data = axios
      .get(`${process.env.API_MDM}/cards?name=${names}&sort=popRank&limit=1`)
      .then((res) => res.data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
