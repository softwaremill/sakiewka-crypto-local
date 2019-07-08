import winston from 'winston'

const winstonDailyRotateFile = require('winston-daily-rotate-file')
const expressWinston = require('express-winston')

const files = new winston.transports.File({ filename: 'logs/combined.log' })
const console = new winston.transports.Console()

const logger = winston.createLogger({
  transports: [],
  format: winston.format.json()
})

switch (process.env.NODE_ENV) {
  case 'production':
    logger.add(files)
    break
  case 'dev':
    logger.add(console)
    break
  case 'test':
    logger.add(console)
    break
  default:
    logger.add(console)
}

export default logger

const requestConsoleLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple(),
  winston.format.printf(
    (info: any) => `${info.timestamp} ${info.level}: [${info.meta.correlationId}] ${info.message}`
  )
)

export const winstonRequestsLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({ format: requestConsoleLogFormat }),
    new winstonDailyRotateFile({
      filename: './logs/access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    }),
    new winstonDailyRotateFile({
      format: winston.format.json(),
      filename: './logs/json-access-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    })
  ],
  expressFormat: true,
  format: requestConsoleLogFormat,
  meta: true,
  dynamicMeta: (req: any) => {
    return {
      correlationId: req.correlationId()
    }
  }
})
