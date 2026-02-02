import React from 'react';
import { motion } from 'framer-motion';

const NavigationBar = ({ currentStep, maxReachedStep, onNavigate, stepLabels }) => {
    const labels = stepLabels || ['Upload Image', 'Filter Analysis', 'Segmentation', 'Classification'];

    return (
        <div className="navigation-bar-container">
            {/* Breadcrumb Trail */}
            <div className="nav-breadcrumb">
                {labels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    const isAccessible = stepNumber <= maxReachedStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            <motion.button
                                className={`nav-breadcrumb-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
                                onClick={() => isAccessible && onNavigate(stepNumber)}
                                disabled={!isAccessible}
                                whileHover={isAccessible ? { scale: 1.05 } : {}}
                                whileTap={isAccessible ? { scale: 0.95 } : {}}
                            >
                                <span className="breadcrumb-number">{stepNumber}</span>
                                <span className="breadcrumb-label">{label}</span>
                                {isCompleted && (
                                    <svg
                                        className="breadcrumb-check"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        width="16"
                                        height="16"
                                    >
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </motion.button>
                            {index < labels.length - 1 && (
                                <svg
                                    className="breadcrumb-arrow"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                >
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <div className="nav-buttons">
                <motion.button
                    className="nav-btn nav-btn-back"
                    onClick={() => onNavigate(currentStep - 1)}
                    disabled={currentStep <= 1}
                    whileHover={currentStep > 1 ? { x: -3 } : {}}
                    whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Back</span>
                </motion.button>

                <motion.button
                    className="nav-btn nav-btn-next"
                    onClick={() => onNavigate(currentStep + 1)}
                    disabled={currentStep >= 4 || currentStep >= maxReachedStep}
                    whileHover={currentStep < 4 && currentStep < maxReachedStep ? { x: 3 } : {}}
                    whileTap={currentStep < 4 && currentStep < maxReachedStep ? { scale: 0.95 } : {}}
                >
                    <span>Next</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default NavigationBar;
