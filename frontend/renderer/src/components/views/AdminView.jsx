import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import {
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Building,
  Plus,
} from 'lucide-react';

export const AdminView = () => {
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalStudents: 104,
    totalAlumni: 38,
    totalColleges: 3,
    totalDepartments: 8,
    totalPosts: 45,
    totalOpportunities: 12,
    totalEvents: 6,
  });

  const [colleges, setColleges] = useState([
    { id: 'col-1', name: 'Institute of Technology', website: 'https://iot.edu' },
    { id: 'col-2', name: 'National Engineering College', website: 'https://nec.edu' },
  ]);

  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeWebsite, setNewCollegeWebsite] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await api.getAdminStats();
        if (statsData) setStats(statsData);
        const colData = await api.getColleges();
        if (colData?.colleges) setColleges(colData.colleges);
      } catch (err) {
        // Keeps mock data
      }
    };
    fetchAdminData();
  }, []);

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;

    const newCol = {
      id: `col-${Date.now()}`,
      name: newCollegeName.trim(),
      website: newCollegeWebsite.trim() || null,
    };

    try {
      await api.createCollege(newCol);
    } catch (err) {
      // preview update
    }

    setColleges([...colleges, newCol]);
    setNewCollegeName('');
    setNewCollegeWebsite('');
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6366f1' },
    { title: 'Enrolled Students', value: stats.totalStudents, icon: GraduationCap, color: '#38bdf8' },
    { title: 'Verified Alumni', value: stats.totalAlumni, icon: Briefcase, color: '#a855f7' },
    { title: 'Colleges & Depts', value: `${stats.totalColleges} / ${stats.totalDepartments}`, icon: Building, color: '#10b981' },
    { title: 'Feed Posts', value: stats.totalPosts, icon: MessageSquare, color: '#f59e0b' },
    { title: 'Active Events', value: stats.totalEvents, icon: Calendar, color: '#ec4899' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
          <ShieldCheck size={16} /> Administrative Portal
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
          Platform Dashboard & Controls
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Monitor community activity, manage institutional structures, and enforce platform security.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {card.title}
                </span>
                <Icon size={18} color={card.color} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Management */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Colleges List */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
            Registered Colleges & Universities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {colleges.map((col) => (
              <div
                key={col.id}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{col.name}</div>
                  {col.website && (
                    <div style={{ fontSize: '12px', color: '#818cf8' }}>{col.website}</div>
                  )}
                </div>
                <span className="badge badge-student" style={{ fontSize: '10px' }}>Active</span>
              </div>
            ))}
          </div>

          {/* Add College Form */}
          <form onSubmit={handleCreateCollege} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              Add New College
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="College Name"
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
                required
              />
              <input
                type="url"
                className="input-field"
                placeholder="Website (e.g. https://college.edu)"
                value={newCollegeWebsite}
                onChange={(e) => setNewCollegeWebsite(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }}>
                <Plus size={14} /> Add College
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
