import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'

const Profile = ({ isOpen }) => {
  const {setIsAuthenticated} = useAppContext()
  const [isProfile, setIsProfile] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))

  const Navigate = useNavigate()

  const handleProfile = () => {
    setIsProfile(!isProfile)
  }

  const handleLogut = async()=>{
    try{
      await axios.post(`${import.meta.env.VITE_CLIENT_URL}/auth/logout`,{},{withCredentials:true})
  setIsAuthenticated(false)
  Navigate("/login")
  }catch(err){ console.log(err)}
  }
  return (
    <div className='absolute bottom-8 flex flex-col' >
      {isProfile && 
      <div className='bg-gray-900 border border-gray-50/20 px-2 py-4 flex flex-col gap-5 rounded-lg items-start'>
        <small className='text-[15px]'> <i className="ri-account-circle-line text-"></i> {user?.email}</small>
        <button 
        onClick={handleLogut}
        className=' cursor-pointer'> <i className="ri-logout-box-r-line"></i> Logout</button>
      </div>}
      <div className=' flex items-center gap-4'>
        <button className='w-8 h-8  p-1 rounded-full text-lg font-bold bg-blue-500 flex justify-center items-center cursor-pointer'
          onClick={handleProfile}>
          {user?.fullName.firstName.charAt(0).toUpperCase()} 
        </button>

        <span> {isOpen && user?.fullName.firstName}</span> 
      </div></div>

  )
}

export default Profile
