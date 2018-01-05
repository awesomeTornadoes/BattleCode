const config = require('./config');

module.exports.sendSms = function (to, message) {
  const client = require('twilio')(config.accountSid, config.authToken);
  // console.log(client.api.messages.create())
  return client.api.messages
  .create({
      body: message,
      to,
      from: config.sendingNumber,
    }).then((data) => {
      console.log('User notified');
    }).catch((err) => {
      console.error('Could not notify user', err);
    });
};
