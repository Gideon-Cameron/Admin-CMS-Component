import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Project = {
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
};

const ProjectsEditor = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      title: "",
      shortDescription: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const projectsRef = doc(db, "content", "projects");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(projectsRef);
        if (snap.exists()) {
          const data = snap.data().list as Project[];
          setProjects(data);
          console.log("✅ Projects loaded:", data);
        }
      } catch (err) {
        console.error("❌ Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        shortDescription: "",
        description: "",
        imageUrl: "",
        liveUrl: "",
      },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(projectsRef, { list: projects });
      setMessage("Saved successfully!");
      console.log("💾 Saved project data:", projects);
    } catch (err) {
      console.error("❌ Failed to save projects", err);
      setMessage("Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20">
      <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono mb-6">
        Projects
      </h2>

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading projects...</p>
      ) : (
        <>
          {projects.map((project, index) => (
            <div key={index} className="mb-10 space-y-4 p-4 border rounded border-[#64ffda]/30">
              <input
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
              <input
                placeholder="Short Description (max 200 characters)"
                value={project.shortDescription}
                maxLength={200}
                onChange={(e) => handleChange(index, "shortDescription", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
              <textarea
                placeholder="Full Description (max 1000 characters)"
                value={project.description}
                maxLength={1000}
                rows={5}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
              <input
                placeholder="Image URL"
                value={project.imageUrl}
                onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
              <input
                placeholder="Live Preview URL"
                value={project.liveUrl}
                onChange={(e) => handleChange(index, "liveUrl", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
            </div>
          ))}

          <button
            onClick={handleAddProject}
            className="text-sm text-[#64ffda] hover:underline mb-6"
          >
            + Add Project
          </button>

          <div className="flex gap-4 items-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <span className="text-sm text-green-400">{message}</span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectsEditor;
