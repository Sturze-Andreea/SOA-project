const sendEmail = require('../utils/email');

const handleAdoptionRequestCreated = async (eventData) => {
  const { userEmail, animalName } = eventData;
  await sendEmail(userEmail, userEmail, animalName);
};

module.exports = {
  handleAdoptionRequestCreated,
};
