const ApiError = require('../error/ApiError');
const { Logs } = require("../models/logs");

module.exports = async function  (answer, req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
    await Logs.create({
        api: `${req.method} ${req.originalUrl}`,
        domain: `${ip}`,
        error: answer?.message || '',
    })
    if (answer instanceof ApiError) {
      next(answer);
    }
    return res.json(answer);
}