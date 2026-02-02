import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileMedical } from 'react-icons/fa';
import EyeScannerLoading from './EyeScannerLoading';

const UploadStep = ({ onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTimeout(() => {
                onUpload(res.data.id, res.data.base64);
            }, 800);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    return (
        <div className="glass-card medical-card p-5 text-center mx-auto" style={{ maxWidth: '700px' }}>
            <div className="mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3" style={{ background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.1), rgba(0, 168, 232, 0.1))' }}>
                    <FaFileMedical size={40} color="#0066CC" />
                </div>
                <h2 className="text-dark" style={{ color: '#0066CC' }}>Upload Patient Fundus Image</h2>
                <p className="text-muted-custom">Supported formats: JPG, PNG, TIFF. Ensure high resolution for best accuracy.</p>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 rounded-3 p-5 cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-dashed border-secondary bg-light'}`}
                style={{
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: isDragActive ? '#0066CC' : '#B3D9FF',
                    background: isDragActive ? 'rgba(0, 102, 204, 0.05)' : '#F8FBFF'
                }}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="position-relative">
                        <img src={preview} alt="Preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: '280px', border: '3px solid #0066CC' }} />
                        <div className="mt-2 fw-semibold" style={{ color: '#0066CC' }}>Click to change image</div>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt size={64} className="mb-3" color="#0066CC" />
                        <h5 className="text-dark">Drag & Drop or Click to Upload</h5>
                        <p className="text-muted small">Secure Medical Image Transfer</p>
                    </>
                )}
            </div>

            {uploading && (
                <div className="mt-5">
                    <EyeScannerLoading size="medium" message="Processing retinal image..." />
                </div>
            )}
        </div>
    );
};

export default UploadStep;
