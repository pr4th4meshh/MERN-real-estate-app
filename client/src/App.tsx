import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar"
import SignUp from "./pages/SignUp"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
