import React, { useState,useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "remixicon/fonts/remixicon.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
        navigate("/login");
    };

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/dashboard", { withCredentials: true });
            } catch (error) {
                console.error("Authentication failed:", error);
                navigate("/login");
            }
        };

        verifyUser();
    }, []);

    return (
        <div className="flex min-h-screen bg-custom">
            {/* Sidebar */}
            <nav className={`bg-white shadow-lg transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col fixed h-full`}>
                {/* Toggle Button - Moved outside the collapsible area */}
                <div className={`absolute -right-4 top-6 bg-white rounded-full p-2 shadow-md z-10 transition-transform duration-500 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-blue-700 focus:outline-none transition-all duration-500 ease-in-out">
                        <i className="ri-arrow-left-s-line text-xl"></i>
                    </button>
                </div>

                {/* Logo */}
                <div className="p-6 mb-2 overflow-hidden">
                    <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 scale-0 hidden' : 'opacity-100 scale-100'}`}>
                        <h2 className="text-2xl font-bold text-blue-700">MediStack</h2>
                    </div>
                    <div className={`flex justify-center transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0 hidden'}`}>
                        <i className="ri-heart-pulse-line text-3xl p-3 text-blue-700"></i>
                    </div>
                </div>

                {/* Navigation Links */}
                <ul className="flex-1 px-4">
                    <li className="mb-4 overflow-hidden">
                        <NavLink to="/dashboard" className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                        }>
                            <i className={`ri-dashboard-line text-xl transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-auto' : ''}`}></i>
                            <span className={`font-medium transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {!isCollapsed && "Dashboard"}
                            </span>
                        </NavLink>
                    </li>
                    <li className="mb-4 overflow-hidden">
                        <NavLink to="/dashboard/stress" className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                        }>
                            <i className={`ri-mental-health-line text-xl transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-auto' : ''}`}></i>
                            <span className={`font-medium transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {!isCollapsed && "Stress Prediction"}
                            </span>
                        </NavLink>
                    </li>
                    <li className="mb-4 overflow-hidden">
                        <NavLink to="/dashboard/mri_upload" className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                        }>
                            <i className={`ri-brain-line text-xl transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-auto' : ''}`}></i>
                            <span className={`font-medium transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {!isCollapsed && "Brain Tumor"}
                            </span>
                        </NavLink>
                    </li>
                    <li className="mb-4 overflow-hidden">
                        <NavLink to="/dashboard/sepsis" className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                        }>
                            <i className={`ri-virus-line text-xl transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-auto' : ''}`}></i>
                            <span className={`font-medium transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {!isCollapsed && "Sepsis Prediction"}
                            </span>
                        </NavLink>
                    </li>
                    <li className="mb-4 overflow-hidden">
                        <NavLink to="/dashboard/diabetes" className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`
                        }>
                            <i className={`ri-test-tube-line text-xl transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-auto' : ''}`}></i>
                            <span className={`font-medium transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {!isCollapsed && "Diabetes Prediction"}
                            </span>
                        </NavLink>
                    </li>
                </ul>

                {/* Profile and Logout */}
                <div className="mt-auto px-4 pb-6">
                    <button className={`flex items-center gap-3 w-full p-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-500 ease-in-out ${isCollapsed ? 'justify-center' : ''}`}>
                        <i className="ri-user-line text-xl"></i>
                        <span className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            {!isCollapsed && "Profile"}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full p-3 text-red-600 font-medium hover:bg-red-50 hover:text-red-800 rounded-lg transition-all duration-500 ease-in-out mt-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <i className="ri-logout-box-line text-xl"></i>
                        <span className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            {!isCollapsed && "Logout"}
                        </span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className='w-full'>

                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;