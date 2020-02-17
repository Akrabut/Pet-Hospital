const Patient = require('./model');
const Appointment = require('../appointments/model');
const generateError = require('../utilities/error_helper');

async function getAll(req, res) {
  try {
    return Patient.find({}).populate('appointments');
  } catch (err) {
    generateError(res, 404, 'DatabaseError', err._message, 'getAll()');
  }
}

async function remainingBill(req, res) {
  try {
    const patient = await Patient.findOne({ phoneNumber: req.params.phone });
    const unpaid = await Appointment.find({ feePaid: false, patient: patient._id });
    return unpaid.reduce((sum, appointment) => sum += appointment.price, 0);
  } catch (err) {
    generateError(res, 404, 'DatabaseError', err._message, 'getAll()');
  }
}

async function getPatientAppointments(req, res) {
  try {
    return (await Patient
      .find({ phoneNumber: req.params.phone })
      .populate('appointments'))
      .map(patient => patient.toJSON());
  } catch (err) {
    generateError(res, 404, 'DatabaseError', err._message, 'getPatientAppointments()');
  }
}

async function newPatient(req, res) {
  try {
    const patient = await Patient.create(req.body);
    res.code(201).send(patient);
  } catch (err) {
    generateError(res, 400, 'ParameterError', err._message, 'newPatient()');
  }
}

async function updatePatient(req, res) {
  try {
    const patient = await Patient.findOne({ phoneNumber: req.params.phone });
    const updatedPatient = (await Patient
      .findOneAndUpdate(
        { phoneNumber: req.params.phone },
        {
          name: req.body.name || patient.name,
          phoneNumber: req.body.phoneNumber || patient.phoneNumber,
          petName: req.body.petName || patient.petName,
          petType: req.body.petType || patient.petType,
        })).toJSON();
    res.code(204).send(updatedPatient);
  } catch (err) {
    generateError(res, 404, 'UpdateError', err._message, 'updatePatient()');
  }
}

async function deletePatient(req, res) {
  try {
    const deleted = await Patient.findOneAndDelete({ phoneNumber: req.params.phone });
    const appointments = await Appointment.find({ patient: deleted._id });
    appointments.forEach(async app => Appointment.findByIdAndDelete(app._id));
    res.code(202).send(deleted);
  } catch (err) {
    generateError(res, 404, 'DeleteError', err._message, 'deletePatient()');
  }
}

module.exports = {
  getAll,
  remainingBill,
  getPatientAppointments,
  newPatient,
  updatePatient,
  deletePatient,
};