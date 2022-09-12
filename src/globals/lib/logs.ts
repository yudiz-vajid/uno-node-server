/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'silly',
  format: combine(timestamp({ format: 'YY-MM-DD HH:mm:ss:SSS' }), myFormat),
});

const console_transport = new transports.Console();
const file_transport_error = new transports.File({ filename: '/var/log/mpl/info.log', level: 'error', maxsize: 100e6, maxFiles: 5 }); // sudo chmod a+w /var/log/mpl
const file_transport_info = new transports.File({ filename: '/var/log/mpl/error.log', level: process.env.LOG_LEVEL_FILE || 'silly', maxsize: 100e6, maxFiles: 5 }); // sudo chmod a+w /var/log/mpl

// adding transports
logger.add(console_transport);
logger.add(file_transport_error);
logger.add(file_transport_info);

export default logger;
