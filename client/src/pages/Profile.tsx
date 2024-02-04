import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { app } from "../firebase"

export default function Profile() {
  const [file, setFile] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [filePercentage, setFilePercentage] = useState(0)
  const [formData, setFormData] = useState({})
  console.log(file)
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state: unknown) => state.user)
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercentage(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          id=""
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={ formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-500">Error while uploading image (image should be of size less than 2mb)</span>
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
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}
