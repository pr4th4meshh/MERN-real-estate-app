import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"
import Listing from "../models/listing.model.js"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcryptjs.hashSync(password, 10)
  const newUser = new User({ username, email, password: hashedPassword })
  try {
    await newUser.save()
    res.status(201).json("New user created successfully")
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const validUser = await User.findOne({ email })
    if (!validUser) return next(errorHandler(404, "User not found!"))
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, "Invalid credentials!"))
    const token = jwt.sign({ id: validUser._id }, "thisispr4th4meshsjwtsecretkeyforthisapp18072003")
    const { password: pass, ...rest } = validUser._doc
    res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, "thisispr4th4meshsjwtsecretkeyforthisapp18072003")
      const { password: pass, ...rest } = user._doc
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest)
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, "thisispr4th4meshsjwtsecretkeyforthisapp18072003")
      const { password: pass, ...rest } = newUser._doc
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest)
    }
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json({ message: "User has been deleted..." })
  } catch (error) {
    next(error)
  }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id){
    try {
      const listings = await Listing.find({userRef: req.params.id})
      res.status(200).json(listings)
  } catch (error) {
    return next(errorHandler(401, "You can only view your own listings!"))
  }
}
}