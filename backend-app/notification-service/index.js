const dotenv = require('dotenv');
const connectToRabbitMQ = require('./config/rabbitmq');
const {
  handleAdoptionRequestCreated,
} = require('./events/handlers');

dotenv.config();

const startService = async () => {
  const channel = await connectToRabbitMQ();
  const queue = 'adoption_notifications';

  await channel.assertQueue(queue);

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(queue, async (message) => {
    if (message) {
      const event = JSON.parse(message.content.toString());
      console.log('Received event:', event);

      if (event.type === 'adoption_request_created') {
        await handleAdoptionRequestCreated(event.data);
      } 

      channel.ack(message);
    }
  });
};

startService().catch((error) => {
  console.error('Error starting Notification Service:', error);
});
