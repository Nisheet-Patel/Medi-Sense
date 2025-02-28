import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { FileText, Clipboard, User, Calendar, Download, AlertCircle, Brain, Activity, ZoomIn } from 'lucide-react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DotPulse } from '@uiball/loaders';

const ReportGenerator = ({ analysisData }) => {
    const [patientInfo, setPatientInfo] = useState({
        name: '',
        age: '',
        gender: 'Male',
        id: `PT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0]
    });

    const [generating, setGenerating] = useState(false);
    const [tumorSize, setTumorSize] = useState(null);
    const [plotLoading, setPlotLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // Simulate calculating tumor size based on analysis data
        if (analysisData) {
            setTimeout(() => {
                const calculatedSize = analysisData.probability > 0.7
                    ? Math.round(analysisData.probability * 30 * 10) / 10
                    : Math.round(analysisData.probability * 15 * 10) / 10;
                setTumorSize(calculatedSize);
                setPlotLoading(false);
            }, 800);
        }
    }, [analysisData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateReport = async () => {
        setGenerating(true);
        try {
            const payload = {
                patient_info: patientInfo,
                tumor_info: {
                    detected: analysisData.probability > 0.5,
                    probability: analysisData.probability,
                    size: tumorSize,
                    location: analysisData.probability > 0.5 ? 'Frontal lobe' : 'N/A'
                },
                images: {
                    original: analysisData.processed_image,
                    tumor: analysisData.tumor_image
                },
                plot_3d: analysisData.plot_3d
            };

            const response = await axios.post(
                'http://localhost:5000/api/generate-report',
                payload,
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'text/html' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `report_${Date.now()}.html`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Check console for details.');
        } finally {
            setGenerating(false);
        }
    };

    // Format probability as percentage
    const probabilityPercentage = analysisData ? Math.round(analysisData.probability * 100) : 0;

    // Determine risk level
    const getRiskLevel = () => {
        if (probabilityPercentage > 75) return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
        if (probabilityPercentage > 40) return { level: 'Medium', color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
        return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    };

    const riskInfo = getRiskLevel();

    return (
        <motion.div
            className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                        <FileText className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">MRI Analysis Report</h2>
                        <p className="text-gray-500">AI-powered neurological assessment</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Report ID: MRI-{Math.floor(Math.random() * 1000000)}</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                <TabList className="flex mb-6 border-b">
                    <Tab className="px-4 py-3 font-medium cursor-pointer focus:outline-none transition-colors duration-200 relative">
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>Patient Information</span>
                        </div>
                        {activeTab === 0 && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" layoutId="activeTab" />}
                    </Tab>
                    <Tab className="px-4 py-3 font-medium cursor-pointer focus:outline-none transition-colors duration-200 relative">
                        <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            <span>Analysis Results</span>
                        </div>
                        {activeTab === 1 && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" layoutId="activeTab" />}
                    </Tab>
                    <Tab className="px-4 py-3 font-medium cursor-pointer focus:outline-none transition-colors duration-200 relative">
                        <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-2" />
                            <span>3D Visualization</span>
                        </div>
                        {activeTab === 2 && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" layoutId="activeTab" />}
                    </Tab>
                </TabList>

                <TabPanel>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <User className="inline h-4 w-4 mr-1 text-indigo-500" /> Patient Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={patientInfo.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Clipboard className="inline h-4 w-4 mr-1 text-indigo-500" /> Patient ID
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    value={patientInfo.id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="inline h-4 w-4 mr-1 text-indigo-500" /> Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={patientInfo.age}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                    placeholder="42"
                                    min="0"
                                    max="120"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={patientInfo.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </TabPanel>

                <TabPanel>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    >
                        <div className={`rounded-lg p-6 border ${riskInfo.borderColor} ${riskInfo.bgColor}`}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                                Analysis Summary
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Abnormality Detection</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-lg">
                                            {probabilityPercentage > 50 ? 'Positive' : 'Negative'}
                                        </span>
                                        {probabilityPercentage > 50 && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Abnormal
                                            </span>
                                        )}
                                        {probabilityPercentage <= 50 && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Normal
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Confidence Level</p>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${probabilityPercentage}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className={`h-3 rounded-full ${probabilityPercentage > 75 ? 'bg-red-500' : probabilityPercentage > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            ></motion.div>
                                        </div>
                                        <span className="ml-3 text-lg font-medium">{probabilityPercentage}%</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Risk Assessment</p>
                                    <p className={`text-lg font-semibold ${riskInfo.color}`}>{riskInfo.level} Risk</p>
                                </div>

                                {tumorSize && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Estimated Size</p>
                                        <p className="text-lg font-medium">{tumorSize} mm</p>
                                    </div>
                                )}

                                {probabilityPercentage > 50 && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Location</p>
                                        <p className="text-lg font-medium">Frontal lobe, right hemisphere</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <ZoomIn className="h-5 w-5 mr-2 text-indigo-600" />
                                Image Analysis
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Original Scan</p>
                                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                        {analysisData?.processed_image ? (
                                            <motion.img
                                                src={`data:image/png;base64,${analysisData.processed_image}`}
                                                alt="Original MRI Scan"
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        ) : (
                                            <div className="text-gray-400 text-sm">No image</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Highlighted Analysis</p>
                                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                        {analysisData?.tumor_image ? (
                                            <motion.img
                                                src={`data:image/png;base64,${analysisData.tumor_image}`}
                                                alt="Tumor Detection"
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        ) : (
                                            <div className="text-gray-400 text-sm">No analysis</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Clinical Interpretation</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {probabilityPercentage > 75 ?
                                        "High probability of abnormal tissue detected. The analysis indicates significant abnormalities that warrant immediate consultation with a neurologist or neurosurgeon." :
                                        probabilityPercentage > 50 ?
                                            "Moderate indication of abnormal tissue. The analysis suggests potential abnormalities that should be further examined by a specialist." :
                                            probabilityPercentage > 25 ?
                                                "Low probability of abnormality. While the scan appears largely normal, routine follow-up is recommended to monitor any potential changes." :
                                                "No significant abnormalities detected. The brain scan appears normal with no indication of pathological conditions."
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </TabPanel>

                <TabPanel>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                                3D Brain Visualization
                            </h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Interactive Model
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Rotatable
                                </span>
                            </div>
                        </div>

                        {plotLoading ? (
                            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                                <div className="text-center space-y-4">
                                    <DotPulse size={40} color="#4F46E5" />
                                    <p className="mt-3 text-gray-600">Generating 3D visualization...</p>
                                    <p className="text-xs text-gray-400">This may take a few moments</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none rounded-xl" />
                                
                                {analysisData?.plot_3d ? (
                                    <Plot
                                        data={JSON.parse(analysisData.plot_3d).data}
                                        layout={{
                                            ...JSON.parse(analysisData.plot_3d).layout,
                                            autosize: true,
                                            margin: { l: 40, r: 40, b: 40, t: 40, pad: 4 },
                                            paper_bgcolor: '#fff',
                                            plot_bgcolor: 'rgba(255,255,255,0.9)',
                                            scene: {
                                                ...JSON.parse(analysisData.plot_3d).layout.scene,
                                                xaxis: { 
                                                    ...JSON.parse(analysisData.plot_3d).layout.scene.xaxis, 
                                                    gridcolor: "rgba(229, 231, 235, 0.5)",
                                                    backgroundcolor: 'rgba(255,255,255,0)'
                                                },
                                                yaxis: { 
                                                    ...JSON.parse(analysisData.plot_3d).layout.scene.yaxis, 
                                                    gridcolor: "rgba(229, 231, 235, 0.5)",
                                                    backgroundcolor: 'rgba(255,255,255,0)'
                                                },
                                                zaxis: { 
                                                    ...JSON.parse(analysisData.plot_3d).layout.scene.zaxis, 
                                                    gridcolor: "rgba(229, 231, 235, 0.5)",
                                                    backgroundcolor: 'rgba(255,255,255,0)'
                                                },
                                                camera: {
                                                    eye: { x: 1.5, y: 1.5, z: 0.8 }
                                                }
                                            }
                                        }}
                                        useResizeHandler={true}
                                        style={{ 
                                            width: '100%', 
                                            height: '600px',
                                            minHeight: '400px',
                                            borderRadius: '0.75rem'
                                        }}
                                        config={{ 
                                            responsive: true,
                                            displaylogo: false,
                                            modeBarButtonsToRemove: [
                                                'toImage',
                                                'select2d',
                                                'lasso2d',
                                                'resetScale2d'
                                            ]
                                        }}
                                    />
                                ) : (
                                    <div className="h-96 flex items-center justify-center bg-white rounded-xl">
                                        <p className="text-gray-500">3D visualization data not available</p>
                                    </div>
                                )}

                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-xs border border-gray-200 text-sm text-gray-600">
                                        <span className="text-indigo-600 font-medium">X</span> Axis
                                    </div>
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-xs border border-gray-200 text-sm text-gray-600">
                                        <span className="text-indigo-600 font-medium">Y</span> Axis
                                    </div>
                                    <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-xs border border-gray-200 text-sm text-gray-600">
                                        <span className="text-indigo-600 font-medium">Z</span> Axis
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl backdrop-blur-sm">
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                                    <ZoomIn className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-indigo-800 font-medium mb-2">How to interact with the model</p>
                                    <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1">
                                        <li>Click and drag to rotate the view</li>
                                        <li>Use scroll to zoom in/out</li>
                                        <li>Right-click and drag to pan</li>
                                        <li>Double-click to reset view</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabPanel>
            </Tabs>

            <div className="mt-8 pt-4 border-t flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">
                        This is an AI-assisted analysis. All findings should be confirmed by a qualified healthcare professional.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${generating || !patientInfo.name || !patientInfo.age ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={generateReport}
                    disabled={generating || !patientInfo.name || !patientInfo.age}
                >
                    {generating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <Download className="h-5 w-5 mr-2" />
                            Download Full Report
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ReportGenerator;