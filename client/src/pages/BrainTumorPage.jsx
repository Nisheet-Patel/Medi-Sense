import React, { useState,useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ReportGenerator from '../components/ReportGenerator';

const BrainTumorPage = () => {
    const [analysisData, setAnalysisData] = useState(null);

    // Reset analysisData when the component mounts
    useEffect(() => {
        setAnalysisData(null);        
    }, []);


    const handleAnalysisComplete = (data) => {
        setAnalysisData(data); // Save the analysis data to state
    };

    return (
        <div className='mt-8 '>
            {/* Pass the handleAnalysisComplete function as a prop */}
            {/* <!analysisData &&  /> */}
            {!analysisData && <ImageUploader onAnalysisComplete={handleAnalysisComplete} />}

            {/* Render the ReportGenerator if analysis data is available */}
            {analysisData && <ReportGenerator analysisData={analysisData} />}
        </div>
    );
};

export default BrainTumorPage;