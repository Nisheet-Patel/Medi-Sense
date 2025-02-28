import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader, FileIcon, ArrowUpCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploader = ({ onAnalysisComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Create preview and save filename
        setFilePreview(URL.createObjectURL(file));
        setFileName(file.name);

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            setUploadProgress(0);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 100);

            // Upload the file
            const response = await axios.post('http://127.0.0.1:5000/api/analyze', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted > 95 ? 95 : percentCompleted);
                }
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Simulate analysis time
            setAnalyzing(true);
            setTimeout(() => {
                onAnalysisComplete(response.data);
                setAnalyzing(false);
            }, 2000);

        } catch (error) {
            console.error("Upload failed:", error);
            // You could add toast notification here
        } finally {
            setUploading(false);
        }
    }, [onAnalysisComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.dicom', '.dcm']
        },
        disabled: uploading || analyzing,
        maxFiles: 1
    });

    return (
        <motion.div
            className="max-w-xl mx-auto w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Upload MRI Scan</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        For accurate analysis, please upload a clear brain MRI scan image
                    </p>

                    <motion.div
                        className={`border-2 border-dashed rounded-lg ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                            } ${(uploading || analyzing) ? 'opacity-70' : 'cursor-pointer hover:border-indigo-400 hover:bg-indigo-50'}`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />

                        <div className="p-6 flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                {filePreview ? (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-full max-w-xs mb-4">
                                                <img
                                                    src={filePreview}
                                                    alt="MRI Preview"
                                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-white/90 rounded-md px-2 py-1 text-xs text-gray-700 shadow">
                                                    {fileName}
                                                </div>
                                            </div>
                                            {!(uploading || analyzing) && (
                                                <p className="text-sm text-indigo-600 flex items-center">
                                                    <ArrowUpCircle size={16} className="mr-1" />
                                                    Click or drop to replace
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-8"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <ImageIcon className="h-8 w-8 text-indigo-500" />
                                            </div>
                                            <p className="text-lg font-medium mb-2 text-gray-700">Drop your MRI scan here</p>
                                            <p className="text-sm text-gray-500 mb-3">or click to browse files</p>
                                            <div className="inline-flex px-4 py-2 bg-indigo-50 rounded-md text-indigo-600 text-sm font-medium">
                                                Select Image
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {(uploading || analyzing) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="mb-2 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            {analyzing ? 'Analyzing...' : 'Uploading...'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {analyzing ? 'Processing' : `${uploadProgress}%`}
                                        </span>
                                    </div>

                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-indigo-600"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center text-sm text-indigo-600">
                                        <Loader className="animate-spin h-4 w-4 mr-2" />
                                        <span>
                                            {analyzing
                                                ? 'Running neural network analysis...'
                                                : 'Processing MRI data...'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t">
                    <div className="flex items-center text-sm text-gray-500">
                        <FileIcon size={16} className="mr-1" />
                        Supported: JPEG, PNG, DICOM
                    </div>

                    <div className="text-xs text-gray-400">
                        Max size: 50MB
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageUploader;