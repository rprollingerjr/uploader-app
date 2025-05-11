import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';
import { confirmAndDelete } from '../../utils/confirmAndDelete';

export default function ViewAllEvents() {
  const [events, setEvents] = useState([]);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        showToast('❌ Failed to load events.');
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...events];
    updated[index][field] = value;
    setEvents(updated);
  };

  const handleSave = async (index) => {
    const updatedEvent = events[index];
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE}/api/events/${updatedEvent.id}`, {
        ...updatedEvent,
        startTime: new Date(updatedEvent.startTime).toISOString(),
        endTime: new Date(updatedEvent.endTime).toISOString()
      });
      showToast('✅ Event updated!');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to update event.');
    }
  };

  const handleDelete = (id, index) => {
    confirmAndDelete({
      onDelete: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE}/api/events/${id}`);
          const updated = [...events];
          updated.splice(index, 1);
          setEvents(updated);
          showToast('🗑 Event deleted!');
        } catch (err) {
          console.error(err);
          showToast('❌ Failed to delete.');
        }
      },
      itemLabel: 'event',
      toast: showToast,
      total: events.length
    });
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h3 className="mb-4 text-center">📅 View All Events</h3>

      {events.length === 0 ? (
        <p className="text-muted text-center">No events yet.</p>
      ) : (
        events.map((event, i) => (
          <div key={event.id} className="border rounded p-3 mb-3">
            <div className="row g-3 align-items-center">
              {/* Image */}
              <div className="col-md-2 text-center">
                <img
                  src={
                    event.isEdibleMamiHosted || !event.imageId
                      ? '/pizza.png'
                      : `${import.meta.env.VITE_API_BASE}/api/images/${event.imageId}`
                  }
                  alt="Event"
                  className="img-fluid rounded"
                  style={{ maxHeight: '180px', objectFit: 'cover', objectPosition: 'center' }}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = '/pizza.png';
                  }}
                />

              </div>

              {/* Editable Fields */}
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={event.eventTitle}
                      onChange={(e) => handleChange(i, 'eventTitle', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={event.ticketUrl}
                      onChange={(e) => handleChange(i, 'ticketUrl', e.target.value)}
                      placeholder="Ticket URL (Optional)"
                    />
                  </div>
                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      rows="2"
                      value={event.description}
                      onChange={(e) => handleChange(i, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={event.startTime?.slice(0, 16)}
                      onChange={(e) => handleChange(i, 'startTime', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={event.endTime?.slice(0, 16)}
                      onChange={(e) => handleChange(i, 'endTime', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={event.city}
                      onChange={(e) => handleChange(i, 'city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={event.state}
                      onChange={(e) => handleChange(i, 'state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>

                {event.isEdibleMamiHosted && (
                  <div className="mt-2">
                    <span className="badge bg-warning text-dark">🎉 EdibleMami Hosted</span>
                  </div>
                )}

                <div className="mt-3 text-end">
                  <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDelete(event.id, i)}>
                    🗑 Delete
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={() => handleSave(i)}>
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <Toast />
    </div>
  );
}
