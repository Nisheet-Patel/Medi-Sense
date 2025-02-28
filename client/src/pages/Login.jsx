import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/api/login', { mail, password }, { withCredentials: true });
            navigate('/dashboard')
        } catch (error) {
            setMail('')
            setPassword('')
            console.log(error); 
            alert(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">Login</h1>
                <form method='post' onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="text-left">
                        <label htmlFor="mail" className="text-gray-600 font-medium">Email</label>
                        <input
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                            type="email"
                            name="mail"
                            placeholder='Enter your email'
                            autoComplete='username'
                            required
                            id="mail"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="text-left">
                        <label htmlFor="password" className="text-gray-600 font-medium">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            name="password"
                            placeholder='Enter your password'
                            required
                            autoComplete="current-password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input
                        type="submit"
                        value="Login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer" />
                </form>
            </div>
        </div>
    )
}

export default Login;