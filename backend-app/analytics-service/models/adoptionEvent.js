const mongoose = require('mongoose');

const adoptionEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  animalId: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AdoptionEvent = mongoose.model('AdoptionEvent', adoptionEventSchema);

module.exports = AdoptionEvent;
