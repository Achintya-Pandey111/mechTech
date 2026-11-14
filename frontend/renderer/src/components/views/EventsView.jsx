import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { mockEvents } from '../../services/mockData.js';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  X,
  Users,
  CheckCircle,
} from 'lucide-react';

export const EventsView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [isCreating, setIsCreating] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState({});

  // New event form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

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

  const handleRegisterEvent = (eventId) => {
    setRegisteredEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createEvent({
        title,
        description,
        location,
        startsAt,
        endsAt: endsAt || null,
      });

      const newEvent = data?.event || {
        id: `ev-${Date.now()}`,
        title,
        description,
        location,
        startsAt,
        endsAt,
        organizer: { user: { name: user?.name || 'Community Member' } },
        _count: { attendees: 1 },
      };

      setEvents([newEvent, ...events]);
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setStartsAt('');
      setEndsAt('');
    } catch (err) {
      alert('Could not publish event: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-chocolate)', fontSize: '13px', fontWeight: '600' }}>
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

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={14} /> {((ev._count?.attendees || 0) + (registeredEvents[ev.id] ? 1 : 0))} attending
              </div>

              <button
                className={`btn btn-sm ${registeredEvents[ev.id] ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleRegisterEvent(ev.id)}
              >
                {registeredEvents[ev.id] ? (
                  <>
                    <CheckCircle size={14} color="var(--success)" /> Registered
                  </>
                ) : (
                  'RSVP Attend'
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
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                Host an Event or Meet
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
                  placeholder="e.g. Alumni AMA: Navigating Tech in 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Location / Link</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Auditorium Hall B / Zoom Link"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Event Agenda & Description</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  placeholder="Outline the schedule, speaker details, and who should join..."
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
