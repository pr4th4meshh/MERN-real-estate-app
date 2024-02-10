import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body)
    return res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"))
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"))
  }

  try {
    await Listing.findById(req.params.id)
    res.status(200).json("Listing has been deleted!")
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"))
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"))
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"))
    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9
    const startIndex = parseInt(req.query.startIndex) || 0

    let offer = req.query.offer

    if (offer === undefined || offer === "false") {
      //Whether the offer checkbox is selected or not
      offer = { $in: [true, false] } //Search in the database, all the results whether true or false
    }

    let furnished = req.query.furnished

    if (furnished === undefined || furnished === "false") {
      //Whether the offer checkbox is selected or not
      furnished = { $in: [true, false] } //Search in the database, all the results whether true or false
    }

    let parking = req.query.parking

    if (parking === undefined || parking === "false") {
      //Whether the offer checkbox is selected or not
      parking = { $in: [true, false] } //Search in the database, all the results whether true or false
    }

    let type = req.query.type

    if (type === undefined || type === "all") {
      //Whether the offer checkbox is selected or all are selected
      type = { $in: ["sale", "rent"] } //Search in the database, all the results whether rent or sale
    }

    const searchTerm = req.query.searchTerm || "" //if there is any searchTerm or no search term
    const sort = req.query.createdAt
    const order = req.query.order || "desc"

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, //$regex is a builtin function for search in mongodb and $option is to search the term from searchTerm whether the name is in lowercase or uppercase.
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)

    return res.status(200).json(listings)
  } catch (error) {
    next(error)
  }
}
