import winston from 'winston'

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
