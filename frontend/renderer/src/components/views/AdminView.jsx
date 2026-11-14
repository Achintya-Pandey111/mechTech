import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import {
  Users,
  GraduationCap,
  Briefcase,
  Building,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const AdminView = () => {
  const { user, openAuthModal } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalStudents: 98,
    totalAlumni: 44,
    totalColleges: 3,
    totalDepartments: 8,
    totalPosts: 38,
    totalEvents: 6,
  });

  const [colleges, setColleges] = useState([
    { id: 'c-1', name: 'Institute of Technology', location: 'Campus Main', website: 'https://iot.edu' },
    { id: 'c-2', name: 'School of Applied Sciences', location: 'North Wing', website: 'https://sas.edu' },
  ]);

  const [departments, setDepartments] = useState([
    { id: 'd-1', name: 'Computer Science & Engineering', college: 'Institute of Technology', studentsCount: 64 },
    { id: 'd-2', name: 'Information Technology', college: 'Institute of Technology', studentsCount: 42 },
    { id: 'd-3', name: 'Mechanical Engineering', college: 'Institute of Technology', studentsCount: 36 },
  ]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await api.getAdminStats();
        if (data?.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        // Keeps mock data
      }
    };
    fetchAdminStats();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6D4333' },
    { title: 'Enrolled Students', value: stats.totalStudents, icon: GraduationCap, color: '#26533F' },
    { title: 'Verified Alumni', value: stats.totalAlumni, icon: Briefcase, color: '#7A4B1A' },
    { title: 'Colleges & Depts', value: `${stats.totalColleges} / ${stats.totalDepartments}`, icon: Building, color: '#8D5B46' },
    { title: 'Feed Posts', value: stats.totalPosts, icon: MessageSquare, color: '#8A5A1A' },
    { title: 'Active Events', value: stats.totalEvents, icon: Calendar, color: '#B87C58' },
  ];

  if (user?.role !== 'ADMIN') {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '36px 24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
            Administrator Access Required
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Only verified institutional system administrators have permissions to view platform controls.
          </p>
          {!user && (
            <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
              Sign In as Administrator
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
          <ShieldCheck size={16} /> Administrative Portal
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
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
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
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
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
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
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{col.name}</div>
                  {col.website && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-chocolate)' }}>{col.website}</div>
                  )}
                </div>
                <span className="badge badge-student" style={{ fontSize: '10px' }}>Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Departments List */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
            Academic Departments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {departments.map((dept) => (
              <div
                key={dept.id}
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
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{dept.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dept.college}</div>
                </div>
                <span className="badge badge-alumni" style={{ fontSize: '10px' }}>
                  {dept.studentsCount} Students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
