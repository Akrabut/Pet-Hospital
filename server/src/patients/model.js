const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, required: true, index: true },
  phoneNumber: { type: String, required: true, index: true, unique: true, minlength: 5, maxlength: 20 },
  petName: { type: String, required: true, minlength: 2, maxlength: 20 },
  petType: { type: String, required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
});

schema.set('toJSON', {
  transform: (doc, patient) => {
    patient.id = patient._id.toString();
    delete patient._id;
    delete patient.__v;
  }
});

module.exports = mongoose.model('Patient', schema);