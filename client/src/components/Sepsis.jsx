import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, HeartPulse, Droplet, Thermometer, Syringe, ClipboardList, AlertCircle, Download, Activity, Microscope, Hospital, Clock } from 'lucide-react';
import { DotPulse } from '@uiball/loaders';

const Sepsis = () => {
    const [formData, setFormData] = useState({
        hour: '',
        hr: '',
        o2Sat: '',
        temp: '',
        map: '',
        resp: '',
        bun: '',
        chloride: '',
        creatinine: '',
        glucose: '',
        hct: '',
        hgb: '',
        wbc: '',
        platelets: '',
        age: '',
        hospAdmTime: '',
        iculos: '',
        gender: ''
    });

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const allFieldsFilled = Object.values(formData).every(field => field !== '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch('http://127.0.0.1:5000/model/sepsis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Hour: formData.hour,
                    HR: formData.hr,
                    O2Sat: formData.o2Sat,
                    Temp: formData.temp,
                    MAP: formData.map,
                    Resp: formData.resp,
                    BUN: formData.bun,
                    Chloride: formData.chloride,
                    Creatinine: formData.creatinine,
                    Glucose: formData.glucose,
                    Hct: formData.hct,
                    Hgb: formData.hgb,
                    WBC: formData.wbc,
                    Platelets: formData.platelets,
                    Age: formData.age,
                    HospAdmTime: formData.hospAdmTime,
                    ICULOS: formData.iculos,
                    '0': formData.gender === 'male' ? 1 : 0,
                    '1': formData.gender === 'female' ? 1 : 0
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setPrediction(data.prediction);
        } catch (err) {
            console.error(err);
            alert('Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Field groups for better organization
    const fieldGroups = [
        {
            title: 'Vital Signs',
            icon: <Activity className="h-5 w-5 mr-2 text-blue-600" />,
            fields: [
                { name: 'hour', label: 'Hour', icon: <Clock className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'hr', label: 'Heart Rate (bpm)', icon: <HeartPulse className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'o2Sat', label: 'O2 Saturation (%)', icon: <Droplet className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'temp', label: 'Temperature (°C)', icon: <Thermometer className="h-5 w-5 mr-2 text-blue-600" />, step: "0.1" },
                {
                    name: 'map',
                    label: 'MAP (mmHg)',
                    icon: <Activity className="h-5 w-5 mr-2 text-blue-600" /> // Updated icon
                },
                { name: 'resp', label: 'Respiratory Rate (bpm)', icon: <Hospital className="h-5 w-5 mr-2 text-blue-600" /> }
            ]
        },
        {
            title: 'Lab Results',
            icon: <Microscope className="h-5 w-5 mr-2 text-blue-600" />,
            fields: [
                { name: 'bun', label: 'BUN (mg/dL)', icon: <Syringe className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'chloride', label: 'Chloride (mmol/L)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'creatinine', label: 'Creatinine (mg/dL)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'glucose', label: 'Glucose (mg/dL)', icon: <Droplet className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'hct', label: 'Hematocrit (%)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'hgb', label: 'Hemoglobin (g/dL)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> }
            ]
        },
        {
            title: 'Additional Information',
            icon: <User className="h-5 w-5 mr-2 text-blue-600" />,
            fields: [
                { name: 'wbc', label: 'WBC (10^3/μL)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'platelets', label: 'Platelets (10^3/μL)', icon: <ClipboardList className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'age', label: 'Age', icon: <User className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'hospAdmTime', label: 'Hospital Admission Time (hrs)', icon: <Calendar className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'iculos', label: 'ICU Length of Stay (hrs)', icon: <Hospital className="h-5 w-5 mr-2 text-blue-600" /> },
                { name: 'gender', label: 'Gender', icon: <User className="h-5 w-5 mr-2 text-blue-600" /> }
            ]
        }
    ];

    return (
        <motion.div
            className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-xl p-8 max-w-6xl w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <i className='ri-test-tube-line text-xl min-w-[24px] text-blue-600'></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Sepsis Risk Assessment</h2>
                            <p className="text-gray-500">AI-powered clinical evaluation</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Assessment ID: SE-{Math.floor(Math.random() * 1000000)}</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {fieldGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-4">
                                    {group.icon}
                                    <h3 className="font-medium text-gray-800">{group.title}</h3>
                                </div>
                                <div className="space-y-4">
                                    {group.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex}>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                {field.icon}
                                                {field.label}
                                            </label>
                                            {field.name === 'gender' ? (
                                                <select
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="number"
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    step={field.step || "1"}
                                                    min="0"
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {prediction !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`mb-6 p-4 rounded-lg border ${prediction
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : 'bg-green-50 border-green-200 text-green-800'
                                }`}
                        >
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                    {prediction ? 'Sepsis Detected' : 'No Sepsis Detected'}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <div className="pt-6 border-t flex justify-end">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={!allFieldsFilled || loading}
                            className={`flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${!allFieldsFilled || loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <DotPulse size={20} color="#fff" className="mr-5" />
                                    <span className="ml-5">Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5 mr-2" />
                                    Get Assessment
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Sepsis;