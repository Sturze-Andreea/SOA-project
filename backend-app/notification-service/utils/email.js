const axios = require("axios");

const sendEmail = async (toEmail, user, animal) => {
  const url =
    "https://xjt1442kl5.execute-api.eu-north-1.amazonaws.com/dev/sendEmail";

  const data = {
    toEmail: toEmail,
    userId: user,
    animalId: animal,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = sendEmail;
