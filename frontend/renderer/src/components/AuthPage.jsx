import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import {
  GraduationCap,
  Users,
  Compass,
  Briefcase,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const FALLBACK_DEPARTMENTS = [
  { id: '466b22f2-dae6-4a2b-b7a2-a98503cfa2a6', name: 'Computer Science & Engineering' },
  { id: '86b47473-dedb-4f8d-874c-b8ee415e4bbf', name: 'Information Technology' },
  { id: '734439a0-b036-41aa-8007-61abd11197c2', name: 'Mechanical Engineering' },
];

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
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
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setTab('login');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--bg-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 480px)',
          gap: '36px',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Brand Story & Values */}
        <div style={{ padding: '16px 8px' }}>
          {/* Logo & Headline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6D4333 0%, #8D5B46 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(109, 67, 51, 0.25)',
              }}
            >
              <GraduationCap size={30} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-main)', lineHeight: 1.1 }}>
                Alumni<span style={{ color: 'var(--accent-chocolate)' }}>Connect</span>
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: '500', marginTop: '2px' }}>
                Engineering & Alumni Network
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.25', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Where collegiate academia meets real-world innovation.
          </h2>

          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
            Join your institutional network to discover career opportunities, seek professional mentorship, and collaborate with verified fellow graduates.
          </p>

          {/* Pillars List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Compass size={18} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                  One-on-One Alumni Mentorship
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Connect with experienced alumni engineers, researchers, and founders for tailored interview and career guidance.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Briefcase size={18} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Exclusive Jobs & Internships
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Discover opportunities posted directly by graduates hiring for software, hardware, and engineering roles.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Users size={18} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Community & Technical Forums
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Share portfolio architectures, discuss technological developments, and attend live AMA sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher Pills */}
          <div
            style={{
              padding: '14px 16px',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
              Quick Demo Accounts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFill('student@college.edu')}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFill('alumni@college.edu')}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                💼 Alumnus
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFill('admin@college.edu')}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div
          className="card"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 28px rgba(60, 40, 25, 0.08)',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Card Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-input)' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: tab === 'login' ? '#FFFFFF' : 'transparent',
                color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: tab === 'login' ? '700' : '500',
                fontSize: '14.5px',
                cursor: 'pointer',
                borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: tab === 'register' ? '#FFFFFF' : 'transparent',
                color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: tab === 'register' ? '700' : '500',
                fontSize: '14.5px',
                cursor: 'pointer',
                borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
                transition: 'all 0.15s ease',
              }}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--text-main)' }}>
                {tab === 'login' ? 'Welcome back' : 'Register with your college'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                {tab === 'login'
                  ? 'Sign in to access your feed, conversations, and mentorship.'
                  : 'Join the institutional network as an enrolled student or alumnus.'}
              </p>
            </div>

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
                  marginBottom: '18px',
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
              style={{ width: '100%', marginTop: '10px', padding: '12px', fontSize: '14.5px' }}
              disabled={loading}
            >
              {loading ? (
                'Please wait...'
              ) : tab === 'login' ? (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
