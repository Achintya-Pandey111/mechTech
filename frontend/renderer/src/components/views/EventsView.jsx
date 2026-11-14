import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockEvents } from '../../services/mockData.js';
import { Calendar, MapPin, Users, Plus, CheckCircle2, Clock, X } from 'lucide-react';

export const EventsView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [isCreating, setIsCreating] = useState(false);

  // New Event Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        if (data?.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (err) {
        // Keeps mock events
      }
    };
    fetchEvents();
  }, []);

  const handleToggleRegistration = async (eventId) => {
    setEvents(
      events.map((ev) => {
        if (ev.id === eventId) {
          const registered = !ev.isRegistered;
          const count = (ev._count?.registrations || 0) + (registered ? 1 : -1);
          return {
            ...ev,
            isRegistered: registered,
            _count: { registrations: Math.max(0, count) },
          };
        }
        return ev;
      })
    );

    try {
      const target = events.find((e) => e.id === eventId);
      if (target?.isRegistered) {
        await api.unregisterEvent(eventId);
      } else {
        await api.registerEvent(eventId);
      }
    } catch (err) {
      // preview update
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const newEvent = {
      id: `ev-${Date.now()}`,
      title,
      description,
      startsAt: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      location,
      createdBy: { name: user?.name, role: user?.role },
      _count: { registrations: 1 },
      isRegistered: true,
    };

    try {
      await api.createEvent(newEvent);
    } catch (err) {
      // preview update
    }

    setEvents([newEvent, ...events]);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setStartsAt('');
    setLocation('');
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
            Events & Technical Workshops
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Join webinars, alumni AMAs, and campus workshops organized by the community.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setIsCreating(true)}>
          <Plus size={15} /> Host Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {events.map((ev) => (
          <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#818cf8', fontSize: '13px', fontWeight: '600' }}>
                <Calendar size={15} />
                <span>
                  {new Date(ev.startsAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                {ev.title}
              </h3>

              {ev.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                  <MapPin size={14} /> {ev.location}
                </div>
              )}

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                {ev.description}
              </p>
            </div>

            <div
              style={{
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)' }}>
                <Users size={14} />
                <span>{ev._count?.registrations || 0} Registered</span>
              </div>

              <button
                className={`btn btn-sm ${ev.isRegistered ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleToggleRegistration(ev.id)}
              >
                {ev.isRegistered ? (
                  <>
                    <CheckCircle2 size={14} color="#10b981" /> Registered
                  </>
                ) : (
                  'RSVP / Register'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Host Event Modal */}
      {isCreating && (
        <div className="modal-overlay" onClick={() => setIsCreating(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                Host an Event or Meetup
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ padding: '20px' }}>
              <div className="input-group">
                <label className="input-label">Event Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. System Design Primer & Career AMA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Location / Link</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Google Meet or Auditorium A"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Event Description & Agenda</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  placeholder="Describe topics covered, target audience, and what students will learn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsView;
