import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../hooks/useToast.jsx';
import { confirmAndDelete } from '../utils/confirmAndDelete';

export default function EditMenu() {
  const [menu, setMenu] = useState(null);
  const [events, setEvents] = useState([]);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    fetchMenu();
    fetchEvents();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/menu`);
    setMenu(res.data);
  };

  const fetchEvents = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/events`);
    setEvents(res.data);
  };

  const handleMenuChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const addTheme = () => {
    setMenu({
      ...menu,
      themes: [
        ...menu.themes,
        { id: crypto.randomUUID(), title: '', description: '', items: [], eventIds: [] }
      ]
    });
  };

  const updateTheme = (index, field, value) => {
    const updated = [...menu.themes];
    updated[index][field] = value;
    setMenu({ ...menu, themes: updated });
  };

  const addItem = (themeIndex) => {
    const updated = [...menu.themes];
    updated[themeIndex].items.push({
      name: '',
      description: '',
      price: '',
      imageId: ''
    });
    setMenu({ ...menu, themes: updated });
  };

  const updateItem = (themeIndex, itemIndex, field, value) => {
    const updated = [...menu.themes];
    updated[themeIndex].items[itemIndex][field] = value;
    setMenu({ ...menu, themes: updated });
  };

  const uploadImage = async (file, themeIndex, itemIndex) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateItem(themeIndex, itemIndex, 'imageId', res.data.id);
      showToast('📸 Image uploaded');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('❌ Failed to upload image');
    }
  };

  const updateEventLinks = (themeIndex, selectedIds) => {
    const updated = [...menu.themes];
    updated[themeIndex].eventIds = selectedIds;
    setMenu({ ...menu, themes: updated });
  };

  const deleteItem = (themeIndex, itemIndex) => {
    confirmAndDelete({
      onDelete: () => {
        const updated = [...menu.themes];
        updated[themeIndex].items.splice(itemIndex, 1);
        setMenu({ ...menu, themes: updated });
      },
      itemLabel: 'menu item',
      total: menu.themes[themeIndex].items.length,
      protectIfOnly: 0,
      toast: showToast
    });
  };

  const deleteTheme = (index) => {
    confirmAndDelete({
      onDelete: () => {
        const updated = [...menu.themes];
        updated.splice(index, 1);
        setMenu({ ...menu, themes: updated });
      },
      itemLabel: 'menu theme',
      total: menu.themes.length,
      protectIfOnly: 1,
      toast: showToast
    });
  };

  const saveMenu = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE}/api/menu`, menu);
      showToast('✅ Menu saved!');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to save.');
    }
  };

  if (!menu) return <div>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h3 className="text-center mb-4">🍽️ Edit Menu</h3>

      <div className="mb-3">
        <label className="form-label">Caption</label>
        <input
          className="form-control"
          name="caption"
          value={menu.caption}
          onChange={handleMenuChange}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Footer Note</label>
        <input
          className="form-control"
          name="footerNote"
          value={menu.footerNote}
          onChange={handleMenuChange}
        />
      </div>

      <h5 className="mb-3">🍕 Menu Themes</h5>
      {menu.themes.map((theme, themeIndex) => (
        <div key={theme.id} className="border p-3 rounded mb-4">
          <h6>Theme #{themeIndex + 1}</h6>

          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={theme.title}
              onChange={(e) => updateTheme(themeIndex, 'title', e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="2"
              value={theme.description}
              onChange={(e) => updateTheme(themeIndex, 'description', e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Linked Events</label>
            <select
              multiple
              className="form-control"
              value={theme.eventIds}
              onChange={(e) =>
                updateEventLinks(
                  themeIndex,
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.eventTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <strong>Items</strong>
            {theme.items.map((item, itemIndex) => (
              <div key={itemIndex} className="border rounded p-2 mb-3 position-relative">
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-2"
                  aria-label="Delete"
                  onClick={() => deleteItem(themeIndex, itemIndex)}
                ></button>

                <input
                  className="form-control mb-1"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(themeIndex, itemIndex, 'name', e.target.value)
                  }
                />
                <textarea
                  className="form-control mb-1"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(themeIndex, itemIndex, 'description', e.target.value)
                  }
                />
                <input
                  className="form-control mb-1"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(themeIndex, itemIndex, 'price', e.target.value)
                  }
                />

                {/* ✅ Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => uploadImage(e.target.files[0], themeIndex, itemIndex)}
                />

                {/* ✅ Image Preview */}
                {item.imageId && (
                  <img
                    src={`${import.meta.env.VITE_API_BASE}/api/images/${item.imageId}`}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    style={{ maxHeight: '150px' }}
                  />
                )}
              </div>
            ))}

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => addItem(themeIndex)}
            >
              ➕ Add Item
            </button>
          </div>

          <div className="text-end mt-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteTheme(themeIndex)}
            >
              🗑️ Delete Theme
            </button>
          </div>
        </div>
      ))}

      <div className="mb-4 text-center">
        <button className="btn btn-outline-secondary me-3" onClick={addTheme}>
          ➕ Add Theme
        </button>
        <button className="btn btn-success" onClick={saveMenu}>
          💾 Save Menu
        </button>
      </div>

      <Toast />
    </div>
  );
}
