import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Hero from "./components/Hero";
// import About from "./components/About";
// import Experience from "./components/Experience";
// import Skills from "./components/Skills";
// import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Testimonial from "./components/Testimonial";

import { useAuth } from "./context/AuthContext";

const AdminRoutes = () => (
  <>
    <main className="pt-10 space-y-22 px-6 nav:pl-20 md:px-12">
      <section id="hero">
        <Hero />
      </section>

      {/* <section id="about">
        <About />
      </section>

      <section id="experience">
        <Experience />
      </section>

      <section id="skills">
        <Skills />
      </section>

      <section id="projects">
        <Projects />
      </section> */}

      <section id="testimonials">
        <Testimonial />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
    <Footer />
  </>
);

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
            element={user ? <AdminRoutes /> : <Navigate to="/login" replace />}
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
