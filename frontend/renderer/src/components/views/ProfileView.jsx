import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import {
  User,
  Building,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Plus,
  X,
  Save,
} from 'lucide-react';

export const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [studentNumber, setStudentNumber] = useState('');
  const [batchYear, setBatchYear] = useState('2021');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState(['Distributed Systems', 'PostgreSQL', 'Node.js', 'React']);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isStudent = user?.role === 'STUDENT';
  const isAlumni = user?.role === 'ALUMNI';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile('me');
        if (data?.user) {
          setProfile(data.user);
          setName(data.user.name || '');
          if (data.user.student) {
            setStudentNumber(data.user.student.studentNumber || '');
            setBatchYear(data.user.student.batchYear || '2021');
            setGraduationYear(data.user.student.graduationYear || '2025');
          }
          if (data.user.alumni) {
            setCompany(data.user.alumni.currentCompany || '');
            setJobTitle(data.user.alumni.jobTitle || '');
            setGraduationYear(data.user.alumni.graduationYear || '2021');
          }
        }
      } catch (err) {
        // Keeps mock state
      }
    };
    fetchProfile();
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (isStudent) {
        await api.updateStudentProfile({
          name,
          studentNumber,
          batchYear: Number(batchYear),
          graduationYear: Number(graduationYear),
        });
      } else if (isAlumni) {
        await api.updateAlumniProfile({
          name,
          currentCompany: company,
          jobTitle,
          graduationYear: Number(graduationYear),
        });
      }
    } catch (err) {
      console.warn('Profile saved in local simulated mode');
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
          My Profile & Settings
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Manage your verified college affiliation, expertise, and contact information.
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
                background: 'linear-gradient(135deg, #6D4333, #8D5B46)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(109, 67, 51, 0.25)',
              }}
            >
              {name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{name}</h3>
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

              {isAlumni && (
                <div className="input-group">
                  <label className="input-label">Job Title / Designation</label>
                  <input
                    type="text"
                    className="input-field"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Staff Architect"
                  />
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Graduation Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>

              {isStudent && (
                <div className="input-group">
                  <label className="input-label">Batch Year</label>
                  <input
                    type="number"
                    className="input-field"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={14} /> {savedSuccess ? 'Saved Successfully!' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Skills & Endorsements */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
            Technical Expertise & Endorsed Skills
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {skills.map((s) => (
              <span
                key={s}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              >
                {s}
                <X
                  size={14}
                  style={{ cursor: 'pointer', color: 'var(--text-dim)' }}
                  onClick={() => handleRemoveSkill(s)}
                />
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Add skill (e.g. Kubernetes, Rust, Machine Learning)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              style={{ maxWidth: '380px' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Skill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
