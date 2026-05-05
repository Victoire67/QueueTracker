import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing.jsx';
import Auth from './Auth.jsx';
import AdminDashboard from "./adminDashboard.jsx"
import StudentDashboard from "./studentDashBoard.jsx"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;