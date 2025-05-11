import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'whitepie_upload_access';
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

export default function LoginGate({ children }) {
  const [entered, setEntered] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.password === import.meta.env.VITE_UPLOAD_PASSWORD) {
      const now = Date.now();
      if (now - saved.timestamp < ONE_MONTH_MS) {
        setEntered(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_UPLOAD_PASSWORD) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ password, timestamp: Date.now() })
      );
      setEntered(true);
    } else {
      setError('Incorrect password.');
    }
  };

  if (entered) return children;

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">🔒 Enter Password</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter upload password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-dark w-100" type="submit">Unlock</button>
      </form>
    </div>
  );
}
