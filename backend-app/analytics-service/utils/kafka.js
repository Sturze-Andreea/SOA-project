const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(
  client,
  [{ topic: 'adoption_events', partition: 0 }],
  { autoCommit: true }
);

consumer.on('message', (message) => {
  console.log('Received message from Kafka:', JSON.parse(message.value));
});

consumer.on('error', (error) => {
  console.error('Error in Kafka Consumer:', error);
});

module.exports = consumer;
