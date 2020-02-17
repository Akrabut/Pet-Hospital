function errorFactory(type, message, context) {
  const error = new Error();
  error.message = message;
  error.name = type;
  error.context = context;
  return error;
}

function generateError(res, code, type, message, context) {
  return res.code(code).send({ error: errorFactory(type, message, context) });
}

module.exports = generateError;