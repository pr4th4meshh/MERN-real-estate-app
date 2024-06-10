import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import SwiperCore from "swiper"
import "swiper/css/bundle"
import ListingItem from "../components/ListingItem"

interface ListingItemType {
  listing: string
  _id: string
  imageUrls: string
  name: string
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation, Autoplay])
  console.log(offerListings)
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=6")
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=6")
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=6")
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])
  return (
    <div className="bg-[#2D3047]">
      {/* top */}
      <div
        className={`flex flex-col gap-6 p-28 px-3 container mx-auto max-w-6xl text-center`}
      >
        <h1 className="text-[#419D78] font-bold text-3xl lg:text-6xl">
          Welcome to LuxuryLiving - <br /> Your{" "}
          <span className="text-slate-400">gateway</span> to finding your dream
          home.
        </h1>
        <div className="text-gray-400 text-xs sm:text-lg">
          <span className="text-[#E0A458]">LuxuryLiving</span> is the best place
          to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-lg text-[#E0A458] font-bold hover:underline"
        >
          Click here to get started...
        </Link>
      </div>

      {/* swiper */}
      <div className=" max-w-6xl mx-auto">
        <h1 className="text-[#419D78] font-bold text-3xl lg:text-4xl pb-5">
          Latest real estate from offers:
        </h1>
        <Swiper navigation autoplay loop>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing: ListingItemType) => (
              <SwiperSlide>
                <Link to={`/listing/${listing._id}`}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                    className="h-[500px]"
                    key={listing._id}
                  >
                    <h1 className="text-2xl w-full bg-[#FFDBB5] absolute py-3 text-center bottom-0 font-semibold">
                      TAP ON THE IMAGE TO VIEW THE PROPERTY..
                    </h1>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#419D78]">
                Recent offers
              </h2>
              <Link
                className="text-sm text-[#E0A458] hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.slice(0, 6).map((listing: ListingItemType) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#419D78]">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-[#E0A458] hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className=" flex flex-wrap  gap-4">
              {rentListings.slice(0, 6).map((listing: ListingItemType) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-[#419D78]">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-[#E0A458] hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing: ListingItemType) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#E0A458] px-3 py-8">
        <h1 className="text-[#2D3047] text-center text-xl">
          Developed with ❤️ by{" "}
          <a href="https://github.com/pr4th4meshh" className=" text-blue-800 ">
            @pr4th4meshh
          </a>{" "}
        </h1>
      </div>
    </div>
  )
}
