import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from "react-toastify";

const Login = () => {
  const { setActiveChatId, setMessages, setChats, setUser, loading, setLoading, setIsAuthenticated } = useAppContext();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("❌ Invalid email format");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("❌ Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setChats([]);
      setMessages([]);
      setActiveChatId(null);
      setIsAuthenticated(true);
      toast.success("Login Successfully");
      navigate("/"); // Or "/" if your home route is at "/"
    } catch (err) {
     
      let errMsg = "Login failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errMsg = err.response.data.message;
      }
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full flex h-screen bg-[url("/ai1.png")] bg-center bg-cover'>
      <div className='w-full flex p-3 justify-center items-center bg-black/70'>
        <form
          className='border border-zinc-500 flex flex-col justify-center gap-4 p-7 md:text-lg shadow-lg bg-white/20 backdrop-blur-lg text-white rounded'
          onSubmit={handleSubmit}
        >
          <h1 className='text-4xl font-bold text-[#06b6d4] mx-auto'>Login</h1>
          <div>
            {error && <p className='text-red-400 text-[18px] text-shadow-lg '>*{error}</p>}
            <label>Email : </label>
            <input
              type='email'
              name="email"
              value={formData.email}
              placeholder='xyz@gmail.com'
              onChange={handleChange}
              autoComplete="username"
              className='w-full border shadow-inner shadow-black/50 border-gray-500/70 px-2 rounded py-1 md:py-2 md:px-3 outline-none'
              disabled={loading}
            />
          </div>
          <div>
            <label>Password : </label>
            <input
              type='password'
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='*****'
              autoComplete="current-password"
              className='w-full  border shadow-inner shadow-black/50 border-gray-500/70 px-2 rounded py-1 md:py-2 md:px-3 outline-none'
              disabled={loading}
            />
          </div>
          <div>
          <button
            type="submit"
            className='text-lg w-full bg-[#06b6d4] py-2 md:px-3 rounded text-white cursor-pointer'
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className='text-[15px]'>Don't have an account? <Link to="/register" className='text-blue-400 border-b'>Register</Link></p></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
