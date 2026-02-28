# CreaBuild-AI-Dynamic-Engineering-Autonomous-Construction-System

CreaBuild AI 🏗️ is a smart construction platform 🤖 that uses AI to create better building designs 📐, check possible risks ⚠️, and track live site data 📡. It updates automatically in real time ⏱️ when site conditions change, helping reduce delays ⏳, save money 💰, and improve safety 🛡️ using digital twin technology 🖥️.

## Tech Stack
-   **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, React Three Fiber
-   **Backend**: Node.js / Express or Python / FastAPI
-   **Database**: MongoDB / PostgreSQL
-   **AI/ML Models**: Predictive analysis, Generative structures

## Project Structure

```text
CreaBuild-AI-System/
├── frontend/             # React (Vite) Frontend Application
│   ├── public/           # Static assets (3D models, images)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── App.jsx       # Main router setup
│   │   └── index.css     # Global styles and Tailwind imports
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json      # Frontend dependencies
│
├── backend/              # Backend Application API & Server
│   ├── controllers/      # Route controllers and logic
│   ├── models/           # Database models/schemas
│   ├── routes/           # API routes definitions
│   ├── services/         # Core AI services and integrations
│   ├── utils/            # Helper functions
│   ├── config/           # Environment variables and configurations
│   ├── .env.example      # Environment variables schema
│   ├── server.js         # Entry point for backend
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation (this file)
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ombhudhara/CreaBuild-AI-Dynamic-Engineering-Autonomous-Construction-System.git
   cd CreaBuild-AI-Dynamic-Engineering-Autonomous-Construction-System
   ```

2. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
