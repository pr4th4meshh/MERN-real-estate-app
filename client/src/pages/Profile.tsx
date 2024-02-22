import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { app } from "../firebase"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../slices/user/userSlice"
import { Link } from "react-router-dom"

interface ListingItemType {
  listing: string
  _id: string
  imageUrls: string
  name: string
}

interface User {
  avatar: string
  _id: string
  username: string
  email: string
  // other user properties
}

interface UserState {
  currentUser: User
  loading: boolean
  error: string
  // other user-related state properties
}

interface FormDataType {
  avatar: string
}

interface RootState {
  user: UserState
}

export default function Profile() {
  //App states
  const [file, setFile] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [filePercentage, setFilePercentage] = useState(0)
  const [formData, setFormData] = useState<FormDataType>({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  //End of app states

  //App refs
  const fileRef = useRef(null)
  //End of app refs

  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  )
  const dispatch = useDispatch()

  //Main function
  const handleFileUpload = (file: File) => {
    const storage = getStorage(app) //Defining the storage by getStorage [firebase] and app inside firebase.tsx
    const fileName = new Date().getTime() + file.name //To keep the file name unique because firebase won't allow to upload the same image twice if happens
    const storageRef = ref(storage, fileName) //Refering the storage [firebase] by using ref hook coming from firebase
    const uploadTask = uploadBytesResumable(storageRef, file) //Firebase function with the file state

    uploadTask.on(
      "state_changed", //update when the app state changes
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercentage(Math.round(progress))
      },
      () => {
        setFileUploadError(true) //Upating the state to true incase of error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //Firebase function
          setFormData({ ...formData, avatar: downloadURL }) //Spreading and returning the formData with avatar: downloadURL
        })
      }
    )
  }

  //Using useEffect to update the image everytime the user uploads
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  })

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.currentTarget.value })
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch("/api/auth/signout")
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      })
      const data= await res.json();
      if(data.success === false) {
        console.log(data.message)
        return;
      }
      setUserListings((prev) => prev.filter((listing: ListingItemType) => listing._id !== listingId))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e:React.FormEvent<HTMLInputElement>) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          id=""
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current && fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-500">
              Error while uploading image (image should be of size less than
              2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-500">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-500">Image uploaded successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to="/create-listing">
            Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-500 text-sm">{error ? error : ""}</p>
      <p className="text-green-500 text-sm">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing: ListingItemType) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase' onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}
