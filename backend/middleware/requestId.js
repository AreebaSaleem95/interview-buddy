const crypto = require('crypto');

/**
 * Ensures each request has X-Request-Id for tracing (propagates inbound id if present).
 */
function requestId(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const id =
    typeof incoming === 'string' && incoming.trim().length > 0
      ? incoming.trim().slice(0, 128)
      : crypto.randomUUID();

  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = requestId;
