const ErrorLog = require("../models/errorlog");

module.exports = async (error) => {
  console.error(error);
  const data = new ErrorLog({ error: error.message });
  data.save();
};
