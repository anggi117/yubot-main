const ErrorLog = require("../models/errorlog");

module.exports = async (error) => {
  const data = new ErrorLog({ error: error.stack });
  data.save();
};
