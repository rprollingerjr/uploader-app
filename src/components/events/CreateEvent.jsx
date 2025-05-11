import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';

export default function CreateEvent() {
  const { showToast, Toast } = useToast();

  const [event, setEvent] = useState({
    eventTitle: '',
    description: '',
    ticketUrl: '',
    city: '',
    state: '',
    startTime: '',
    endTime: '',
    isEdibleMamiHosted: false,
    imageId: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleCheckbox = () => {
    setEvent({ ...event, isEdibleMamiHosted: !event.isEdibleMamiHosted });
    if (!event.isEdibleMamiHosted) {
      setImageFile(null);
      setEvent((prev) => ({ ...prev, imageId: '' }));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/images/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return res.data.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageId = event.isEdibleMamiHosted
        ? ''
        : (await handleImageUpload()) || '';

      const payload = {
        ...event,
        imageId,
        startTime: new Date(event.startTime).toISOString(),
        endTime: new Date(event.endTime).toISOString()
      };

      await axios.post(`${import.meta.env.VITE_API_BASE}/api/events`, payload);

      showToast('✅ Event created!');
      setEvent({
        eventTitle: '',
        description: '',
        ticketUrl: '',
        city: '',
        state: '',
        startTime: '',
        endTime: '',
        isEdibleMamiHosted: false,
        imageId: ''
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to create event.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h3 className="mb-4 text-center">📅 Create Event</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Event Title"
          name="eventTitle"
          value={event.eventTitle}
          onChange={handleChange}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          name="description"
          value={event.description}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Ticket URL (optional)"
          name="ticketUrl"
          value={event.ticketUrl}
          onChange={handleChange}
        />
        <div className="row g-2">
          <div className="col">
            <input
              className="form-control"
              placeholder="City"
              name="city"
              value={event.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="State"
              name="state"
              value={event.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col">
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="startTime"
              value={event.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="endTime"
              value={event.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-check form-switch mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={event.isEdibleMamiHosted}
            onChange={handleCheckbox}
            id="hostedToggle"
          />
          <label className="form-check-label" htmlFor="hostedToggle">
            Hosted by EdibleMami?
          </label>
        </div>

        {!event.isEdibleMamiHosted && (
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxHeight: '180px' }}
              />
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success px-4">💾 Save Event</button>
        </div>
      </form>
      <Toast />
    </div>
  );
}
