require('dotenv').config();

const server = require('fastify')({ logger: true });

// -----------ECOSYSTEM PLUGINS-----------
server.register(require('fastify-cors'));
server.register(require('fastify-helmet'));

// -----------DATABASE CONNECTORS------------
const mongoConnector = require('./utilities/mongoose');

// -----------ROUTES-----------
server.register(require('./patients/controller'), { prefix: '/api/patients' });
server.register(require('./appointments/controller'), { prefix: '/api/appointments' });

// ensure server cant accept requests before database connection has been established
(async function() {
  try {
    await mongoConnector();
    await server.listen(process.env.PORT, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
