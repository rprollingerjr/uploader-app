import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const groups = [
    {
      title: '📸 Moments',
      description: 'Manage photo moments from events and pop-ups.',
      methods: [
        { name: 'Create Moment', path: '/moments/create' },
        { name: 'View All Moments', path: '/moments' },
      ],
    },
    {
      title: '📅 Events',
      description: 'Create and edit upcoming events.',
      methods: [
        { name: 'Create Event', path: '/events/create' },
        { name: 'View All Events', path: '/events' },
      ],
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🍕 Hi Vanessa!</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {groups.map((group) => (
          <div className="col" key={group.title}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{group.title}</h5>
                <p className="card-text">{group.description}</p>
                <div className="mt-auto d-flex flex-column gap-2">
                  {group.methods.map((method) => (
                    <button
                      key={method.path}
                      className="btn btn-outline-primary text-start"
                      onClick={() => navigate(method.path)}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
