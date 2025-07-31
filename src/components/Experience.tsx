import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type ExperienceItem = {
  title: string;
  context: string;
  date: string;
  points: string[];
};

type ExperienceKey = "Experience1" | "Experience2" | "Experience3";

type ExperienceMap = {
  [key in ExperienceKey]: ExperienceItem;
};

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceMap>({
    Experience1: { title: "", context: "", date: "", points: [""] },
    Experience2: { title: "", context: "", date: "", points: [""] },
    Experience3: { title: "", context: "", date: "", points: [""] },
  });

  const [activeTab, setActiveTab] = useState<ExperienceKey>("Experience1");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const experienceRef = doc(db, "content", "experience");

  useEffect(() => {
    const fetchExperience = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(experienceRef);
        if (snap.exists()) {
          const data = snap.data() as Partial<ExperienceMap>;
          setExperiences((prev) => ({ ...prev, ...data }));
          console.log("✅ Experience data loaded:", data);
        } else {
          console.warn("⚠️ Experience document does not exist.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch experience data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(experienceRef, experiences);
      setMessage("Saved successfully!");
      console.log("💾 Saved experience data:", experiences);
    } catch (err) {
      console.error("❌ Failed to save experience data", err);
      setMessage("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleChange = (field: keyof ExperienceItem, value: string, index?: number) => {
    setExperiences((prev) => {
      const updated = { ...prev };
      if (field === "points" && index !== undefined) {
        updated[activeTab].points[index] = value;
      } else {
        (updated[activeTab][field] as string) = value;
      }
      return updated;
    });
  };

  const handleAddPoint = () => {
    setExperiences((prev) => {
      const updated = { ...prev };
      updated[activeTab].points.push("");
      return updated;
    });
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-24">
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">03.</span> Experience
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading experience content...</p>
      ) : (
        <motion.div
          className="flex flex-col md:flex-row gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Tabs */}
          <div className="md:w-1/4 border-l border-[#8892b0]">
            <ul className="flex md:flex-col text-sm font-mono">
              {(Object.keys(experiences) as ExperienceKey[]).map((key) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveTab(key)}
                    className={`w-full text-left px-4 py-3 transition ${
                      activeTab === key
                        ? "border-l-2 border-[#64ffda] text-[#64ffda] bg-[#64ffda]/[0.05]"
                        : "text-[#4b5563] dark:text-[#8892b0] hover:text-[#64ffda]"
                    }`}
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="md:w-3/4 space-y-4">
            <input
              placeholder="Title"
              value={experiences[activeTab].title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
            <input
              placeholder="Context"
              value={experiences[activeTab].context}
              onChange={(e) => handleChange("context", e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
            <input
              placeholder="Date"
              value={experiences[activeTab].date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />

            <div>
              <label className="text-sm text-[#64ffda]">Bullet Points</label>
              {experiences[activeTab].points.map((pt, idx) => (
                <input
                  key={idx}
                  placeholder={`Point ${idx + 1}`}
                  value={pt}
                  onChange={(e) => handleChange("points", e.target.value, idx)}
                  className="w-full my-1 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
                />
              ))}
              <button
                onClick={handleAddPoint}
                className="mt-2 text-sm text-[#64ffda] hover:underline"
              >
                + Add Bullet Point
              </button>
            </div>

            <div className="mt-4 flex gap-4 items-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {message && <span className="text-sm text-green-400">{message}</span>}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Experience;
