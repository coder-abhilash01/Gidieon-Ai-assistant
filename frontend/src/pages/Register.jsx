import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import Profile from '../components/Profile'
import { useAppContext } from '../context/AppContext'
import {toast} from "react-toastify"

const Register = () => {
  const { setUser, loading, setLoading ,setIsAuthenticated} = useAppContext()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const Navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!nameRegex.test(formData.firstName)) {
      toast.error("❌ First name should only contain letters");
      return;
    }

    if (!nameRegex.test(formData.lastName)) {
      toast.error("❌ Last name should only contain letters");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("❌ Invalid email format");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("❌ Password must be at least 6 characters long");
      return;
    }
 setLoading(true)
    try {
      const res = await axios.post("https://gidieon-ai-assistant.onrender.com/auth/register", {
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName
        },
        email: formData.email,
        password: formData.password

      }, { withCredentials: true })
    
      if (res.status === 201) {
        localStorage.setItem("user", JSON.stringify(res.data.user))
        setIsAuthenticated(true)
        toast.success("Registerd Successfully")
        Navigate("/")
      }
    } catch (err) {
      setError(err.response.data.message)
    } finally{setLoading(false)}
  }
  return (
    <div className='w-full h-screen bg-[url("/ai1.png")]  bg-center bg-cover'>
      <div className='w-full h-screen justify-center items-center flex bg-black/70 p-5'>
        <form className=' md:w-4/10 lg:w-2/7 border border-gray-500 flex flex-col justify-center gap-4 p-5 text- shadow-xl backdrop-blur-lg bg-white/20 text-white rounded-lg'
          onSubmit={handleSubmit}>
          <h1 className='text-4xl font-bold text-[#06b6d4] mx-auto'>Register</h1>


          <div>
            {error && (
              <p className="text-red-500 text-[15px] mt-1">*{error}</p>
            )}
            <label>Firstname : </label>
            <input
              type='text'
              name="firstName"
              required
              value={formData.firstName}
              placeholder='Enter your firstname'
              className='w-full shadow-inner shadow-black/50 border border-gray-500/70 px-2 rounded py-1 md:py-2 md:px-3  outline-none'
              onChange={handleChange} />
          </div>
          <div>
            <label>Lastname : </label>
            <input
              type='text'
              name="lastName"
              required
              value={formData.lastName}
              placeholder='Enter your lastname'
              className='w-full border px-2 rounded py-1 md:py-2 md:px-3 shadow-inner shadow-black/50 border-gray-500/70 outline-none'
              onChange={handleChange} />
          </div>
          <div>
            <label>Email : </label>
            <input
              type='text'
              name='email'
              required
              value={formData.email}
              placeholder='xyz@gmail.com'
              className='w-full border px-2 rounded py-1 md:py-2 md:px-3 shadow-inner shadow-black/50 border-gray-500/70 outline-none'
              onChange={handleChange} />
          </div>
          <div>
            <label>Password : </label>
            <input type='password'
              name='password'
              required
              value={formData.password}
              placeholder='*****' className='w-full border px-2 rounded py-1 md:py-2 md:px-3 shadow-inner shadow-black/50 border-gray-500/70  outline-none '
              onChange={handleChange} />
          </div>
          <div>
          <button 
          disabled = {loading}
          className={`text-lg w-full  py-2 md:px-3 rounded cursor-pointer text-white ${loading ? "bg-gray-400" : "bg-[#06b6d4]" }`}
          >{loading ? "submitting..." : "Register"}</button>
          <p className='text-[15px] '>Already have an account ? <Link to="/login" className='text-blue-400 border-b'>Login</Link></p> </div>
        </form></div>
    </div>
  )
}

export default Register
