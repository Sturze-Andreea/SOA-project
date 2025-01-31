const express = require('express');
const mongoose = require('mongoose');
const consumer = require('./utils/kafka'); 
const AdoptionEvent = require('./models/adoptionEvent'); 
const socketIo = require('socket.io');
const cors = require('cors');
const http = require('http');

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const { MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));


consumer.on('message', async (message) => {
  const event = JSON.parse(message.value);
  console.log('Processing Kafka event:', event);
  io.emit('adoption-notification', JSON.parse(message.value));
  try {
    if (event.type === 'ADOPTION_CREATED') {
      const adoptionEvent = new AdoptionEvent({
        animalId: event.animalId,
        userId: event.userId,
        timestamp: new Date(),
        eventType: event.type
      });
      await adoptionEvent.save();
      console.log('Adoption event saved to analytics database:', adoptionEvent);
    }
  } catch (error) {
    console.error('Error processing Kafka event:', error);
  }
});

app.get('/events', async (req, res) => {
  try {
    const events = await AdoptionEvent.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

app.get('/adoption-count', async (req, res) => {
  try {
    const adoptionCounts = await AdoptionEvent.aggregate([
      { $group: { _id: '$animalId', count: { $sum: 1 } } },
    ]);
    res.status(200).json(adoptionCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adoption counts', error });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Analytics Service listening on port ${PORT}`));

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
server.listen(5003, () => {
  console.log('Server is listening on port 5003');
});
