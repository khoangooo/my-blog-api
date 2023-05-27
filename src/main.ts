import express, { Express, NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import postRoutes from "./routes/posts"
import userRoutes from "./routes/users"
import bodyParser from "body-parser"

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', postRoutes);
app.use('/api/v1', userRoutes);

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log('LOGGED', req.method, new Date())
  next()
}

app.use(myLogger)

// const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const localUri: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`

mongoose
  .connect(localUri)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })

app.get("/api/v1/", (req, res) => {
  res.send({ message: 'Hello World' });
})