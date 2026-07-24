import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth'; 

const Login = () => {

    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password});
        navigate("/home")
    }

    if(loading){
        return <main>Loading...........</main>
    }

    return (
        <main className='bg-[#252525] w-full h-screen flex items-center justify-center'>
            <div className="form-container text-white p-5 m-0.5 rounded-2xl ">
                <h1 className='text-2xl text-center font-bold underline'>Login</h1>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e)=>{setEmail(e.target.value)}}
                        type="email" id="email" className="pl-2 text-black" />

                        <label htmlFor="password">Password</label>
                        <input 
                            onChange={(e)=>{setPassword(e.target.value)}}
                        type="password" id="password" className="pl-2  text-black" />

                        <button type="submit" id="loginButton" className='active:scale-95 bg-pink-400 rounded-2xl p-1.5'>Login</button>
                        <p className='text-center m-2'>Don't have an account? <span className="text-pink-400 rounded-lg px-1" ><a href="/register">Register</a></span></p>
                    </div> 

                </form>
            </div>
        </main>
    )
}

export default Login