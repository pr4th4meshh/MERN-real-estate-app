import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

//Declaring userSchema as a model by naming it as 'User' and exporting the model
const User = mongoose.model("User", userSchema)

export default User
