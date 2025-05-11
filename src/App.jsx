import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreateMoment from './components/moments/CreateMoment';
import ViewAllMoments from './components/moments/ViewAllMoments';
import CreateEvent from './components/events/CreateEvent';
import ViewAllEvents from './components/events/ViewAllEvents';
import EditAbout from './components/EditAbout';
import EditMenu from './components/EditMenu';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Nested routes use the Layout */}
        <Route path="moments/create" element={<CreateMoment />} />
        <Route path="moments/view" element={<ViewAllMoments />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/view" element={<ViewAllEvents />} />
        <Route path="about/edit" element={<EditAbout />} />
        <Route path="menu/edit" element={<EditMenu />} />
        <Route path="*" element={<div className="text-center">Select an action from above.</div>} />
      </Route>
    </Routes>
  );
}
