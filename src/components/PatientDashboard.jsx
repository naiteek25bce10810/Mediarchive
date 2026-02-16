import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Load user data from backend (stored at login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = storedUser.profile || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('authToken')) {
      navigate('/login/patient');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const patientInfo = {
    name: storedUser.name || 'Shamique Khan',
    healthId: profile.healthId || 'HLTH001',
    abhaId: profile.abhaId || '12-3456-7890-1234',
    aadhaar: profile.aadhaar || '1234-5678-9012',
    age: profile.age || 20,
    ageDisplay: (profile.age || 20) + ' years',
    gender: profile.gender || 'Male',
    bloodGroup: profile.bloodGroup || 'O+',
    height: profile.height || '175 cm',
    weight: profile.weight || '65 kg',
    email: storedUser.email || 'shamique.khan@email.com',
    phone: storedUser.phone || '+91 98765 43210',
    city: profile.city || 'Bangalore',
    state: profile.state || 'Karnataka'
  };

  // Health Vitals - Essential Patient Metrics
  const healthVitals = [
    {
      id: 1,
      name: 'Next Appointment',
      value: 'Feb 15',
      subtitle: 'Dr. Suryavi Budhwar',
      detail: '10:30 AM · Cardiology',
      status: 'upcoming',
      icon: 'bi-calendar-check-fill',
      color: '#2A6F28',
      actionLabel: 'Reschedule'
    },
    {
      id: 2,
      name: 'Medications Due',
      value: '3',
      subtitle: 'Today',
      detail: 'Lisinopril, Metformin, Aspirin',
      status: 'pending',
      icon: 'bi-capsule-pill',
      color: '#2A6F28',
      actionLabel: 'View All'
    },
    {
      id: 3,
      name: 'Blood Pressure',
      value: '120/80',
      subtitle: 'Last Reading',
      detail: 'Feb 8, 2026 · Normal Range',
      status: 'normal',
      icon: 'bi-activity',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 4,
      name: 'Blood Sugar',
      value: '120',
      subtitle: 'mg/dL',
      detail: 'Feb 8, 2026 · Optimal Level',
      status: 'normal',
      icon: 'bi-droplet-fill',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 5,
      name: 'Heart Rate',
      value: '89',
      subtitle: 'bpm',
      detail: 'Feb 8, 2026 · Healthy',
      status: 'normal',
      icon: 'bi-heart-pulse-fill',
      color: '#2A6F28',
      actionLabel: 'Track'
    },
    {
      id: 6,
      name: 'Care Team',
      value: '4',
      subtitle: 'Specialists',
      detail: 'Cardiology, Endocrinology, Primary',
      status: 'active',
      icon: 'bi-people-fill',
      color: '#2A6F28',
      actionLabel: 'View Team'
    }
  ];

  // Recent Tests
  const recentTests = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      date: 'Feb 5, 2026',
      lab: 'Apollo Diagnostics',
      result: 'Normal',
      status: 'completed',
      icon: 'bi-droplet-fill'
    },
    {
      id: 2,
      name: 'Lipid Profile',
      date: 'Feb 3, 2026',
      lab: 'PathLab',
      result: 'Normal',
      status: 'completed',
      icon: 'bi-heart-pulse'
    },
    {
      id: 3,
      name: 'Thyroid Function Test',
      date: 'Jan 28, 2026',
      lab: 'SRL Diagnostics',
      result: 'Normal',
      status: 'completed',
      icon: 'bi-activity'
    },
    {
      id: 4,
      name: 'Kidney Function Test',
      date: 'Jan 20, 2026',
      lab: 'Apollo Diagnostics',
      result: 'Normal',
      status: 'completed',
      icon: 'bi-clipboard-pulse'
    }
  ];

  // Medication Schedule
  const medications = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      time: '8:00 AM',
      taken: true
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: '8:00 AM & 8:00 PM',
      taken: true
    },
    {
      id: 3,
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      time: '9:00 PM',
      taken: false
    },
    {
      id: 4,
      name: 'Aspirin',
      dosage: '75mg',
      frequency: 'Once daily',
      time: '8:00 AM',
      taken: true
    }
  ];

  const medicalRecords = [
    {
      id: 1,
      date: '22 Jul 2023',
      doctor: 'Dr. Anjali Sharma',
      specialization: 'Cardiologist',
      diagnosis: 'Hypertension',
      prescription: 'Amlodipine 5mg',
      action: 'View'
    },
    {
      id: 2,
      date: '15 May 2023',
      doctor: 'Dr. Vikram Singh',
      specialization: 'General Physician',
      diagnosis: 'Viral Fever',
      prescription: 'Paracetamol 650mg',
      action: 'Download'
    },
    {
      id: 3,
      date: '02 Feb 2023',
      doctor: 'Dr. Priya Desai',
      specialization: 'Dermatologist',
      diagnosis: 'Allergic Dermatitis',
      prescription: 'Topical Steroid Cream',
      action: 'N/A'
    },
    {
      id: 4,
      date: '10 Nov 2022',
      doctor: 'Dr. Rohan Mehta',
      specialization: 'Orthopedic',
      diagnosis: 'Minor Ankle Sprain',
      prescription: 'Painkillers & Rest',
      action: 'View X-Ray'
    }
  ];

  const allergies = ['Penicillin', 'Peanuts'];
  const chronicConditions = ['Type 2 Diabetes', 'Hypertension'];

  // Filter records based on search term
  const filteredRecords = medicalRecords.filter(record => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      record.date.toLowerCase().includes(searchLower) ||
      record.doctor.toLowerCase().includes(searchLower) ||
      record.specialization.toLowerCase().includes(searchLower) ||
      record.diagnosis.toLowerCase().includes(searchLower) ||
      record.prescription.toLowerCase().includes(searchLower)
    );
  });

  const handleActionClick = (action, record) => {
    if (action === 'N/A') return;
    alert(`${action} - ${record.doctor} (${record.date})\nDiagnosis: ${record.diagnosis}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="modern-patient-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <i className="bi bi-heart-pulse-fill"></i>
          <h2>MediArchive</h2>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="profile-details">
            <h3>{patientInfo.name}</h3>
            <p>Patient ID: {patientInfo.healthId}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <i className="bi bi-heart-pulse"></i>
            <span>Health Vitals</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <i className="bi bi-file-medical-fill"></i>
            <span>Medical Records</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Appointments</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            <i className="bi bi-prescription2"></i>
            <span>Medications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="bi bi-bell"></i>
            <span>Notifications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear-fill"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <div>
            <p className="greeting">Good Morning,</p>
            <h1>{patientInfo.name}</h1>
            <p className="topbar-subtitle">How are you feeling today?</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">
              <i className="bi bi-bell-fill"></i>
              <span className="badge">2</span>
            </button>
            <button className="icon-btn">
              <i className="bi bi-chat-dots-fill"></i>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-main-content">
            {/* Health Alerts - Priority Section */}
            <div className="health-alerts-priority">
              <div className="alert-header">
                <h2><i className="bi bi-exclamation-triangle-fill"></i> Health Alerts</h2>
                <span className="alert-badge">Critical Information</span>
              </div>
              <div className="alerts-grid-priority">
                <div className="alert-card-priority allergies-card">
                  <div className="alert-icon-box">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div className="alert-content">
                    <h3>Allergies</h3>
                    <div className="alert-tags">
                      {allergies.map((allergy, index) => (
                        <span key={index} className="alert-tag allergy-tag">
                          <i className="bi bi-x-circle-fill"></i> {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="alert-card-priority conditions-card">
                  <div className="alert-icon-box">
                    <i className="bi bi-heart-pulse-fill"></i>
                  </div>
                  <div className="alert-content">
                    <h3>Chronic Conditions</h3>
                    <div className="alert-tags">
                      {chronicConditions.map((condition, index) => (
                        <span key={index} className="alert-tag condition-tag">
                          <i className="bi bi-activity"></i> {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Stats */}
            <div className="personal-stats">
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-calendar3"></i></div>
                <p className="stat-label">Age</p>
                <h3 className="stat-value">{patientInfo.age} years</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-arrows-expand"></i></div>
                <p className="stat-label">Height</p>
                <h3 className="stat-value">{patientInfo.height}</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-speedometer2"></i></div>
                <p className="stat-label">Weight</p>
                <h3 className="stat-value">{patientInfo.weight}</h3>
              </div>
              <div className="stat-box">
                <div className="stat-icon"><i className="bi bi-droplet-fill"></i></div>
                <p className="stat-label">Blood Type</p>
                <h3 className="stat-value">{patientInfo.bloodGroup}</h3>
              </div>
            </div>

            {/* Recent Tests */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-clipboard-pulse"></i> Recent Tests</h3>
                <button className="text-btn">
                  View All <i className="bi bi-arrow-right"></i>
                </button>
              </div>
              <div className="tests-list">
                {recentTests.map((test) => (
                  <div key={test.id} className="test-item">
                    <div className="test-icon-box">
                      <i className={test.icon}></i>
                    </div>
                    <div className="test-details">
                      <h4 className="test-title">{test.name}</h4>
                      <p className="test-meta">
                        {test.date} • {test.lab}
                      </p>
                    </div>
                    <div className="test-result">
                      <span className="result-badge">{test.result}</span>
                    </div>
                    <div className="test-actions">
                      <button className="icon-btn-small" title="View Report">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="icon-btn-small" title="Download">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medication Management */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-capsule"></i> Medication Management</h3>
                <button className="text-btn">
                  View All <i className="bi bi-arrow-right"></i>
                </button>
              </div>
              <div className="medications-list">
                {medications.map((med) => (
                  <div key={med.id} className="medication-item">
                    <div className={`med-checkbox ${med.taken ? 'checked' : ''}`}>
                      {med.taken && <i className="bi bi-check-lg"></i>}
                    </div>
                    <div className="med-info">
                      <h4>{med.name}</h4>
                      <p>{med.dosage} • {med.frequency}</p>
                    </div>
                    <span className="med-time">{med.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Vitals Tab */}
        {activeTab === 'health' && (
          <div className="dashboard-main-content">
            <div className="health-metrics-grid">
              {healthVitals.map((vital) => (
                <div key={vital.id} className="metric-card">
                  <div className="metric-icon-box">
                    <i className={vital.icon}></i>
                  </div>
                  <div className="metric-content">
                    <p className="metric-label">{vital.name}</p>
                    <h2 className="metric-value">{vital.value}</h2>
                    <p className="metric-subtitle">{vital.subtitle}</p>
                    <p className="metric-detail">{vital.detail}</p>
                  </div>
                  <button className="metric-action-btn">
                    {vital.actionLabel} <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Health Alerts */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-exclamation-triangle"></i> Health Alerts</h3>
              </div>
              <div className="alerts-grid">
                <div className="alert-box allergies">
                  <h4>Allergies</h4>
                  <div className="tags">
                    {allergies.map((allergy, index) => (
                      <span key={index} className="tag allergy-tag">{allergy}</span>
                    ))}
                  </div>
                </div>
                <div className="alert-box conditions">
                  <h4>Chronic Conditions</h4>
                  <div className="tags">
                    {chronicConditions.map((condition, index) => (
                      <span key={index} className="tag condition-tag">{condition}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="dashboard-main-content">
            <div className="records-header-section">
              <div className="records-title">
                <h2><i className="bi bi-file-medical-fill"></i> Medical Records</h2>
                <p className="records-subtitle">Complete history of your medical consultations and treatments</p>
              </div>
              <div className="records-actions">
                <input
                  type="text"
                  className="search-input-modern"
                  placeholder="Search by doctor, diagnosis, date..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn-primary">
                  <i className="bi bi-plus-circle"></i> Add Record
                </button>
              </div>
            </div>

            <div className="records-grid-modern">
              {filteredRecords.map((record) => (
                <div key={record.id} className="record-card-modern">
                  <div className="record-card-header">
                    <div className="record-date-badge">
                      <i className="bi bi-calendar-event"></i>
                      <span>{record.date}</span>
                    </div>
                    <div className="record-status-badge active">Active</div>
                  </div>

                  <div className="record-doctor-section">
                    <div className="doctor-avatar">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div className="doctor-details">
                      <h3>{record.doctor}</h3>
                      <p className="specialization-badge">
                        <i className="bi bi-stethoscope"></i> {record.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="record-details-section">
                    <div className="record-detail-item">
                      <span className="detail-label">
                        <i className="bi bi-clipboard2-pulse"></i> Diagnosis
                      </span>
                      <p className="detail-value">{record.diagnosis}</p>
                    </div>
                    <div className="record-detail-item">
                      <span className="detail-label">
                        <i className="bi bi-capsule"></i> Prescription
                      </span>
                      <p className="detail-value">{record.prescription}</p>
                    </div>
                  </div>

                  <div className="record-card-footer">
                    {record.action === 'N/A' ? (
                      <button className="record-action-btn disabled" disabled>
                        <i className="bi bi-file-earmark-x"></i> No Documents
                      </button>
                    ) : (
                      <button
                        className="record-action-btn"
                        onClick={() => handleActionClick(record.action, record)}
                      >
                        <i className="bi bi-file-earmark-text"></i> {record.action}
                      </button>
                    )}
                    <button className="record-action-btn secondary">
                      <i className="bi bi-share"></i> Share
                    </button>
                    <button className="record-action-btn secondary">
                      <i className="bi bi-download"></i> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-calendar-check"></i> My Appointments</h3>
                <button className="btn-primary">Schedule New</button>
              </div>
              <div className="appointments-grid">
                <div className="appointment-card upcoming">
                  <div className="appointment-date">
                    <span className="date-day">15</span>
                    <span className="date-month">Mar</span>
                  </div>
                  <div className="appointment-details">
                    <h4>Dr. Anjali Sharma</h4>
                    <p className="specialization">Cardiologist</p>
                    <p className="appointment-time"><i className="bi bi-clock"></i> 10:00 AM - 10:30 AM</p>
                    <p className="appointment-location"><i className="bi bi-geo-alt"></i> Apollo Hospital, Bangalore</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-outline">Reschedule</button>
                    <button className="btn-danger">Cancel</button>
                  </div>
                </div>
                <div className="appointment-card upcoming">
                  <div className="appointment-date">
                    <span className="date-day">22</span>
                    <span className="date-month">Mar</span>
                  </div>
                  <div className="appointment-details">
                    <h4>Dr. Vikram Singh</h4>
                    <p className="specialization">General Physician</p>
                    <p className="appointment-time"><i className="bi bi-clock"></i> 2:00 PM - 2:30 PM</p>
                    <p className="appointment-location"><i className="bi bi-geo-alt"></i> City Clinic, Bangalore</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-outline">Reschedule</button>
                    <button className="btn-danger">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-capsule"></i> My Medications</h3>
                <button className="btn-primary">Add Medication</button>
              </div>
              <div className="medications-list-full">
                {medications.map((med) => (
                  <div key={med.id} className="medication-card-full">
                    <div className={`med-checkbox-large ${med.taken ? 'checked' : ''}`}>
                      {med.taken && <i className="bi bi-check-lg"></i>}
                    </div>
                    <div className="med-info-full">
                      <h4>{med.name}</h4>
                      <p className="dosage">{med.dosage}</p>
                      <p className="frequency"><i className="bi bi-clock"></i> {med.frequency}</p>
                      <p className="time"><i className="bi bi-alarm"></i> {med.time}</p>
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn"><i className="bi bi-pencil"></i></button>
                      <button className="icon-btn"><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="dashboard-main-content">
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-bell"></i> Notifications</h3>
                <button className="text-btn">Mark all as read</button>
              </div>
              <div className="notifications-list">
                <div className="notification-item unread">
                  <div className="notification-icon"><i className="bi bi-calendar-check"></i></div>
                  <div className="notification-content">
                    <h4>Appointment Reminder</h4>
                    <p>Your appointment with Dr. Anjali Sharma is scheduled for tomorrow at 10:00 AM</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-icon"><i className="bi bi-capsule"></i></div>
                  <div className="notification-content">
                    <h4>Medication Reminder</h4>
                    <p>Time to take Atorvastatin 20mg</p>
                    <span className="notification-time">5 hours ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon"><i className="bi bi-file-medical"></i></div>
                  <div className="notification-content">
                    <h4>Lab Results Available</h4>
                    <p>Your blood test results from 10 Mar 2024 are now available</p>
                    <span className="notification-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-main-content">
            <div className="settings-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-person"></i> Personal Information</h3>
                </div>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={patientInfo.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={patientInfo.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={patientInfo.phone} readOnly />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" value={patientInfo.city} readOnly />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" value={patientInfo.state} readOnly />
                    </div>
                  </div>
                  <button className="btn-primary">Update Information</button>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="bi bi-shield-lock"></i> Privacy & Security</h3>
                </div>
                <div className="settings-list">
                  <div className="setting-item">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                    <button className="btn-outline">Enable</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Change Password</h4>
                      <p>Update your account password</p>
                    </div>
                    <button className="btn-outline">Change</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Data Sharing</h4>
                      <p>Control who can access your records</p>
                    </div>
                    <button className="btn-outline">Manage</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
