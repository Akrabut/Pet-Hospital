const mongoose = require('mongoose');

const schema = mongoose.Schema({
  startTime: { type: String, required: true, minlength: 5, maxlength: 5 },
  endTime: { type: String, required: true, minlength: 5, maxlength: 5 },
  date: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  feePaid: { type: Boolean, default: false, index: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', index: true },
});

schema.index({ startTime: 1, patient: 1 }, { unique: true });

schema.set('toJSON', {
  transform: (doc, appointment) => {
    appointment.id = appointment._id.toString();
    delete appointment._id;
    delete appointment.__v;
  }
});

module.exports = mongoose.model('Appointment', schema);