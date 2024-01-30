import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => {
    console.log("Connected to mongodb!")
  })
  .catch((err) => {
    console.log(err)
  })
  
const app = express()

app.use(express.json())

app.listen(process.env.LOCAL_PORT, () => {
  console.log(`Server running on port:${process.env.LOCAL_PORT}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)