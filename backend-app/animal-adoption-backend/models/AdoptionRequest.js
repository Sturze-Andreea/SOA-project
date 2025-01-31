const mongoose = require('mongoose');

const AdoptionRequestSchema = new mongoose.Schema({
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  }
});

module.exports = mongoose.model('AdoptionRequest', AdoptionRequestSchema);
