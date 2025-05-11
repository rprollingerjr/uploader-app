import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/useToast.jsx';

export default function EditAbout() {
    const [about, setAbout] = useState(null);
    const [heroImageFile, setHeroImageFile] = useState(null);
    const PUBLIC_BASE = import.meta.env.VITE_PUBLIC_SITE_BASE;
    const [showViewLink, setShowViewLink] = useState(false);
    const { showToast, Toast } = useToast();

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/about`);
            setAbout(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setAbout({ ...about, [e.target.name]: e.target.value });
    };

    const handleSectionChange = (index, field, value) => {
        const updated = [...about.sections];
        updated[index][field] = value;
        setAbout({ ...about, sections: updated });
    };

    const handleSectionImageUpload = async (index, file) => {
        if (!file) return;
        if (!about?.sections || !about.sections[index]) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE}/api/images/upload`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const updatedSections = [...about.sections];
            updatedSections[index] = {
                ...updatedSections[index],
                imageId: res.data.id
            };

            setAbout((prev) => ({
                ...prev,
                sections: updatedSections,
            }));

            showToast('✅ Section image uploaded!');
        } catch (err) {
            console.error('Image upload failed:', err);
            showToast('❌ Failed to upload section image.');
        }
    };


    const addSection = () => {
        setAbout({
            ...about,
            sections: [...about.sections, { title: '', text: '', imageId: '' }]
        });
    };

    const removeSection = (index) => {
        const updated = [...about.sections];
        updated.splice(index, 1);
        setAbout({ ...about, sections: updated });
    };

    const save = async () => {
        try {
            let updatedAbout = { ...about };

            if (heroImageFile) {
                const formData = new FormData();
                formData.append('file', heroImageFile);

                const uploadRes = await axios.post(
                    `${import.meta.env.VITE_API_BASE}/api/images/upload`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );

                updatedAbout.heroImageId = uploadRes.data.id;
            }

            await axios.put(`${import.meta.env.VITE_API_BASE}/api/about`, updatedAbout);
            setHeroImageFile(null);
            setShowViewLink(true);
            showToast('✅ About content saved!');
        } catch (err) {
            console.error(err);
            showToast('❌ Failed to save changes.');
        }
    };

    if (!about) return <div>Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <h3 className="text-center mb-4">📝 Edit About Page</h3>

            <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" name="title" value={about.title} onChange={handleChange} />
            </div>

            <div className="mb-3">
                <label className="form-label">Subtitle</label>
                <input className="form-control" name="subtitle" value={about.subtitle} onChange={handleChange} />
            </div>

            <div className="mb-3">
                <label className="form-label">Hero Image</label>
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files[0] || null)}
                />
                <small className="text-muted">Recommended size: 1200x800 (3:2 ratio)</small>

                {heroImageFile && (
                    <div className="mt-3">
                        <p className="small text-muted">📤 New image ready to upload:</p>
                        <img
                            src={URL.createObjectURL(heroImageFile)}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                )}

                {!heroImageFile && about.heroImageId && (
                    <div className="mt-3">
                        <p className="small text-muted">📂 Currently uploaded image:</p>
                        <img
                            src={`${import.meta.env.VITE_API_BASE}/api/images/${about.heroImageId}`}
                            alt="Existing Hero"
                            className="img-thumbnail"
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea className="form-control" name="bio" rows="4" value={about.bio} onChange={handleChange} />
            </div>

            <hr />

            <h5>📦 Portfolio Sections</h5>

            {about.sections.map((section, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                    <div className="mb-2">
                        <label className="form-label">Title</label>
                        <input
                            className="form-control"
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Text</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={section.text}
                            onChange={(e) => handleSectionChange(index, 'text', e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Section Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => handleSectionImageUpload(index, e.target.files[0])}
                        />
                        {section.imageId && (
                            <img
                                src={`${import.meta.env.VITE_API_BASE}/api/images/${section.imageId}`}
                                className="img-thumbnail mt-2"
                                style={{ maxHeight: '150px' }}
                                alt="Section Preview"
                            />
                        )}
                    </div>
                    <div className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeSection(index)}>
                            🗑 Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className="mb-4 text-center">
                <button className="btn btn-sm btn-outline-primary" onClick={addSection}>
                    ➕ Add Section
                </button>
            </div>

            <div className="text-center">
                {about.lastUpdated && (
                    <p className="text-muted text-center">
                        Last updated: {new Date(about.lastUpdated).toLocaleString()}
                    </p>
                )}
                <button className="btn btn-success px-4" onClick={save}>💾 Save Changes</button>
            </div>

            {showViewLink && (
                <div className="text-center mt-3">
                    <a
                        href={`${PUBLIC_BASE}/about`}
                        className="btn btn-sm btn-outline-dark"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔗 View About Page
                    </a>
                </div>
            )}

            <Toast />
        </div>
    );
}