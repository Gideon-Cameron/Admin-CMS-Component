import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/uploadImageToCloudinary";

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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null); // ✅ New

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

  const confirmDelete = (index: number) => {
    setConfirmIndex(index);
  };

  const handleDeleteConfirmed = async () => {
    if (confirmIndex === null) return;

    const updated = [...projects];
    updated.splice(confirmIndex, 1);
    setProjects(updated);
    setConfirmIndex(null);

    try {
      await setDoc(projectsRef, { list: updated });
      setMessage("🗑️ Project deleted and saved.");
    } catch (err) {
      console.error("❌ Failed to delete project", err);
      setMessage("Failed to delete project.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancelDelete = () => {
    setConfirmIndex(null);
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadImageToCloudinary(file);
      handleChange(index, "imageUrl", url);
      setMessage("✅ Image uploaded.");
      console.log("🖼️ Uploaded image:", url);
    } catch (err) {
      console.error("❌ Image upload failed", err);
      setMessage("Upload failed");
    } finally {
      setUploadingIndex(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(projectsRef, { list: projects });
      setMessage("💾 Saved successfully!");
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
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 relative">
      <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono mb-6">
        Projects
      </h2>

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading projects...</p>
      ) : (
        <>
          {projects.map((project, index) => (
            <div
              key={index}
              className="mb-10 space-y-4 p-4 border rounded border-[#64ffda]/30 relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => confirmDelete(index)}
                className="absolute top-2 right-2 text-red-500 text-sm hover:text-red-700"
              >
                Delete
              </button>

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

              {/* Image Preview + Upload */}
              <div className="space-y-2">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt="Preview"
                    className="w-full max-w-xs rounded shadow"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImageUpload(e.target.files[0], index)
                  }
                />
                {uploadingIndex === index && (
                  <p className="text-sm text-yellow-400">Uploading image...</p>
                )}
              </div>

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
            {message && <span className="text-sm text-green-400">{message}</span>}
          </div>
        </>
      )}

      {/* Modal Overlay */}
      {confirmIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#0a192f] p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#0a192f] dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this project?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-[#0a192f] dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsEditor;
