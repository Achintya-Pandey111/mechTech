import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Sparkles, AlertCircle } from 'lucide-react';

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
  const [departmentId, setDepartmentId] = useState('dept-cs');

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
          departmentId: departmentId || 'dept-cs',
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
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              {tab === 'login' ? 'Sign in to AlumniConnect' : 'Create an Account'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {tab === 'login' ? 'Welcome back! Enter your details.' : 'Join the student and alumni network.'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
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
              background: tab === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'login' ? '600' : '400',
              cursor: 'pointer',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
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
              background: tab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: tab === 'register' ? '600' : '400',
              cursor: 'pointer',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
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
                    className={`btn ${role === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRole('STUDENT')}
                    style={{ fontSize: '13px', padding: '10px' }}
                  >
                    🎓 College Student
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === 'ALUMNI' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRole('ALUMNI')}
                    style={{ fontSize: '13px', padding: '10px' }}
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
                    placeholder="e.g. SWE"
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
