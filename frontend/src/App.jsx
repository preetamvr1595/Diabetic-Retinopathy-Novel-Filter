import React, { useState } from 'react';
import UploadStep from './components/UploadStep';
import FilterStep from './components/FilterStep';
import SegmentationStep from './components/SegmentationStep';
import ClassificationStep from './components/ClassificationStep';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [step, setStep] = useState(1);
    const [imageId, setImageId] = useState(null);
    const [originalImage, setOriginalImage] = useState(null); // base64

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    const reset = () => {
        setStep(1);
        setImageId(null);
        setOriginalImage(null);
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <UploadStep onUpload={(id, img) => { setImageId(id); setOriginalImage(img); nextStep(); }} />;
            case 2:
                return <FilterStep imageId={imageId} onNext={nextStep} />;
            case 3:
                return <SegmentationStep imageId={imageId} onNext={nextStep} />;
            case 4:
                return <ClassificationStep imageId={imageId} onRestart={reset} />;
            default:
                return <UploadStep />;
        }
    }

    return (
        <div className="container py-5">
            <header className="text-center mb-5 pt-5">
                <h1 className="display-4 fw-bold text-dark">Diabetic Retinopathy <span className="highlight-text">Analysis</span></h1>
                <p className="lead text-muted-custom">Advanced AI-Powered Clinical Diagnostic Dashboard</p>
            </header>

            {/* Step Indicator */}
            <div className="step-indicator">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`step-dot ${step >= i ? 'active' : ''}`} />
                ))}
            </div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default App;
