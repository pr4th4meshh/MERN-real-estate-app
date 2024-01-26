import express from "express"
import mongoose from "mongoose"
import "dotenv/config"

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => {
    console.log("Connected to mongodb!")
  })
  .catch((err) => {
    console.log(err)
  })
  
const app = express()

const PORT = 7000

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`)
})
