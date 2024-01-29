import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import userRouter from "./routes/user.route.js"

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => {
    console.log("Connected to mongodb!")
  })
  .catch((err) => {
    console.log(err)
  })
  
const app = express()

app.listen(process.env.LOCAL_PORT, () => {
  console.log(`Server running on port:${process.env.LOCAL_PORT}`)
})

app.use('/api/user', userRouter)