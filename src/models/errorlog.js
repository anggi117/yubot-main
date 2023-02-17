const mongoose = require("mongoose");

const ErrorLog = mongoose.model("ErrorLog", {
  error: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  solved_by: {
    type: String,
    default: "",
  },
  solved_action: {
    type: String,
    default: "",
  },
});

module.exports = ErrorLog;
