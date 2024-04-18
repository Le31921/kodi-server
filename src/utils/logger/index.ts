import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  transports: [
    new transports.Console(),
  ],
})

export default logger