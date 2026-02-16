import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load user data from backend (stored at login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const profile = storedUser.profile || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('authToken')) {
      navigate('/login/doctor');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Doctor Information - loaded from backend via login
  const doctorInfo = {
    name: storedUser.name || 'Dr. Suryavi Budhwar',
    specialization: profile.specialization || 'Cardiologist',
    hospital: profile.hospital || 'Apollo Hospitals, Mumbai',
    abhaId: profile.hprId || '78-9012-3456-7890',
    phone: storedUser.phone || '+91 98765 43210',
    email: storedUser.email || 'suryavi.budhwar@apollohospitals.com',
    experience: profile.experience || '15 years',
    patients: 348,
    consultationsToday: 12
  };

  // Linked Patients
  const linkedPatients = [
    {
      id: 1,
      name: 'Aarav Sharma',
      abhaId: '12-3456-7890-1234',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      lastVisit: '08-02-2026',
      nextAppointment: '15-02-2026',
      condition: 'Hypertension',
      status: 'Active',
      country: 'India'
    },
    {
      id: 2,
      name: 'Priya Patel',
      abhaId: '12-3456-7890-5678',
      age: 32,
      gender: 'Female',
      bloodGroup: 'A+',
      lastVisit: '05-02-2026',
      nextAppointment: '12-02-2026',
      condition: 'Diabetes Type 2',
      status: 'Active',
      country: 'India'
    },
    {
      id: 3,
      name: 'Shamique Khan',
      abhaId: '12-3456-7890-9012',
      age: 20,
      gender: 'Male',
      bloodGroup: 'B+',
      lastVisit: '28-01-2026',
      nextAppointment: '20-02-2026',
      condition: 'Coronary Artery Disease',
      status: 'Active',
      country: 'India'
    },
    {
      id: 4,
      name: 'Meera Singh',
      abhaId: '12-3456-7890-3456',
      age: 28,
      gender: 'Female',
      bloodGroup: 'AB+',
      lastVisit: '07-02-2026',
      nextAppointment: '14-02-2026',
      condition: 'Asthma',
      status: 'Active',
      country: 'India'
    },
    {
      id: 5,
      name: 'Arjun Verma',
      abhaId: '12-3456-7890-7890',
      age: 52,
      gender: 'Male',
      bloodGroup: 'A-',
      lastVisit: '01-02-2026',
      nextAppointment: '22-02-2026',
      condition: 'Arthritis',
      status: 'Active',
      country: 'India'
    }
  ];

  // Recent Consultations
  const recentConsultations = [
    {
      id: 1,
      patientName: 'Aarav Sharma',
      date: '2024-03-15',
      time: '10:30 AM',
      type: 'Follow-up',
      diagnosis: 'Blood pressure stable',
      prescription: 'Continue current medication'
    },
    {
      id: 2,
      patientName: 'Priya Patel',
      date: '2024-03-10',
      time: '02:00 PM',
      type: 'Regular Check-up',
      diagnosis: 'Blood sugar levels elevated',
      prescription: 'Adjusted insulin dosage'
    },
    {
      id: 3,
      patientName: 'Shamique Khan',
      date: '2024-02-28',
      time: '11:15 AM',
      type: 'Emergency Consultation',
      diagnosis: 'Chest pain - ECG normal',
      prescription: 'Prescribed beta-blockers'
    }
  ];

  // Dashboard Stats
  const stats = [
    {
      icon: 'bi-people-fill',
      label: 'My Patients',
      value: '156',
      color: '#2A6F28',
      change: '+12%'
    },
    {
      icon: 'bi-calendar-check-fill',
      label: 'Today\'s Appointments',
      value: '8',
      color: '#2A6F28',
      change: '+3'
    },
    {
      icon: 'bi-clipboard-pulse',
      label: 'Pending Reviews',
      value: '12',
      color: '#2A6F28',
      change: '-2'
    },
    {
      icon: 'bi-award-fill',
      label: 'Years Experience',
      value: '15',
      color: '#2A6F28',
      change: ''
    }
  ];

  // Recent Activity (for future use)
  /*
  const recentActivity = [
    {
      action: 'New Patient Added',
      detail: 'Meera Singh linked to your profile',
      time: '2 hours ago',
      icon: 'bi-person-plus-fill'
    },
    {
      action: 'Consultation Completed',
      detail: 'Follow-up with Aarav Sharma',
      time: '5 hours ago',
      icon: 'bi-check-circle-fill'
    },
    {
      action: 'Lab Results Received',
      detail: 'Lipid panel for Priya Patel',
      time: '1 day ago',
      icon: 'bi-file-earmark-medical-fill'
    }
  ];
  */

  const handlePatientSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('patient-details');
  };

  const filteredPatients = linkedPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.abhaId.includes(searchTerm)
  );

  return (
    <div className="modern-dashboard">
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
            <h3>{doctorInfo.name}</h3>
            <p>{doctorInfo.specialization}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <i className="bi bi-people-fill"></i>
            <span>Patients</span>
            <span className="badge">{linkedPatients.length}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <i className="bi bi-clipboard-pulse"></i>
            <span>Consultations</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <i className="bi bi-search"></i>
            <span>Patient Search</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person-circle"></i>
            <span>Profile</span>
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
        {/* Top Bar */}
        <div className="dashboard-topbar">
          <div className="page-header">
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'patients' && 'My Patients'}
              {activeTab === 'consultations' && 'Consultations'}
              {activeTab === 'search' && 'Patient Search'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'patient-details' && 'Patient Details'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="topbar-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">
              <i className="bi bi-bell-fill"></i>
              <span className="badge">3</span>
            </button>
            <button className="icon-btn">
              <i className="bi bi-chat-dots-fill"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="dashboard-main-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid-modern">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card-modern">
                    <div className="stat-header-modern">
                      <div className="stat-icon-modern" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        <i className={stat.icon}></i>
                      </div>
                      <i className="bi bi-heart-fill stat-heart"></i>
                    </div>
                    <div className="stat-body-modern">
                      <h3 className="stat-value-modern">{stat.value}</h3>
                      <p className="stat-label-modern">{stat.label}</p>
                      <span className="stat-change">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Grid */}
              <div className="dashboard-grid-new">
                {/* Latest Patients Data Table */}
                <div className="dashboard-card-full">
                  <div className="card-header">
                    <h3><i className="bi bi-table"></i> Latest Patients Data</h3>
                    <button className="text-btn" onClick={() => setActiveTab('patients')}>
                      View All <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                  <div className="modern-table-wrapper">
                    <table className="patients-data-table">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Date</th>
                          <th>Patient Name</th>
                          <th>Age</th>
                          <th>Country</th>
                          <th>Gender</th>
                          <th>Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkedPatients.slice(0, 5).map((patient, index) => (
                          <tr key={patient.id}>
                            <td>{index + 1}</td>
                            <td>{patient.lastVisit}</td>
                            <td>
                              <div className="patient-name-cell">
                                <div className="patient-avatar-small">
                                  <i className="bi bi-person-fill"></i>
                                </div>
                                <span>{patient.name}</span>
                              </div>
                            </td>
                            <td>{patient.age}</td>
                            <td>{patient.country}</td>
                            <td>
                              <span className={`gender-badge ${patient.gender.toLowerCase()}`}>
                                {patient.gender}
                              </span>
                            </td>
                            <td>
                              <button className="report-btn" onClick={() => alert(`Viewing report for ${patient.name}`)}>
                                <i className="bi bi-file-earmark-text"></i>
                                <i className="bi bi-download"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-people-fill"></i> Linked Patients</h3>
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search by name or ABHA ID..."
                    value={searchTerm}
                    onChange={handlePatientSearch}
                  />
                </div>
              </div>
              <div className="patients-grid">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="patient-card-grid">
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div className="patient-info">
                        <h4>{patient.name}</h4>
                        <p className="patient-meta">{patient.gender}, {patient.age} yrs • {patient.bloodGroup}</p>
                      </div>
                    </div>
                    <div className="patient-card-body">
                      <div className="info-row">
                        <span className="info-label">ABHA ID:</span>
                        <span className="info-value">{patient.abhaId}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Last Visit:</span>
                        <span className="info-value">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Condition:</span>
                        <span className="tag-blue">{patient.condition}</span>
                      </div>
                    </div>
                    <button className="view-patient-btn" onClick={() => handleSelectPatient(patient)}>
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-clipboard-pulse"></i> All Consultations</h3>
                <button className="primary-btn">
                  <i className="bi bi-plus-circle-fill"></i>
                  New Consultation
                </button>
              </div>
              <div className="records-table">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="record-row">
                    <div className="record-icon">
                      <i className="bi bi-clipboard-pulse"></i>
                    </div>
                    <div className="record-info">
                      <p className="record-title">{consultation.patientName}</p>
                      <p className="record-meta">{consultation.type} • {new Date(consultation.date).toLocaleDateString()} at {consultation.time}</p>
                      <p className="record-prescription">
                        <strong>Diagnosis:</strong> {consultation.diagnosis}<br />
                        <strong>Prescription:</strong> {consultation.prescription}
                      </p>
                    </div>
                    <div className="record-actions">
                      <button className="record-action-btn" onClick={() => alert('View consultation details')}>
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button className="record-action-btn" onClick={() => alert('Download report')}>
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Search Tab */}
          {activeTab === 'search' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-search"></i> Patient Search</h3>
              </div>
              <div className="search-section">
                <div className="search-box-large">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Enter patient name, ABHA ID, or phone number..."
                    className="search-input-large"
                  />
                  <button className="search-btn">Search</button>
                </div>
                <div className="or-divider">
                  <span>OR</span>
                </div>
                <button className="qr-scan-btn" onClick={() => alert('QR Scanner - Coming Soon!\n\nThis will open camera to scan patient QR code.')}>
                  <i className="bi bi-qr-code-scan"></i>
                  <span>Scan Patient QR Code</span>
                </button>
              </div>
              <div className="coming-soon">
                <i className="bi bi-search" style={{ fontSize: '80px', color: '#CDEDB3' }}></i>
                <h3>Patient Search</h3>
                <p>Search for patients by ABHA ID, name, or scan their QR code to access medical records.</p>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="profile-header-info">
                  <h2>{doctorInfo.name}</h2>
                  <p className="profile-subtitle">{doctorInfo.specialization}</p>
                  <div className="profile-badges">
                    <span className="badge-success"><i className="bi bi-patch-check-fill"></i> Verified</span>
                    <span className="badge-info"><i className="bi bi-hospital-fill"></i> {doctorInfo.hospital}</span>
                  </div>
                </div>
                <button className="edit-profile-btn">
                  <i className="bi bi-pencil-fill"></i>
                  Edit Profile
                </button>
              </div>

              <div className="profile-grid">
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3><i className="bi bi-person-vcard"></i> Professional Information</h3>
                  </div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">ABHA ID</span>
                      <span className="info-value">{doctorInfo.abhaId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Specialization</span>
                      <span className="info-value">{doctorInfo.specialization}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Hospital</span>
                      <span className="info-value">{doctorInfo.hospital}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Experience</span>
                      <span className="info-value">{doctorInfo.experience}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{doctorInfo.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{doctorInfo.email}</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header">
                    <h3><i className="bi bi-graph-up-arrow"></i> Statistics</h3>
                  </div>
                  <div className="stats-list">
                    <div className="stat-item">
                      <i className="bi bi-people-fill"></i>
                      <div>
                        <p className="stat-value">{doctorInfo.patients}</p>
                        <p className="stat-label">Total Patients</p>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-clipboard-check-fill"></i>
                      <div>
                        <p className="stat-value">1,234</p>
                        <p className="stat-label">Consultations</p>
                      </div>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-star-fill"></i>
                      <div>
                        <p className="stat-value">4.8</p>
                        <p className="stat-label">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patient Details Tab */}
          {activeTab === 'patient-details' && selectedPatient && (
            <div className="dashboard-card">
              <div className="card-header">
                <button className="back-btn" onClick={() => setActiveTab('patients')}>
                  <i className="bi bi-arrow-left"></i>
                  Back to Patients
                </button>
              </div>
              <div className="patient-details-view">
                <div className="patient-details-header">
                  <div className="patient-avatar-large">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <h2>{selectedPatient.name}</h2>
                    <p className="patient-meta">{selectedPatient.gender}, {selectedPatient.age} years • Blood Group: {selectedPatient.bloodGroup}</p>
                    <p className="patient-abha">ABHA ID: {selectedPatient.abhaId}</p>
                  </div>
                </div>
                <div className="coming-soon" style={{ marginTop: '40px' }}>
                  <i className="bi bi-file-medical" style={{ fontSize: '80px', color: '#CDEDB3' }}></i>
                  <h3>Patient Medical Records</h3>
                  <p>View complete medical history, prescriptions, lab reports, and vitals for {selectedPatient.name}.</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="dashboard-card">
              <div className="card-header">
                <h3><i className="bi bi-gear-fill"></i> Settings</h3>
              </div>
              <div className="coming-soon">
                <i className="bi bi-gear-fill" style={{ fontSize: '80px', color: '#CDEDB3' }}></i>
                <h3>Settings</h3>
                <p>Manage your account preferences, notifications, and privacy settings.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
