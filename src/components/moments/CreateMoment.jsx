import React, { useState } from 'react';
import axios from 'axios';

export default function CreateMoment() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      setStatus('Image and title are required.');
      return;
    }

    try {
      setStatus('Uploading...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      await axios.post(`${import.meta.env.VITE_API_BASE}/api/moments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('✅ Moment uploaded!');
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4 text-center">📸 Create Moment</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
        </div>
        {preview && <img src={preview} alt="Preview" className="img-fluid rounded mb-3" />}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Upload Moment</button>
        {status && <div className="mt-3 alert alert-info text-center">{status}</div>}
      </form>
    </div>
  );
}
