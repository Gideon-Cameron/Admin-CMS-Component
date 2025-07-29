import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm"; // You'll create this
// import Dashboard from "./components/Dashboard"; // Stub for now
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="bg-light-background text-light-textPrimary dark:bg-dark-background dark:text-dark-textPrimary transition-colors duration-300 font-sans min-h-screen">
        <Routes>
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" replace />} />
          {/* <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} /> */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
