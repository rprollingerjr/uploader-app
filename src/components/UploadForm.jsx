import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      setStatus('Please fill in a title and select an image.');
      return;
    }

    try {
      // Step 1: Upload image
      const imageData = new FormData();
      imageData.append('file', file);

      const uploadRes = await axios.post(`${import.meta.env.VITE_API_BASE}/api/upload`, imageData);
      const imageId = uploadRes.data.id;

      // Step 2: Create moment
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/moments`, {
        title,
        description,
        imageId,
      });

      setStatus('Upload successful!');
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">📤 Add a New Moment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
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
        <button className="btn btn-primary w-100" type="submit">Upload</button>
        {status && <div className="mt-3 alert alert-info">{status}</div>}
      </form>
    </div>
  );
}
