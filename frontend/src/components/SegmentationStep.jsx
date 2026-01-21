import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SegmentationStep = ({ imageId, onNext }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSegmentation = async () => {
            try {
                const res = await axios.get(`/api/segment/${imageId}`);
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchSegmentation();
    }, [imageId]);

    if (loading) return (
        <div className="text-center py-5">
            <h3 className="text-light">Generating Lesion Segmentation Map...</h3>
            <div className="spinner-border text-info mt-3" role="status"></div>
            <p className="text-muted mt-2">Running Attention U-Net Model</p>
        </div>
    );

    if (!data) return (
        <div className="text-center text-danger py-5">
            <h3>Error Loading Segmentation</h3>
            <p>Could not process image. Please try again.</p>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Restart</button>
        </div>
    );

    return (
        <div className="container px-4">
            <div className="text-center mb-5">
                <h2 className="display-6 fw-bold text-dark">Lesion Detection & Segmentation</h2>
                <p className="text-muted">pixel-wise classification using Attention U-Net</p>
            </div>

            <div className="row justify-content-center align-items-center g-4">
                <div className="col-md-5">
                    <motion.div
                        className="glass-card p-3 text-center h-100 position-relative"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="badge bg-secondary position-absolute top-0 start-0 m-3">Input</span>
                        <img src={`data:image/jpeg;base64,${data.original}`} className="img-fluid rounded shadow-sm" alt="Original" />
                        <h5 className="mt-3 text-dark">Original Retinal Image</h5>
                    </motion.div>
                </div>

                <div className="col-md-1 d-none d-md-block text-center text-muted">
                    <i className="bi bi-arrow-right display-5"></i>
                </div>

                <div className="col-md-5">
                    <motion.div
                        className="glass-card p-3 text-center h-100 position-relative"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="badge bg-primary position-absolute top-0 start-0 m-3">Prediction</span>
                        <img src={`data:image/jpeg;base64,${data.mask}`} className="img-fluid rounded shadow-sm" alt="Mask" style={{ border: '2px solid #0d6efd' }} />
                        <h5 className="mt-3 text-primary fw-bold">Generated Lesion Mask</h5>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="glass-card mt-5 p-4 text-center mx-auto"
                style={{ maxWidth: '700px' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h5 className="mb-3">Clinical Interpretation</h5>
                <p className="text-muted">
                    The highlighting in the segmentation mask corresponds to detected regions of
                    <strong> exudates, cotton wool spots, and microaneurysms</strong>.
                    These features are critical indicators of Diabetic Retinopathy severity.
                </p>
                <button className="btn btn-premium btn-lg px-5 mt-2" onClick={onNext}>
                    Proceed to Classification <i className="bi bi-activity ms-2"></i>
                </button>
            </motion.div>
        </div>
    );
};

export default SegmentationStep;
