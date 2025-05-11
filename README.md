
# EdibleMami Project Documentation

This documentation covers both parts of the EdibleMami web presence:
- **Public Site (`whitepie-app`)**: The main brand-facing React app for showcasing EdibleMami.
- **Uploader App (`uploader-app`)**: A private CMS-like React tool for editing and managing content.

---

## Table of Contents

- [Overview](#overview)
- [whitepie-app](#whitepie-app)
  - [Features](#features)
  - [Folder Structure](#folder-structure)
- [uploader-app](#uploader-app)
  - [Features](#features-1)
  - [Folder Structure](#folder-structure-1)
  - [User Manual](#user-manual)
- [Shared Architecture](#shared-architecture)
- [Environment Variables](#environment-variables)
- [API Dependencies](#api-dependencies)

---

## Overview

EdibleMami is a pizza pop-up business that showcases its events, menus, and brand moments through a public site while managing content through an internal uploader interface. The backend is powered by a centralized .NET Core Web API, which serves data to both applications.

---

## whitepie-app

This is the **public-facing** React SPA for users, fans, and potential clients.

### Features

- Animated hero section with logo and imagery
- Upcoming events layout with branding
- Moment-based gallery with infinite scroll
- Mobile-responsive layout
- Styled with Bootstrap and custom SCSS
- Contact form for inquiries or bookings
- Menu page showcasing themed items and upcoming event associations

### Folder Structure

- `components/`: Shared UI components (EventCard, BrandButton, Navbar, etc.)
- `pages/`: All major routes (Home, Events, About, Menu, Gallery, BookMe)
- `services/`: Axios API client wrappers
- `styles/`: Global and section-based SCSS
- `assets/`: Brand logos and images
- `App.jsx`, `main.jsx`: Routing and app bootstrapping

---

## uploader-app

This is the **private dashboard** used to upload and manage content.

### Features

- Login gate with basic password guard
- CRUD dashboard for:
  - Moments (photos for the gallery)
  - Events (including date/time parsing and branding image logic)
  - About page content (title, subtitle, hero image, portfolio sections)
  - Menu page themes and items (including image and price)
- Drag and drop reordering for moments
- Branded toast notifications
- Mobile-optimized layout
- MongoDB + GridFS media support

### Folder Structure

- `components/`: Content editing UIs (EditAbout, EditMenu, Layout, etc.)
- `moments/` and `events/`: Subfolders with View/Create features
- `utils/`: Helper like confirmAndDelete.js
- `hooks/`: Custom toast hook
- `assets/`: Image references
- `App.jsx`, `main.jsx`: Entry routing and layout

---

## User Manual

### Login

1. Open the uploader-app.
2. Enter the password when prompted.
3. You'll be redirected to the Dashboard.

### Moments

- Create new photo entries by uploading an image and setting a title.
- Reorder entries using drag-and-drop.
- Use the Edit or Delete options as needed.

### Events

- Create a new event with time, date, description, and location.
- Toggle if EdibleMami is hosting to control image behavior.
- Automatically sorted by start time.

### Menu

- Configure persistent footer/caption notes.
- Add new "themes" with descriptions and link them to events.
- Under each theme, add menu items (title, description, image, price).

### About Page

- Edit site-wide About text content.
- Upload hero image.
- Manage portfolio content with image upload and preview.

---

## Shared Architecture

Both applications rely on:

- A centralized **.NET Core WebAPI** that:
  - Stores content in MongoDB
  - Uses GridFS to handle image uploads
- Common `VITE_API_BASE` URL pointing to the backend

---

## Environment Variables

Each app uses a `.env` file with keys such as:

```env
VITE_API_BASE=http://localhost:5018
VITE_PUBLIC_SITE_BASE=https://www.ediblemami.com
```

---

## API Dependencies

- `/api/events` – Event creation, listing, sorting
- `/api/moments` – Paginated image gallery
- `/api/about` – Static content and hero image
- `/api/menu` – Menu structure
- `/api/images/upload` – Image upload via GridFS

---

## Notes

- Branding uses yellow `#fdc632` and dark slate backgrounds.
- UI uses Bootstrap 5 and responsive flex/grid.
- Code is modular, accessible, and mobile-first.

