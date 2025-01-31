const amqplib = require("amqplib");

const connectToRabbitMQ = async () => {
  let retries = 5;
  while (retries) {
    try {
      const connection = await amqplib.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      console.log("Connected to RabbitMQ");
      return channel;
    } catch (err) {
      console.error("Error connecting to RabbitMQ:", err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

module.exports = connectToRabbitMQ;
