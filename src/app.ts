import http from 'http'
import express, { Application } from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import Controller from '@utils/interfaces/controller.interface'
import HttpException from '@utils/exceptions/http.exception'

import ErrorMiddleware from '@middleware/error.middleware'

class App {
  public port: number
  public express: Application
  private whitelist: string[]
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | null

  constructor(port: number, controllers: Controller[]) {
    this.port = port
    this.express = express()
    this.whitelist = [ // Allowed origins.
      'http://localhost:3000',
      'https://app.fyntrax.com'
    ]
    this.server = null

    // Initialize application resources. 
    this.initDatabaseConnection()
    this.initMiddleware()
    this.initControllers(controllers)
    this.initErrorHandling()
  }

  /** Connect to database. */
  private initDatabaseConnection = async (): Promise<void> => {
    const { MONGO_URI } = process.env

    const connection = await mongoose.connect(MONGO_URI as string)
    
    if (connection) {
      console.log('MongoDB connected...')
    }
  }

  /** Initialize app middleware. */
  private initMiddleware = (): void => {
    this.express.use(cors(
      {
        credentials: true,
        origin: (origin, callback) => {
          if (this.whitelist.includes(origin as string) || !origin) {
            callback(null, true)
          } else {
            callback(new HttpException(401, 'Access not allowed by CORS.'))
          }
        }
      }
    )) // Allows external requests.
    this.express.use(helmet()) // Secures requests.
    this.express.use(cookieParser()) // Allow cookies.
    this.express.use(morgan('dev')) // Logger.
    this.express.use(express.json()) // Allows json.
    this.express.use(express.urlencoded({ extended: false })) // Allows form data.
    this.express.use(compression()) // Compresses requests.
  }

  /** Initialize controllers. */
  private initControllers = (controllers: Controller[]): void => {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router) // Path included in controller definition. 
    })
  }

  /** Initialize error handling. */
  private initErrorHandling = (): void => {
    this.express.use(ErrorMiddleware)
  }

  /** Start server. */
  public start = (): void => {
    this.server = http.createServer(this.express)
    this.server.listen(this.port, () => console.log(`App running on http://localhost:${this.port}...`))
  }
}

export default App