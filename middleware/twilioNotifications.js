const twilioClient = require('../twilioClient');

function formatMessage(challenger) {
  return `You have been challenged by ${challenger}`;
}

exports.notifyOnChallenge = (challenger, phone) => {
  const messageToSend = formatMessage(challenger);
  twilioClient.sendSms('+15043430627', messageToSend);
};
