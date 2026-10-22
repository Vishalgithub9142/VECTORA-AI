import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {

  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await handleLogin({ email, password });
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  }

  if (loading) {
    return <main className='bg-[#252525] w-full h-screen flex items-center justify-center text-white'>Loading...</main>
  }

  return (
    <main className='bg-[#252525] w-full h-screen flex items-center justify-center'>
      <div className="form-container text-white p-5 m-0.5 rounded-2xl ">
        <h1 className='text-2xl text-center font-bold underline'>Login</h1>

        {error && (
          <p className="text-red-400 text-sm text-center mt-2 mb-1">{error}</p>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <div className='flex flex-col gap-2'>
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => { setEmail(e.target.value) }}
              value={email}
              type="email" id="email" className="pl-2 text-black" required />

            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
              type="password" id="password" className="pl-2 text-black" required />

            <button type="submit" id="loginButton" className='active:scale-95 bg-pink-400 rounded-2xl p-1.5'>Login</button>
            <p className='text-center m-2'>Don't have an account? <span className="text-pink-400 rounded-lg px-1"><a href="/register">Register</a></span></p>
          </div>

        </form>
      </div>
    </main>
  )
}

export default Login