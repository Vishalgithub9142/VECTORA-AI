import React from 'react'
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';


const Register = () => {

  const navigate = useNavigate()

  const {handleRegister,loading} = useAuth();

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault();    
    await handleRegister({username, email, password});
    navigate("/home")
  }

  return (
    <main className='bg-[#252525] w-full h-screen flex items-center justify-center'>
      <div className="form-container text-white p-5 m-0.5 rounded-2xl ">
        <h1 className='text-2xl text-center font-bold underline'>Register</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <div className='flex flex-col gap-2'>

            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => { setUsername(e.target.value) }}
              type="text" id="username" className="pl-2 text-black " />

            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => { setEmail(e.target.value) }}
              type="email" id="email" className="pl-2 text-black" />

            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => { setPassword(e.target.value) }}
              type="password" id="password" className="pl-2 text-black" />

            <button type="submit" id="loginButton" className='active:scale-95 bg-pink-400 rounded-2xl p-1.5'>Register</button>

          </div>

        </form>

        <p className='text-center m-2'>Already have an account? <span className="cursor-pointer text-pink-400 rounded-lg px-1" onClick={() => { navigate('/login') }}>Login </span></p>
      </div>
    </main>
  )
}

export default Register
