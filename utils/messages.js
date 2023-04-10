let moment = require('moment'); // this package give us the real time

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
}

module.exports = formatMessage;
