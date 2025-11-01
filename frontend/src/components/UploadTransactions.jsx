import React, { useState } from 'react';
import axios from 'axios';

const UploadTransactions = ({ onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/transactions/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Imported ${response.data.imported} transactions.`);
      onComplete?.();
    } catch (error) {
      setMessage(error.response?.data?.detail ?? 'Failed to import file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="action-card">
      <h3>Upload Transactions</h3>
      <p>Drop a CSV exported from your bank (Chase, Amex, Citi, Venmo, etc.).</p>
      <label className="upload">
        <input type="file" accept=".csv" onChange={handleUpload} disabled={isUploading} />
        <span>{isUploading ? 'Uploading…' : 'Choose File'}</span>
      </label>
      {message && <p className="status">{message}</p>}
    </div>
  );
};

export default UploadTransactions;
