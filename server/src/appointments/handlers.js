const Appointment = require('./model');
const Patient = require('../patients/model');
const generateError = require('../utilities/error_helper');

async function getAll(req, res) {
  try {
    if ('unpaid' in req.query) {
      return unpaidAppointments(req, res);
    }
    return Appointment.find({}).populate('patient');
  } catch (err) {
    generateError(res, 404, 'DatabaseError', err._message, 'getAll()');
  }
}

async function unpaidAppointments(req, res) {
  try {
    return Appointment.find({ feePaid: false });
  } catch (err) {
    generateError(res, 404, 'DatabaseError', err._message, 'getAll()');
  }
}

async function newAppointment(req, res) {
  try {
    const patient = await Patient.findOne({ phoneNumber: req.body.patient.phone });
    if (!patient) throw new Error('No such patient');
    const appointment = new Appointment(req.body.appointment);
    appointment.patient = patient._id;
    appointment.save(err => { if(err) throw err; });
    patient.appointments.push(appointment._id);
    await patient.save();
    await appointment.populate('patient');
    res.code(201).send(appointment);
  } catch (err) {
    generateError(res, 400, 'ParameterError', err._message, 'newAppointment()');
  }
}

async function updateAppointment(req, res) {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id }).populate('patient');
    const updated = (await Appointment
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          startTime: req.body.startTime || appointment.startTime,
          endTime: req.body.endTime || appointment.endTime,
          date: req.body.date || appointment.date,
          description: req.body.description || appointment.description,
          feePaid: req.body.feePaid || appointment.feePaid,
          patient: appointment.patient,
        })).toJSON();
    res.code(204).send(updated);
  } catch (err) {
    generateError(res, 404, 'UpdateError', err._message, 'updateAppointment()');
  }
}

async function deleteAppointment(req, res) {
  try {
    const deleted = await Appointment.findOneAndDelete({ _id: req.params.id });
    const patient = await Patient.findById(deleted.patient);
    console.log(patient.appointments);
    patient.appointments.splice(patient.appointments.indexOf(app => app.id === deleted._id), 1);
    console.log(patient.appointments);
    await patient.save();
    res.code(202).send(deleted.toJSON());
  } catch (err) {
    generateError(res, 404, 'DeleteError', err._message, 'deleteAppointment()');
  }
}

module.exports = {
  getAll,
  newAppointment,
  updateAppointment,
  deleteAppointment,
};