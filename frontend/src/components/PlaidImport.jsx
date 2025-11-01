import React, { useState } from 'react';
import axios from 'axios';

const PlaidImport = ({ onComplete }) => {
  const [form, setForm] = useState({ accessToken: '', startDate: '', endDate: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.accessToken || !form.startDate || !form.endDate) {
      setStatus('Fill in all Plaid details.');
      return;
    }

    setIsLoading(true);
    setStatus('');
    try {
      const response = await axios.post('/api/transactions/import/plaid', {
        access_token: form.accessToken,
        start_date: form.startDate,
        end_date: form.endDate,
      });
      setStatus(`Imported ${response.data.imported} transactions from Plaid.`);
      onComplete?.();
    } catch (error) {
      setStatus(error.response?.data?.detail ?? 'Plaid import failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="action-card">
      <h3>Plaid Import</h3>
      <p>Provide an access token to pull transactions from linked Plaid accounts.</p>
      <form onSubmit={handleSubmit}>
        <input
          name="accessToken"
          placeholder="Access token"
          value={form.accessToken}
          onChange={handleChange}
        />
        <div className="date-range">
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Syncing…' : 'Sync with Plaid'}
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default PlaidImport;
