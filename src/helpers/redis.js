const redis = require("redis");
const client = redis.createClient(6379);
const ErrorLog = require("./errorlog");

client.connect();

const setKey = async function (key, name) {
  try {
    client.setEx(key, 3600, name); // just 1 minute
  } catch (error) {
    console.log(error);
  }
};

const getKey = async function (key) {
  try {
    const data = client.get(key);
    return data;
  } catch (error) {
    ErrorLog(error);
  }
};

module.exports = {
  setKey,
  getKey,
};
