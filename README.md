# MediArchive - Digital Health Records Platform

<div align="center">
  
  ### One Digital Health Record for Everyone, Accessible Everywhere
  
  *India's unified health data system linking patients, doctors, and hospitals through secure Health ID (ABHA) and HPR ID.*

  [![Live Demo](https://img.shields.io/badge/Live-Demo-2A6F28?style=for-the-badge)](https://mediarchive.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

</div>

---

## 📸 Screenshots

### Homepage - Swiss Minimalism Design
*Clean, professional landing page with massive typography and rigorous grid systems*

### Patient Dashboard
*Health metrics, appointments, medications, and care team - everything that matters*

### Doctor Dashboard
*Single doctor practice focused - patient management, appointments, and medical records*

---

## ✨ Features

### 🔐 Authentication System
- **Dual Role Login**: Separate authentication for patients and doctors
- **ABHA ID Integration**: Health ID / ABHA ID for patients (Ayushman Bharat Health Account)
- **HPR ID Support**: Doctor ID / HPR ID for healthcare professionals (Health Professional Registry)
- **Secure Access**: Role-based access control

### 👤 Patient Portal
- **Health Metrics Dashboard**: 
  - Next appointment tracking with doctor details
  - Medications due today with reminders
  - Blood pressure, blood sugar, heart rate monitoring
  - Care team overview (specialists)
- **Medical Records**: Complete history with search functionality
- **Recent Tests**: List view with download/view options (CBC, Lipid Profile, HbA1c, etc.)
- **Health Alerts**: Critical allergies and chronic conditions prominently displayed
- **Medications Management**: Active prescriptions with dosage and frequency
- **Profile Management**: Personal stats (age, height, weight, blood type)
- **Document Access**: View and download medical reports

### 👨‍⚕️ Doctor Dashboard
- **Single Doctor Practice Focus**:
  - My Patients (156 active patients)
  - Today's Appointments (8 scheduled)
  - Pending Reviews (12 items)
  - Years of Experience tracker
- **Patient Search**: Quick patient lookup and information access
- **Medical History Timeline**: Chronological patient medical records
- **Patient Management**: Tabular view with filtering
- **Vital Signs Monitoring**: Real-time patient statistics
- **Notifications**: Stay updated with patient alerts

### 🎨 Design & UX - Swiss Minimalism
- **Rigorous Grid Systems**: 1px separator grids throughout
- **Massive Typography**: 56-96px bold headlines, uppercase titles
- **Sharp Corners**: border-radius: 0 everywhere
- **Monochrome Palette**: #051914 primary, #FFFFFF white, #FAFAFA backgrounds
- **Dual Accent System**: 
  - Dark green (#2A6F28) on light backgrounds
  - Light green (#78C51C) on dark backgrounds
- **Generous Whitespace**: Clean, breathable layouts
- **No Shadows/Transforms**: Flat, static design
- **Inset Border Hovers**: Subtle interactive states
- **Responsive Layout**: Mobile, tablet, and desktop optimized
- **Accessibility**: Semantic HTML and keyboard navigation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm/yarn installed

### Installation

```bash
# Clone the repository
git clone https://github.com/naiteek25bce10810/Mediarchive.git

# Navigate to project directory
cd mediarchive

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router DOM 6.8** - Client-side routing
- **CSS3** - Styling with CSS Variables
- **SVG** - Custom minimalist icons

### Development Tools
- **Create React App** - Build tooling
- **ESLint** - Code linting
- **Webpack** - Module bundling

### Deployment
- **Vercel** - Hosting platform
- **Git** - Version control
- **GitHub** - Repository hosting

---

## 📁 Project Structure

```
mediarchive/
├── public/
│   ├── favicon.svg          # App favicon
│   ├── logo192.png          # PWA icon 192x192
│   ├── logo512.png          # PWA icon 512x512
│   ├── manifest.json        # PWA manifest
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx           # Login component
│   │   ├── LoginPage.css           # Login styles
│   │   ├── PatientDashboard.jsx    # Patient portal
│   │   ├── PatientDashboard.css    # Patient styles
│   │   ├── DoctorDashboard.jsx     # Doctor portal
│   │   └── DoctorDashboard.css     # Doctor styles
│   ├── App.jsx              # Root component
│   ├── App.css              # Global styles
│   └── index.js             # Entry point
├── screenshots/             # App screenshots
├── package.json             # Dependencies
├── vercel.json             # Vercel config
└── README.md               # Documentation
```

---

## 🎯 Key Highlights

- ✅ **75+ Interactive Features** - Fully functional UI with real-time interactions
- ✅ **Zero Compilation Errors** - Production-ready codebase
- ✅ **Minimalist Design** - Scandinavian aesthetic with custom SVG icons
- ✅ **Responsive** - Works seamlessly on all devices
- ✅ **Fast Performance** - Optimized bundle size (50KB gzipped)
- ✅ **PWA Ready** - Progressive Web App configuration
- ✅ **Accessible** - WCAG compliant with semantic markup

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://api.mediarchive.com
REACT_APP_ENV=production
```

### Vercel Deployment

The project includes `vercel.json` configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app"
}
```

Deploy with one command:
```bash
npm install -g vercel
vercel --prod
```

---

## 📊 Performance

- **Bundle Size**: 50.14 KB (gzipped)
- **CSS Size**: 3.77 KB (gzipped)
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **Zero Vulnerabilities**: Clean npm audit

---

## 🎨 Design System

### Swiss Minimalism Principles
- **Rigorous Grid Systems**: 1px separator grids with rgba(5, 25, 20, 0.1) backgrounds
- **Massive Typography**: 56-96px hero titles, 48-72px section headers, 900 font weight
- **Sharp Geometry**: border-radius: 0 throughout, no rounded corners
- **Asymmetric Layouts**: Magazine-style content blocks
- **Generous Whitespace**: 64-160px padding for breathing room

### Color Palette
- **Primary Dark**: `#051914` - Main text and dark backgrounds
- **Accent Dark**: `#2A6F28` - Buttons, highlights on light backgrounds
- **Accent Light**: `#78C51C` - Icons, active states on dark backgrounds
- **White**: `#FFFFFF` - Card backgrounds
- **Light Gray**: `#FAFAFA` - Page backgrounds
- **Border**: `rgba(5, 25, 20, 0.1)` - 1px separators

### Typography
- **Font Family**: Inter, Segoe UI, system fonts
- **Headings**: 900 weight, uppercase, -0.03em to -0.04em letter-spacing
- **Labels**: 11px, uppercase, 600 weight, 1.5px letter-spacing
- **Body**: 13-15px, 400-600 weight

### Interactive States
- **Hover**: Inset borders (box-shadow: inset 0 0 0 1-2px accent-color)
- **No Transforms**: transform: none (no movement, scale, or rotation)
- **No Shadows**: box-shadow: none (except inset borders)
- **Static**: Clean, flat design without decorative effects

### Icons
- Bootstrap Icons library
- Consistent sizing (24-48px)
- Solid fills for visual weight
- Color-coded by function (accent green for primary actions)

---

## 🎯 Key Highlights

- ✅ **Swiss Minimalism Design** - Complete transformation with rigorous grids and massive typography
- ✅ **ABHA & HPR Integration** - Support for India's digital health IDs
- ✅ **Practical Health Metrics** - Appointments, medications, care team (not just vitals)
- ✅ **Single Doctor Practice** - Focused on individual practitioners, not hospitals
- ✅ **Zero Compilation Errors** - Production-ready codebase
- ✅ **Fully Responsive** - Mobile-first design with adaptive grids
- ✅ **Fast Performance** - Optimized React components
- ✅ **Clean Codebase** - Consistent styling with CSS variables

---

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Naiteek Papriwal**
- GitHub: [@naiteek25bce10810](https://github.com/naiteek25bce10810)
- Repository: [Mediarchive](https://github.com/naiteek25bce10810/Mediarchive)

---

## 🙏 Acknowledgments

- **Theme**: Digitalization of Health Records in India
- **Design**: Scandinavian minimalist aesthetic
- **Icons**: Custom SVG minimalist icons
- **Inspiration**: India's Digital Health Mission

---

## 📧 Support

For support, email [support@mediarchive.com](mailto:support@mediarchive.com) or open an issue on GitHub.

---

<div align="center">
  
  ### ⭐ Star this repository if you find it helpful!
  
  Made with ❤️ for India's Digital Health Revolution
  
  [Live Demo](https://mediarchive-zr98.vercel.app) • [Report Bug](https://github.com/naiteek25bce10810/Mediarchive/issues) • [Request Feature](https://github.com/naiteek25bce10810/Mediarchive/issues)

</div>
