const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Animal = require('../models/Animal');

const { MONGO_URI } = process.env;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

router.post('/', async (req, res) => {
  const { name, breed, age, description, image } = req.body;

  try {
    const newAnimal = new Animal({ name, breed, age, description, image });
    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating animal listing', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching animal listings', error });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, breed, age, description, image } = req.body;

  try {
    const updatedAnimal = await Animal.findByIdAndUpdate(
      id,
      { name, breed, age, description, image },
      { new: true }
    );
    if (!updatedAnimal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(200).json(updatedAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating animal', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAnimal = await Animal.findByIdAndDelete(id);
    if (!deletedAnimal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.status(200).json(deletedAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting animal', error });
  }
});

module.exports = router;
