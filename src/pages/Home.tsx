import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Testimonial from "../components/Testimonial";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
    // const mockProjects = [
    //     {
    //       id: "1",
    //       title: "Portfolio Website",
    //       shortDescription: "Responsive and modern developer portfolio.",
    //       description: "A full-stack developer portfolio website showcasing projects and skills.",
    //       imageUrl: "https://via.placeholder.com/600x400",
    //       skills: ["React", "TypeScript", "Firebase"],
    //       liveUrl: "https://example.com",
    //     },
    //   ];

//   const mockOneLiners = {
//     1: "Responsive and modern developer portfolio.",
//   };

  return (
    <>
      <main className="pt-10 space-y-22 px-6 nav:pl-20 md:px-12">
        <section id="hero"><Hero /></section>
        <section id="about"><About /></section>
        <section id="experience"><Experience /></section>
        <section id="skills"><Skills /></section>
        <section id="projects">
        <Projects />
        </section>
        <section id="testimonials"><Testimonial /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
