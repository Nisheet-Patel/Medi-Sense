/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, HeartPulse, Droplet, Ruler, Syringe, Weight, ClipboardList, AlertCircle, Download } from 'lucide-react';
import { DotPulse } from '@uiball/loaders';

const Diabetes = () => {
    const [formData, setFormData] = useState({
        pregnancies: '',
        glucose: '',
        bloodPressure: '',
        skinThickness: '',
        insulin: '',
        bmi: '',
        diabetesPedigreeFunction: '',
        age: ''
    });

    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isFloat = (n) => {
        return n % 1 !== 0
    }

    const allFieldsFilled = Object.values(formData).every(field => field !== '');

    const handleresponse = async () => {
        setTimeout(async () => {

            const response = await fetch('http://127.0.0.1:5000/model/diabetes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Pregnancies: formData.pregnancies,
                    Glucose: formData.glucose,
                    BloodPressure: formData.bloodPressure,
                    SkinThickness: formData.skinThickness,
                    Insulin: formData.insulin,
                    BMI: formData.bmi,
                    DiabetesPedigreeFunction: formData.diabetesPedigreeFunction,
                    Age: formData.age
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            console.log(data.prediction);
            setPrediction(data.prediction);
            setLoading(false);
        }, 1500);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            if (formData.age <= 0 || isFloat(formData.age) || isFloat(formData.pregnancies)) {
                alert("Age or Pregnancies cannot be negative or float");
                setLoading(false);
                return
            }
            else {
                await handleresponse();
            }
        } catch (err) {
            console.error(err);
            alert('Prediction failed. Please try again.');
        } finally {
            // setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            {/* <ClipboardList className="h-8 w-8 text-blue-600" /> */}
                            <i className='ri-test-tube-line text-xl min-w-[24px] text-blue-600'></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Diabetes Risk Assessment</h2>
                            <p className="text-gray-500">AI-powered health evaluation</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Assessment ID: DB-{Math.floor(Math.random() * 1000000)}</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-blue-600" />
                                    Pregnancies
                                </label>
                                <input
                                    type="number"
                                    name="pregnancies"
                                    value={formData.pregnancies}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Droplet className="h-5 w-5 mr-2 text-blue-600" />
                                    Glucose (mg/dL)
                                </label>
                                <input
                                    type="number"
                                    name="glucose"
                                    value={formData.glucose}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <HeartPulse className="h-5 w-5 mr-2 text-blue-600" />
                                    Blood Pressure (mmHg)
                                </label>
                                <input
                                    type="number"
                                    name="bloodPressure"
                                    value={formData.bloodPressure}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                                    Skin Thickness (mm)
                                </label>
                                <input
                                    type="number"
                                    name="skinThickness"
                                    value={formData.skinThickness}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Syringe className="h-5 w-5 mr-2 text-blue-600" />
                                    Insulin (μU/mL)
                                </label>
                                <input
                                    type="number"
                                    name="insulin"
                                    value={formData.insulin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Weight className="h-5 w-5 mr-2 text-blue-600" />
                                    BMI (kg/m²)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="bmi"
                                    value={formData.bmi}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
                                    Diabetes Pedigree
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    name="diabetesPedigreeFunction"
                                    value={formData.diabetesPedigreeFunction}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {prediction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`mb-6 p-4 rounded-lg border ${prediction === true
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : 'bg-green-50 border-green-200 text-green-800'
                                }`}
                        >
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                    {prediction === true
                                        ? 'High risk of diabetes detected'
                                        : 'Low risk of diabetes detected'}
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
                                    <span className='ml-5'>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5 mr-2 " />
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

export default Diabetes;