import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home"; // 👈 now all content is inside this

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#64ffda]">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-light-background text-light-textPrimary dark:bg-dark-background dark:text-dark-textPrimary transition-colors duration-300 font-sans min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginForm /> : <Navigate to="/admin" replace />}
          />
          <Route
            path="/admin"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/admin" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
