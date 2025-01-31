const express = require('express');
const authenticate = require('../middleware/middleware');
const router = express.Router();
const mongoose = require('mongoose');
const AdoptionRequest = require('../models/AdoptionRequest');
const Animal = require('../models/Animal');
const User = require('../models/User');
const ObjectId = require('mongodb').ObjectId;

const { MONGO_URI } = process.env;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const amqplib = require('amqplib');
const { sendMessage } = require('../utils/kafka');


const publishEvent = async (event) => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'adoption_notifications';

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));
  console.log('Event published:', event);

  setTimeout(() => connection.close(), 1000); 
};


router.post('/', authenticate, async (req, res) => {
  const { animalId, userId } = req.body;

  try {
    const newAdoptionRequest = new AdoptionRequest({ animalId, userId });
    await newAdoptionRequest.save();

    const animal = await Animal.findOne({"_id": new ObjectId(animalId)});
    const user = await User.findOne({"_id": new ObjectId(userId)});
    const event = {
      type: 'adoption_request_created',
      data: {
        userEmail: user.email, 
        animalName: animal.name, 
      },
    };
    await publishEvent(event);

    sendMessage('adoption_events', { type: 'ADOPTION_CREATED', animalId, userId });

    res.status(201).json(newAdoptionRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating adoption request', error });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const adoptionRequests = await AdoptionRequest.find().populate('animalId');
    res.status(200).json(adoptionRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adoption requests', error });
  }
});


router.put('/adoption/:id', authenticate, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const updatedAdoptionRequest = await AdoptionRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAdoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    const event = {
      eventType: 'adoption_request_updated',
      animalId: updatedAdoptionRequest.animalId,
    };
    await publishAnalyticsEvent(event);

    res.status(200).json(updatedAdoptionRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating adoption request', error });
  }
});


router.delete('/:id', authenticate,async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdoptionRequest = await AdoptionRequest.findByIdAndDelete(id);
    if (!deletedAdoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    res.status(200).json(deletedAdoptionRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting adoption request', error });
  }
});

module.exports = router;
