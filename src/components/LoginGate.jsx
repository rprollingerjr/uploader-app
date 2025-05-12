import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'whitepie_upload_access';
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

export default function LoginGate({ children }) {
  const [entered, setEntered] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const now = Date.now();

    if (saved && saved.timestamp && now - saved.timestamp < ONE_MONTH_MS) {
      setEntered(true);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // ❗ Prevent page reload
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          timestamp: Date.now()
        }));
        setEntered(true);
      } else {
        const result = await response.json();
        toast.error(result.message || "Invalid password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
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
        <button className="btn btn-dark w-100" type="submit">Unlock</button>
      </form>
    </div>
  );
}
