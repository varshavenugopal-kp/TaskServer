// errorHandlingMiddleware.js

import  winston from 'winston'
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

function errorHandler(err, req, res, next) {
  // Log the error
  logger.error(err.message, { error: err });

  // Set the status code for the response
  res.status(500);

  // Send a JSON response with a user-friendly error message
  res.json({ error: 'Internal Server Error' });
}

export default errorHandler;
