import jwt from "jsonwebtoken"
// import { errorHandler } from "./error.js"

export const verifyToken = (req, res, next) => {
  const token = req.body.access_token

  if (!token) return next(errorHandler(401, "Unauthorized"))

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    //This isn't entirely an user but it's id
    if (err) return new Error(errorHandler(403, "Token isnt there"))

    req.user = user
    next()
  })
}
