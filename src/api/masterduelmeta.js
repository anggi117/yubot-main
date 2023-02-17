const axios = require("axios");
const { ErrorLog } = require("../helpers");

module.exports = (name) => {
  try {
    const names = encodeURIComponent(name);
    const data = axios
      .get(`${process.env.API_MDM}/cards?name=${names}&sort=popRank&limit=1`)
      .then((res) => res.data);

    return data;
  } catch (error) {
    ErrorLog(error);
  }
};
