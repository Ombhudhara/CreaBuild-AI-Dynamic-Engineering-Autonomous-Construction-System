# CreaBuild AI – Dynamic Engineering & Autonomous Construction System

This is the frontend repository for **CreaBuild AI**, built for the hackathon. 
It uses React.js (Vite), Tailwind CSS, Framer Motion, and React Three Fiber for a complete, professional AI construction dashboard and 3D Digital Twin experience.

## Tech Stack
- React.js (Vite)
- Tailwind CSS (Dark AI theme, glassmorphism)
- React Router DOM
- @react-three/fiber & @react-three/drei (3D BIM model)
- Recharts (Analytics)
- Framer Motion (Animations)
- Lucide React (Icons)
- React Hot Toast (Alerts)

## Project Structure

```
frontend/
├── public/                # Static assets (3D models, images)
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx           # Top navigation / status bar
│   │   ├── Sidebar.jsx          # Dashboard sidebar
│   │   ├── DataCard.jsx         # Sensor data display cards
│   │   └── ThreeDBuilding.jsx   # 3D Digital Twin model component
│   ├── pages/             # Route pages
│   │   ├── LandingPage.jsx      # Hero, features, CTA
│   │   ├── ConfigPage.jsx       # Project configuration form
│   │   ├── AnalysisPage.jsx     # AI Design Analysis
│   │   └── DashboardPage.jsx    # Complete Digital Twin Dashboard
│   ├── App.jsx            # Main Router setup
│   ├── index.css          # Tailwind & Global styles
│   └── main.jsx           # React mounting point
├── tailwind.config.js     # Tailwind theme configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```


