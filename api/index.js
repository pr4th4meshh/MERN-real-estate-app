import express from "express"
import mongoose from "mongoose"
import "dotenv/config"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

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
app.use(cookieParser())

app.listen(process.env.LOCAL_PORT, () => {
  console.log(`Server running on port:${process.env.LOCAL_PORT}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.use((err, req,res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})