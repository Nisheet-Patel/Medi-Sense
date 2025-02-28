/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Languages, Calendar, HeartPulse, Users, AlertCircle, Download } from 'lucide-react';
import { DotPulse } from '@uiball/loaders';

const Stress = () => {
    const [formData, setFormData] = useState({
        Education: "1",
        Gender: "1",
        Engnat: "1",
        Age: "",
        Married: "1",
        Familysize: "",
    });

    const [stressScores, setStressScores] = useState(Array(14).fill(null));
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStressChange = (index, value) => {
        const updatedScores = [...stressScores];
        updatedScores[index] = value;
        setStressScores(updatedScores);
    };

    const allFieldsFilled = () => {
        return Object.values(formData).every(field => field !== '') &&
            !stressScores.includes(null);
    };

    const isFloat = (n) => {
        return n % 1 !== 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.Age <= 0 || formData.Familysize <= 0 || isFloat(formData.Age) || isFloat(formData.Familysize)) {
            alert("Age or Family size can't be negative or zero")
            return;
        }

        try {
            setLoading(true);

            const totalStress = stressScores.reduce((sum, value) => sum + parseInt(value), 0);
            const dataToSend = { ...formData, stress_sum: totalStress };

            const response = await fetch('http://127.0.0.1:5000/model/stress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
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

    const stressQuestions = [
        "Do you often feel overwhelmed by daily tasks?",
        "Do you experience frequent headaches or tension?",
        "Do you find it difficult to relax even when you have free time?",
        "Do you often feel irritable or easily frustrated?",
        "Do you have trouble sleeping due to worrying?",
        "Do you feel anxious about your responsibilities?",
        "Do you experience sudden mood swings?",
        "Do you have trouble concentrating on tasks?",
        "Do you feel exhausted even after resting?",
        "Do you avoid social interactions due to stress?",
        "Do you experience digestive issues when stressed?",
        "Do you feel a lack of motivation for daily activities?",
        "Do you find yourself procrastinating more than usual?",
        "Do you feel like you are constantly under pressure?",
    ];

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
                            {/* <HeartPulse className="h-8 w-8 text-blue-600" /> */}
                            <i className='ri-mental-health-line text-xl min-w-[24px] text-blue-600'></i>

                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Stress Level Assessment</h2>
                            <p className="text-gray-500">AI-powered psychological evaluation</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Assessment ID: ST-{Math.floor(Math.random() * 1000000)}</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                    Education Level
                                </label>
                                <select
                                    name="Education"
                                    value={formData.Education}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Less than high school</option>
                                    <option value="2">High school</option>
                                    <option value="3">University degree</option>
                                    <option value="4">Graduate degree</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    {/* <Male className="h-5 w-5 mr-2 text-blue-600" /> */}
                                    Gender
                                </label>
                                <select
                                    name="Gender"
                                    value={formData.Gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                    <option value="3">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Languages className="h-5 w-5 mr-2 text-blue-600" />
                                    Native English Speaker
                                </label>
                                <select
                                    name="Engnat"
                                    value={formData.Engnat}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="Age"
                                    value={formData.Age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                                    Marital Status
                                </label>
                                <select
                                    name="Married"
                                    value={formData.Married}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">Never married</option>
                                    <option value="2">Currently married</option>
                                    <option value="3">Previously married</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                                    Family Size
                                </label>
                                <input
                                    type="number"
                                    name="Familysize"
                                    value={formData.Familysize}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                            Stress Evaluation Questions
                        </h3>
                        <div className="flex flex-col gap-6">
                            {stressQuestions.map((question, index) => (
                                <div key={index} className="space-y-2">
                                    <p className="text-md font-bold">{question}</p>
                                    <div className="list-group list-group-radio d-grid gap-2 border-0 rounded flex">
                                        {[
                                            { key: 'No', value: 0, description: 'Not experiencing this at all' },
                                            { key: 'SomeTime', value: 1, description: 'Occasionally experiencing this' },
                                            { key: 'Frequently', value: 2, description: 'Often experiencing this' },
                                            { key: 'Very much', value: 3, description: 'Constantly experiencing this' }
                                        ].map((obj) => (
                                            <div key={obj.value} className={`${stressScores[index] == obj.value ? 'border-blue-600' : 'border-gray-200'}  position-relative flex border-1 w-full  px-[0.5rem] rounded-lg gap-[1rem] cursor-pointer`}>
                                                <input
                                                    type="radio"
                                                    name={`question${index}`}
                                                    id={`question${index}_${obj.value}`}
                                                    value={obj.value}
                                                    checked={stressScores[index] === obj.value}
                                                    onChange={() => handleStressChange(index, obj.value)}
                                                    className="form-check-input position-absolute top-50 end-0 me-3 fs-5 cursor-pointer"
                                                />
                                                <label
                                                    className="list-group-item py-3 pe-5 flex flex-col flex-1 cursor-pointer"
                                                    htmlFor={`question${index}_${obj.value}`}
                                                >
                                                    <span className={`font-medium ${stressScores[index] === obj.value ? 'text-blue-600' : 'text-gray-700'} `}>{obj.key}</span>
                                                    {/* <span className="d-block small opacity-75">{obj.description}</span> */}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {prediction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`mb-6 p-4 rounded-lg border ${prediction === 1
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : 'bg-green-50 border-green-200 text-green-800'
                                }`}
                        >
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                    {prediction === 1
                                        ? 'High stress level detected'
                                        : 'Normal stress level detected'}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <div className="pt-6 border-t flex justify-end">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={!allFieldsFilled() || loading}
                            className={`flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${!allFieldsFilled() || loading ? 'opacity-70 cursor-not-allowed' : ''
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

export default Stress;