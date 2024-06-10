import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

interface DataItemsType {
  listings: string;
  _id: string;
}

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<DataItemsType[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);

      const searchParams = new URLSearchParams({
        searchTerm: sidebardata.searchTerm,
        type: sidebardata.type,
        parking: sidebardata.parking.toString(),
        furnished: sidebardata.furnished.toString(),
        offer: sidebardata.offer.toString(),
        sort: sidebardata.sort,
        order: sidebardata.order,
      });

      const res = await fetch(`/api/listing/get?${searchParams.toString()}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [sidebardata]);

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const searchParams = new URLSearchParams({
      searchTerm: sidebardata.searchTerm,
      type: sidebardata.type,
      parking: sidebardata.parking.toString(),
      furnished: sidebardata.furnished.toString(),
      offer: sidebardata.offer.toString(),
      sort: sidebardata.sort,
      order: sidebardata.order,
      startIndex: numberOfListings.toString(),
    });

    const res = await fetch(`/api/listing/get?${searchParams.toString()}`);
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    }

    setListings([...listings, ...data]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
    const { id, value, checked } = e.target;

    if (["all", "rent", "sale"].includes(id)) {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort: sort || "created_at", order: order || "desc" });
    }
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      searchTerm: sidebardata.searchTerm,
      type: sidebardata.type,
      parking: sidebardata.parking.toString(),
      furnished: sidebardata.furnished.toString(),
      offer: sidebardata.offer.toString(),
      sort: sidebardata.sort,
      order: sidebardata.order,
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#2D3047] text-slate-300">
      <div className="p-7 border-b border-slate-300 md:border-r md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select onChange={handleChange} defaultValue={"created_at_desc"} id="sort_order" className="border rounded-lg p-3">
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-[#419D78] mt-5 text-center">Listing results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-[#419D78]">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-[#419D78] text-center w-full">Loading...</p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
          {showMore && (
            <button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7 text-center w-full">
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
