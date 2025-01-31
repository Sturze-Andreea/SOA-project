const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
  console.error('Error in Kafka Producer:', error);
});

const sendMessage = (topic, message) => {
  const payloads = [{ topic, messages: JSON.stringify(message) }];
  producer.send(payloads, (error, data) => {
    if (error) {
      console.error('Error sending message to Kafka:', error);
    } else {
      console.log('Message sent to Kafka:', message);
    }
  });
};

module.exports = { sendMessage };
