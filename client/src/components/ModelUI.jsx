import React from 'react'

const ModelUI = () =>{
    return (
        <div>
            <div className="flex-1 p-8 transition-all duration-500 ease-in-out">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome to MediStack</h1>
                    <p className="text-gray-600 mb-8">Monitor & Track your health predictions with our AI-powered tools.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <i className="ri-mental-health-line text-xl text-blue-700"></i>
                                </div>
                                <h2 className="text-xl font-bold text-blue-700">Stress Prediction</h2>
                            </div>
                            <p className="text-gray-600">Analyze stress levels based on provided data.</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <i className="ri-brain-line text-xl text-blue-700"></i>
                                </div>
                                <h2 className="text-xl font-bold text-blue-700">Brain Tumor Detection</h2>
                            </div>
                            <p className="text-gray-600">Upload MRI scans for AI-driven tumor detection.</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <i className="ri-virus-line text-xl text-blue-700"></i>
                                </div>
                                <h2 className="text-xl font-bold text-blue-700">Sepsis Prediction</h2>
                            </div>
                            <p className="text-gray-600">Identify sepsis risks based on vital signs and symptoms.</p>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <i className="ri-test-tube-line text-xl text-blue-700"></i>
                                </div>
                                <h2 className="text-xl font-bold text-blue-700">Diabetes Prediction</h2>
                            </div>
                            <p className="text-gray-600">Predict diabetes risk through AI analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModelUI;