import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FilterStep = ({ imageId, onNext }) => {
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bestFilter, setBestFilter] = useState("ACE_ME_Novel");

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await axios.get(`/api/filters/${imageId}`);
                // Move Recommended (ACE_ME_Novel) to top if present, or sort by specific logic
                // Ensure 14 filters are shown
                let data = res.data;
                const novel = data.find(f => f.name === 'ACE_ME_Novel');
                const others = data.filter(f => f.name !== 'ACE_ME_Novel');

                // Sort others by SSIM desc
                others.sort((a, b) => (b.metrics?.SSIM || 0) - (a.metrics?.SSIM || 0));

                if (novel) {
                    setFilters([novel, ...others]);
                    setBestFilter('ACE_ME_Novel');
                } else {
                    setFilters(others);
                    if (others.length > 0) setBestFilter(others[0].name);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to generate filters. Please try again.");
                setLoading(false);
            }
        };
        fetchFilters();
    }, [imageId]);

    if (loading) return (
        <div className="text-center py-5">
            <h3 className="text-muted-custom">Applying Advanced Clinical Filters...</h3>
            <div className="spinner-border text-primary mt-3" role="status"></div>
            <p className="text-muted mt-2">Computing PSNR, SSIM, and MSE metrics for 14 filters</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-5 text-danger">
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-dark">Preprocessing & Enhancement</h2>
                <button className="btn btn-premium" onClick={onNext}>
                    Proceed to Segmentation <i className="bi bi-arrow-right ms-2"></i>
                </button>
            </div>

            {/* Filter Grid */}
            <div className="row g-4 mb-5" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filters.map((f, idx) => (
                    <div key={idx} className="col-lg-2 col-md-3 col-sm-4 col-6">
                        <motion.div
                            className={`glass-card p-2 text-center h-100 ${f.name === bestFilter ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={`data:image/jpeg;base64,${f.image}`}
                                    className="img-fluid rounded mb-2"
                                    alt={f.name}
                                    style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                                />
                                {f.name === bestFilter && (
                                    <div className="position-absolute top-0 end-0 badge bg-success m-1">Best</div>
                                )}
                            </div>
                            <h6 className={`mb-1 ${f.name === bestFilter ? 'text-primary fw-bold' : 'text-dark'}`} style={{ fontSize: '0.85rem' }}>
                                {f.name.replace(/_/g, ' ')}
                            </h6>
                            <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                                SSIM: {f.metrics?.SSIM?.toFixed(3)}
                            </small>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="glass-card p-4">
                <h4 className="mb-3 text-dark border-bottom pb-2">Quantitative Metrics Analysis</h4>
                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                    <table className="table table-hover align-middle table-sm">
                        <thead className="table-light sticky-top">
                            <tr>
                                <th>Filter Name</th>
                                <th>PSNR (dB)</th>
                                <th>SSIM (0-1)</th>
                                <th>MSE</th>
                                <th>Entropy</th>
                                <th>CII</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filters.map((f, idx) => (
                                <tr key={idx} className={f.name === bestFilter ? 'table-primary fw-bold' : ''}>
                                    <td>{f.name.replace(/_/g, ' ')}</td>
                                    <td>{f.metrics?.PSNR !== undefined ? f.metrics.PSNR.toFixed(2) : '-'}</td>
                                    <td>{f.metrics?.SSIM !== undefined ? f.metrics.SSIM.toFixed(4) : '-'}</td>
                                    <td>{f.metrics?.MSE !== undefined ? f.metrics.MSE.toFixed(2) : '-'}</td>
                                    <td>{f.metrics?.Entropy !== undefined ? f.metrics.Entropy.toFixed(2) : '-'}</td>
                                    <td>{f.metrics?.CII !== undefined ? f.metrics.CII.toFixed(4) : '-'}</td>
                                    <td>
                                        {f.name === bestFilter ? (
                                            <span className="text-success"><i className="bi bi-star-fill me-1"></i> Recommended</span>
                                        ) : (
                                            <span className="text-muted">Analyzed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FilterStep;
