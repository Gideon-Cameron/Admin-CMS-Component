import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import AdminSidebar from "./components/AdminSidebar"; 
import SocialLinks from "./components/LeftSidebar"; 

const App = () => {
  const { user, loading } = useAuth();

  console.log("🧠 App.tsx user:", user);
  console.log("⏳ App.tsx loading:", loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#64ffda]">
        Loading auth...
      </div>
    );
  }

  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 px-4 sm:px-8 py-8">{children}</main>
    </div>
  );

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
            element={
              user ? (
                <AdminLayout>
                  <Home />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/social"
            element={
              user ? (
                <AdminLayout>
                  <SocialLinks />
                </AdminLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
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
