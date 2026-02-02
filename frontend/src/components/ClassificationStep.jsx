import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import EyeScannerLoading from './EyeScannerLoading';

const ClassificationStep = ({ imageId, onRestart }) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassification = async () => {
            try {
                const res = await axios.get(`/api/classify/${imageId}`);
                setResult(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchClassification();
    }, [imageId]);

    if (loading) return (
        <div className="text-center py-5">
            <EyeScannerLoading size="large" message="Finalizing Diagnosis..." />
            <p className="text-muted mt-4" style={{ color: '#0066CC', fontWeight: 500 }}>Running DR Classifier Model</p>
        </div>
    );

    const getSeverityConfig = (label) => {
        if (label === 'No_DR') return { color: '#10b981', text: 'No Diabetic Retinopathy', bg: 'rgba(16, 185, 129, 0.1)' };
        if (label === 'Mild_DR') return { color: '#f59e0b', text: 'Mild Diabetic Retinopathy', bg: 'rgba(245, 158, 11, 0.1)' };
        if (label === 'Moderate_DR') return { color: '#f97316', text: 'Moderate Diabetic Retinopathy', bg: 'rgba(249, 115, 22, 0.1)' };
        if (label === 'Severe_DR') return { color: '#ef4444', text: 'Severe Diabetic Retinopathy', bg: 'rgba(239, 68, 68, 0.1)' };
        return { color: '#6366f1', text: label.replace(/_/g, ' '), bg: 'rgba(99, 102, 241, 0.1)' };
    };

    const percentage = Math.round(result.confidence * 100);
    const { color, text, bg } = getSeverityConfig(result.label);
    const blueColor = '#0066CC'; // Use consistent blue for medical theme

    return (
        <div className="container" style={{ maxWidth: '900px' }}>
            <h2 className="text-center mb-5 fw-bold" style={{ color: '#0066CC' }}>Diagnostic Report</h2>

            <div className="glass-card medical-card p-5 text-center shadow-lg position-relative overflow-hidden" style={{ border: '2px solid #B3D9FF' }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #0066CC, #00A8E8)'
                }}></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h5 className="text-muted mb-4 text-uppercase tracking-wider" style={{ color: '#4A5568' }}>Detected Condition</h5>

                    <h1 className="display-4 fw-bold mb-4" style={{ color: color }}>
                        {text}
                    </h1>

                    <div className="p-4 rounded-3 mb-4 mx-auto" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 168, 232, 0.05))', maxWidth: '600px', border: '2px solid #B3D9FF' }}>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold" style={{ color: blueColor }}>Model Confidence</span>
                            <span className="fw-bold" style={{ color: blueColor }}>{percentage}%</span>
                        </div>
                        <div className="progress" style={{ height: '12px', background: 'rgba(0, 102, 204, 0.1)' }}>
                            <motion.div
                                className="progress-bar progress-bar-striped progress-bar-animated rounded-pill"
                                role="progressbar"
                                style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #0066CC, #00A8E8)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                            </motion.div>
                        </div>
                    </div>

                    <p className="text-muted mb-5">
                        The model has analyzed the retinal features and identified patterns consistent with
                        <strong> {text}</strong> with {percentage}% certainty.
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn rounded-pill px-4" onClick={onRestart} style={{ background: 'white', border: '2px solid #0066CC', color: '#0066CC', fontWeight: 600 }}>
                            <i className="bi bi-upload me-2"></i>Analyze Another Image
                        </button>
                        <button className="btn rounded-pill px-4" style={{ background: 'linear-gradient(135deg, #0066CC, #00A8E8)', color: 'white', border: 'none', fontWeight: 600 }}>
                            <i className="bi bi-file-earmark-pdf me-2"></i>Download Report
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ClassificationStep;
