import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { confirmAndDelete } from '../../utils/confirmAndDelete';
import { useToast } from '../../hooks/useToast';

export default function ViewAllMoments() {
  const [moments, setMoments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const { showToast, Toast } = useToast();

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/moments`);
      const data = res.data;

      // Defensive fallback: ensure it's always an array
      if (Array.isArray(data.moments)) {
        setMoments(data.moments);
      } else if (Array.isArray(data)) {
        setMoments(data);
      } else {
        console.error('Unexpected API response:', data);
        setMoments([]); // prevent crash
      }
    } catch (err) {
      console.error('Failed to fetch moments:', err);
      setMoments([]);
    }
  };


  const startEdit = (moment) => {
    setEditId(moment.id);
    setEditData(moment);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    await axios.put(`${import.meta.env.VITE_API_BASE}/api/moments/${editId}`, editData);
    showToast('✅ Moment updated!');
    setEditId(null);
    fetchMoments();
  };

  const onDelete = (id) => {
    confirmAndDelete({
      itemLabel: 'moment',
      total: moments.length,
      protectIfOnly: 0,
      toast: showToast,
      onDelete: async () => {
        await axios.delete(`${import.meta.env.VITE_API_BASE}/api/moments/${id}`);
        fetchMoments();
      },
    });
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📸 View All Moments</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {moments.map((moment) => (
          <div key={moment.id} className="col">
            <div className="card h-100">
              {moment.imageId && (
                <img
                  src={`${import.meta.env.VITE_API_BASE}/api/images/${moment.imageId}`}
                  className="card-img-top"
                  alt={moment.title}
                />
              )}
              <div className="card-body">
                {editId === moment.id ? (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-success" onClick={saveEdit}>💾 Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>❌ Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{moment.title}</h5>
                    <p className="card-text">{moment.description}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(moment)}>✏️ Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(moment.id)}>🗑️ Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Toast />
    </div>
  );
}
