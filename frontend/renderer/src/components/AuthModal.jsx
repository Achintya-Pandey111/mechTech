import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { X, AlertCircle } from 'lucide-react';

const FALLBACK_DEPARTMENTS = [
  { id: '466b22f2-dae6-4a2b-b7a2-a98503cfa2a6', name: 'Computer Science & Engineering' },
  { id: '86b47473-dedb-4f8d-874c-b8ee415e4bbf', name: 'Information Technology' },
  { id: '734439a0-b036-41aa-8007-61abd11197c2', name: 'Mechanical Engineering' }
];

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register } = useAuth();
  const [tab, setTab] = useState(authModalTab);
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [batchYear, setBatchYear] = useState('2021');
  const [studentNumber, setStudentNumber] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [departments, setDepartments] = useState(FALLBACK_DEPARTMENTS);
  const [departmentId, setDepartmentId] = useState(FALLBACK_DEPARTMENTS[0].id);

  useEffect(() => {
    let isMounted = true;
    api.request('/departments')
      .then((res) => {
        if (!isMounted) return;
        const list = res?.departments || res;
        if (Array.isArray(list) && list.length > 0) {
          setDepartments(list);
          setDepartmentId(list[0].id);
        }
      })
      .catch(() => {
        // Keeps fallback departments
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          departmentId: departmentId || undefined,
          graduationYear: Number(graduationYear),
          batchYear: Number(batchYear),
          studentNumber,
          currentCompany,
          jobTitle,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
              {tab === 'login' ? 'Sign in to AlumniConnect' : 'Create an Account'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {tab === 'login' ? 'Welcome back! Enter your collegiate credentials.' : 'Join the verified student and alumni network.'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
          <button
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: tab === 'login' ? '#FFFFFF' : 'transparent',
              color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'login' ? '700' : '500',
              cursor: 'pointer',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
              transition: 'all 0.15s ease',
            }}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: tab === 'register' ? '#FFFFFF' : 'transparent',
              color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'register' ? '700' : '500',
              cursor: 'pointer',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
              transition: 'all 0.15s ease',
            }}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid rgba(154, 52, 18, 0.2)',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {tab === 'register' && (
            <>
              {/* Role Selection */}
              <div className="input-group">
                <label className="input-label">Select Your Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setRole('STUDENT')}
                    style={{
                      fontSize: '13px',
                      padding: '10px',
                      background: role === 'STUDENT' ? 'var(--primary)' : 'var(--bg-card)',
                      color: role === 'STUDENT' ? '#FFFFFF' : 'var(--text-main)',
                      border: role === 'STUDENT' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      fontWeight: role === 'STUDENT' ? '600' : '500',
                    }}
                  >
                    🎓 College Student
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setRole('ALUMNI')}
                    style={{
                      fontSize: '13px',
                      padding: '10px',
                      background: role === 'ALUMNI' ? 'var(--primary)' : 'var(--bg-card)',
                      color: role === 'ALUMNI' ? '#FFFFFF' : 'var(--text-main)',
                      border: role === 'ALUMNI' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      fontWeight: role === 'ALUMNI' ? '600' : '500',
                    }}
                  >
                    💼 Verified Alumnus
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Department / Branch</label>
                <select
                  className="input-field"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="e.g. user@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {tab === 'register' && role === 'STUDENT' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label className="input-label">Batch Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Graduation Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>
            </div>
          )}

          {tab === 'register' && role === 'ALUMNI' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Current Company</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Google"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Job Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Graduation Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
