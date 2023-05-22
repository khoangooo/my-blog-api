import express, { Express } from "express"
import mongoose from "mongoose"
import cors from "cors"
import todoRoutes from "./routes"
import bodyParser from "body-parser"

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(todoRoutes)

// const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const localUri: string = "mongodb://127.0.0.1:27017/demo"
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

app.get("/", (req, res) => {
  res.send({ message: 'Hello World' });
})