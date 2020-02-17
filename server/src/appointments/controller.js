const handler = require('./handlers');

async function routes(server) {
  server.get('/', {}, handler.getAll);

  server.post('/', {}, handler.newAppointment);

  server.put('/:id', {}, handler.updateAppointment);

  server.delete('/:id', {}, handler.deleteAppointment);
}

module.exports = routes;