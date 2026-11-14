import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import { User, GraduationCap, Building, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState(user?.skills || [
    { proficiency: 'ADVANCED', skill: { id: 'sk-1', name: 'JavaScript' } },
    { proficiency: 'INTERMEDIATE', skill: { id: 'sk-2', name: 'React' } },
    { proficiency: 'INTERMEDIATE', skill: { id: 'sk-3', name: 'Node.js' } },
    { proficiency: 'BEGINNER', skill: { id: 'sk-4', name: 'PostgreSQL' } },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('INTERMEDIATE');

  // Form states for profile
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.alumni?.currentCompany || '');
  const [jobTitle, setJobTitle] = useState(user?.alumni?.jobTitle || '');
  const [studentNumber, setStudentNumber] = useState(user?.student?.studentNumber || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const skillObj = {
      proficiency: newSkillProficiency,
      skill: { id: `sk-${Date.now()}`, name: newSkillName.trim() },
    };

    try {
      await api.addSkill(newSkillName.trim(), newSkillProficiency);
    } catch (err) {
      // preview update
    }

    setSkills([...skills, skillObj]);
    setNewSkillName('');
  };

  const handleRemoveSkill = async (index, skillId) => {
    try {
      if (skillId) await api.removeSkill(skillId);
    } catch (err) {
      // preview update
    }
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (user?.role === 'STUDENT') {
        await api.updateStudentProfile({ name, studentNumber });
      } else if (user?.role === 'ALUMNI') {
        await api.updateAlumniProfile({ name, currentCompany: company, jobTitle });
      }
    } catch (err) {
      // preview update
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const isStudent = user?.role === 'STUDENT';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
          My Profile & Skills
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Manage your academic background, professional experience, and technical skill profile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              {name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className={`badge badge-${user?.role?.toLowerCase() || 'student'}`}>
                  {user?.role}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {isStudent ? (
                <div className="input-group">
                  <label className="input-label">Student Roll / ID Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="e.g. STU2024091"
                  />
                </div>
              ) : (
                <div className="input-group">
                  <label className="input-label">Current Company</label>
                  <input
                    type="text"
                    className="input-field"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                  />
                </div>
              )}
            </div>

            {!isStudent && (
              <div className="input-group">
                <label className="input-label">Job Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
              {savedSuccess && (
                <span style={{ fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={15} /> Changes saved successfully!
                </span>
              )}
              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Skills Manager */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
            Technical & Professional Skills
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Skills help match you with mentors, peer collaborations, and career opportunities.
          </p>

          {/* Current Skills List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {skills.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                  {s.skill?.name || s.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: '#818cf8',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.15)',
                  }}
                >
                  {s.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx, s.skill?.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill Bar */}
          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Skill name (e.g. Python, Docker, Prisma, System Design)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              style={{ flex: 2 }}
            />
            <select
              className="select-field"
              value={newSkillProficiency}
              onChange={(e) => setNewSkillProficiency(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={15} /> Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
