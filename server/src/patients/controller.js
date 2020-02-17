const handler = require('./handlers');

async function routes(server) {
  
  server.get('/', {}, handler.getAll);
  server.get('/:phone/appointments', {}, handler.getPatientAppointments);
  server.get('/:phone', {}, handler.remainingBill);

  server.post('/', {}, handler.newPatient);

  server.put('/:phone', {}, handler.updatePatient);

  server.delete('/:phone', {}, handler.deletePatient);
}

module.exports = routes;