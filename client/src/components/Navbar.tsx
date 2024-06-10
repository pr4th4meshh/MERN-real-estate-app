import { Link, useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

const Navbar = () => {
  const { currentUser } = useSelector((state: unknown) => state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <div>
      <header className="bg-[#E0A458] shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-3 py-6">
          <Link to="/">
            <h1 className="text-sm sm:text-xl flex flex-wrap">
              <span className="text-[#2D3047] font-semibold ">Luxury</span>
              <span className="text-[#2D3047] font-semibold ">Living</span>
            </h1>
          </Link>
          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-[#2D3047] hover:underline font-semibold">
                Home
              </li>
            </Link>
            <Link to="/search">
              <li className="hidden sm:inline text-[#2D3047] hover:underline font-semibold">
                Explore
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-[#2D3047] hover:underline font-semibold">
                About
              </li>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  className="h-7 w-7 object-cover rounded-full"
                  alt="profile"
                />
              ) : (
                <li className="hidden sm:inline text-[#419D78] hover:underline">
                  Signin
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default Navbar
