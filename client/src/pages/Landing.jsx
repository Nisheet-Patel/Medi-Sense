import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to MediStack</h1>
                <p className="text-gray-600 mb-6">Your AI-powered health assistant for Brain Tumor, Depression, Diabetes, and Sepsis detection.</p>
                <div className="flex flex-col gap-4">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                    <button
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
