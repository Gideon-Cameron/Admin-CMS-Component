import { useState } from "react";
import { motion } from "framer-motion";

type Project = {
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  previewUrl?: string;
  skills: string[];
};

type ProjectsProps = {
  sectionTitle: string;
  projects: Project[];
};

const Projects = ({ sectionTitle, projects }: ProjectsProps) => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [showCount, setShowCount] = useState(3);

  const handleClose = () => setSelected(null);

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">
      {/* Heading */}
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">04.</span> {sectionTitle}
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0] relative -top-[5px]" />
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {projects.slice(0, showCount).map((project, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-[#0a192f] border border-[#64ffda]/30 rounded shadow-sm transition hover:ring-2 hover:ring-[#64ffda]/30 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#f1f5f9] dark:bg-[#112240] p-[15px] rounded-t overflow-hidden">
              <div className="w-full aspect-video relative">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover rounded"
                />
              </div>
            </div>

            <div className="p-4 flex flex-col items-start gap-2">
              <h3 className="text-lg font-semibold text-[#111827] dark:text-[#ccd6f6]">
                {project.title}
              </h3>
              <p className="text-sm text-[#4b5563] dark:text-[#8892b0] italic">
                {project.shortDescription}
              </p>
              <button
                onClick={() => setSelected(project)}
                className="text-sm text-[#007acc] dark:text-[#64ffda] hover:opacity-80 cursor-pointer transition"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Show More */}
      <motion.div
        className="mt-12 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {showCount < projects.length ? (
          <button
            onClick={() => setShowCount(projects.length)}
            className="px-6 py-2 border border-[#64ffda] text-[#64ffda] rounded hover:bg-[#64ffda]/10 transition"
          >
            Show More
          </button>
        ) : (
          <a
            href="https://github.com/Gideon-Cameron"
            target="_blank"
            className="px-6 py-2 border border-[#64ffda] text-[#64ffda] rounded hover:bg-[#64ffda]/10 transition"
          >
            Explore More on GitHub
          </a>
        )}
      </motion.div>

      {/* Modal */}
      {selected && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-[#0a192f] rounded-lg p-6 max-w-4xl w-full shadow-xl relative flex flex-col md:flex-row gap-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="md:w-[45%] bg-[#f1f5f9] dark:bg-[#112240] rounded">
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full h-auto object-cover rounded"
              />
            </div>

            <div className="flex-1 text-[#111827] dark:text-[#ccd6f6]">
              <h3 className="text-2xl font-semibold mb-4">{selected.title}</h3>
              <p className="mb-6 whitespace-pre-line text-[#4b5563] dark:text-[#8892b0]">
                {selected.description}
              </p>

              {selected.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2 text-[#64ffda]">Skills</h4>
                  <div className="flex flex-wrap gap-3">
                    {selected.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs text-[#ccd6f6] bg-[#112240] px-3 py-1 rounded-full shadow border border-[#64ffda]/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <a
                  href={selected.previewUrl}
                  target="_blank"
                  className="px-4 py-2 border border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10 rounded transition"
                >
                  Preview
                </a>
              </div>

              <button
                onClick={handleClose}
                className="absolute top-3 right-4 text-xl text-[#64ffda] hover:opacity-75"
              >
                &times;
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;
