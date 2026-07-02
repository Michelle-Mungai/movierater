// src/utils/logger.js

const morgan = require("morgan");

const stream = {
  write: (message) => {
    console.log(message.trim());
  },
};

module.exports = morgan(
  ":method :url :status :response-time ms",
  {
    stream,
  }
);