import { Outlet, Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Landing from './pages/Landing'
import Stress from './components/Stress'
import ModelUI from './components/ModelUI'
import Diabetes from './components/Diabetes'
import BrainTumorPage from './pages/BrainTumorPage'
import Sepsis from './components/Sepsis'



const App = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<ModelUI />} />
                <Route path="stress" element={<Stress />} />
                <Route path="sepsis" element={<Sepsis />} />
                <Route path="diabetes" element={<Diabetes />} />
                <Route path="mri_upload" element={<BrainTumorPage />} />
            </Route>
            <Route index path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>

    );
};

export default App;