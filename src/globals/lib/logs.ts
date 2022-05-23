import * as winston from 'winston';

const { combine } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  silent: false,
  // format: winston.format.cli(), // winston.format.json()
  // format: combine(label({ label: 'right meow!' }), timestamp(), prettyPrint()),
  // format: combine(splat(), simple()),
  format: combine(winston.format.colorize({ all: true }), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.verbose('verbose');
// logger.debug('debug');
// logger.silly('silly');

export default logger;
