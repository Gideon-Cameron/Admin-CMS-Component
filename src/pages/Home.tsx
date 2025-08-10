import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Testimonial from "../components/Testimonial";
import SocialLinks from "../components/LeftSidebar"; // ✅ This is the admin-editable form
import Contact from "../components/Contact";
import Footer from "../components/Footer";


const Home = () => {
  return (
    <>
      <main className="pt-10 space-y-22 px-6 nav:pl-20 md:px-12 scroll-smooth">
        <section id="hero"><Hero /></section>
        <section id="about"><About /></section>
        <section id="experience"><Experience /></section>
        <section id="skills"><Skills /></section>
        <section id="projects"><Projects /></section>
        <section id="testimonials"><Testimonial /></section>
        <section id="contact">|<Contact /></section>
        <section id="social"><SocialLinks /></section> {/* ✅ Replaces Contact */}
      </main>
      <Footer />
    </>
  );
};

export default Home;
