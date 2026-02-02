import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UploadStep from './components/UploadStep';
import FilterStep from './components/FilterStep';
import SegmentationStep from './components/SegmentationStep';
import ClassificationStep from './components/ClassificationStep';
import AuthPage from './components/AuthPage';
import NavigationBar from './components/NavigationBar';
import EyeScannerLoading from './components/EyeScannerLoading';
import { motion, AnimatePresence } from 'framer-motion';

const MainApp = () => {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const [step, setStep] = useState(1);
    const [maxReachedStep, setMaxReachedStep] = useState(1);
    const [imageId, setImageId] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);

    const nextStep = () => {
        const newStep = Math.min(step + 1, 4);
        setStep(newStep);
        setMaxReachedStep(Math.max(maxReachedStep, newStep));
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const navigateToStep = (targetStep) => {
        if (targetStep >= 1 && targetStep <= maxReachedStep) {
            setStep(targetStep);
        }
    };

    const reset = () => {
        setStep(1);
        setMaxReachedStep(1);
        setImageId(null);
        setOriginalImage(null);
    }

    const handleLogout = () => {
        logout();
        reset();
    };

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

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="loading-screen">
                <EyeScannerLoading size="large" message="Initializing Diagnostic System..." />
            </div>
        );
    }

    // Show AuthPage if not authenticated
    if (!isAuthenticated) {
        return <AuthPage />;
    }

    // Show Dashboard if authenticated

    return (
        <div className="container py-5">
            <header className="text-center mb-4 pt-5">
                <div className="header-content">
                    <h1 className="display-4 fw-bold text-dark">
                        Diabetic Retinopathy <span className="highlight-text">Analysis</span>
                    </h1>
                    <p className="lead text-muted-custom">Advanced AI-Powered Clinical Diagnostic Dashboard</p>
                </div>

                {/* User Info in Header */}
                <div className="auth-header-btn">
                    <div className="user-info">
                        <span className="user-email">👤 {user?.email || user?.username || 'User'}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Step Indicator */}
            <div className="step-indicator">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`step-dot ${step >= i ? 'active' : ''}`} />
                ))}
            </div>

            {/* Navigation Bar - Only show after step 1 */}
            {step > 1 && (
                <NavigationBar
                    currentStep={step}
                    maxReachedStep={maxReachedStep}
                    onNavigate={navigateToStep}
                    stepLabels={['Upload Image', 'Filter Analysis', 'Segmentation', 'Classification']}
                />
            )}

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
};

function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}

export default App;
