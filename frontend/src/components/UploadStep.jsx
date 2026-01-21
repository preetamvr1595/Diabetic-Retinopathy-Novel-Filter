import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileMedical } from 'react-icons/fa';

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
        <div className="glass-card p-5 text-center mx-auto" style={{ maxWidth: '700px' }}>
            <div className="mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                    <FaFileMedical size={40} />
                </div>
                <h2 className="text-dark">Upload Patient Fundus Image</h2>
                <p className="text-muted-custom">Supported formats: JPG, PNG, TIFF. Ensure high resolution for best accuracy.</p>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 rounded-3 p-5 cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-dashed border-secondary bg-light'}`}
                style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="position-relative">
                        <img src={preview} alt="Preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: '280px' }} />
                        <div className="mt-2 text-primary fw-semibold">Click to change image</div>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt size={64} className="mb-3 text-secondary" />
                        <h5 className="text-dark">Drag & Drop or Click to Upload</h5>
                        <p className="text-muted small">Secure DICOM/Image Transfer</p>
                    </>
                )}
            </div>

            {uploading && (
                <div className="mt-4">
                    <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-muted mt-2 small">Processing image algorithms...</p>
                </div>
            )}
        </div>
    );
};

export default UploadStep;
