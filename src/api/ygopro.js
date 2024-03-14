require("dotenv").config();
const { ErrorLog } = require("../helpers");
const axios = require("axios");

const oneData = function (name) {
  try {
    const data = axios
      .get(`${process.env.API_YGO}/cardinfo.php?fname=${name}&format=ocg`)
      .then((res) => res.data.data[0]);

    return data;
  } catch (error) {
    ErrorLog(error);
  }
};

const allData = function (name) {
  try {
    const data = axios
      .get(`${process.env.API_YGO}/cardinfo.php?fname=${name}&format=ocg`)
      .then((res) => res.data);

    return data;
  } catch (error) {
    ErrorLog(error);
  }
};

const searchById = function (id) {
  try {
    const data = axios
      .get(`${process.env.API_YGO}/cardinfo.php?id=${id}`)
      .then((res) => res.data.data[0]);

    return data;
  } catch (error) {
    ErrorLog(error);
  }
};
const randomCard = function () {
  try {
  } catch (error) {
    ErrorLog(error);
  }
};

module.exports = {
  oneData,
  allData,
  searchById,
};
