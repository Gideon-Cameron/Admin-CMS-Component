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

type ExperienceKey =
  | "Experience1"
  | "Experience2"
  | "Experience3"
  | "Experience4"
  | "Experience5";

type ExperienceMap = {
  [key in ExperienceKey]: ExperienceItem;
};

const initialExperience: ExperienceItem = {
  title: "",
  context: "",
  date: "",
  points: [""],
};

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceMap>({
    Experience1: { ...initialExperience },
    Experience2: { ...initialExperience },
    Experience3: { ...initialExperience },
    Experience4: { ...initialExperience },
    Experience5: { ...initialExperience },
  });

  const [activeTab, setActiveTab] = useState<ExperienceKey>("Experience1");
  const [displayNumber, setDisplayNumber] = useState<number>(1); // ✅ renamed from order
  const [enabled, setEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const experienceRef = doc(db, "content", "experience");
  const sectionsRef = doc(db, "sections", "experience");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load content
        const experienceSnap = await getDoc(experienceRef);
        if (experienceSnap.exists()) {
          const data = experienceSnap.data() as Partial<ExperienceMap>;
          setExperiences((prev) => ({
            ...prev,
            ...data,
          }));
        }

        // Load metadata
        const sectionSnap = await getDoc(sectionsRef);
        if (sectionSnap.exists()) {
          const section = sectionSnap.data();
          setDisplayNumber(section.displayNumber ?? 1); // ✅ use displayNumber
          setEnabled(section.enabled ?? true);
        }
      } catch (err) {
        console.error("❌ Failed to load experience data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clean up experiences before saving
      const cleaned: Partial<ExperienceMap> = {};
      Object.entries(experiences).forEach(([key, exp]) => {
        const trimmedPoints = exp.points.filter((pt) => pt.trim() !== "");
        const isEmpty =
          !exp.title.trim() &&
          !exp.context.trim() &&
          !exp.date.trim() &&
          trimmedPoints.length === 0;

        if (!isEmpty) {
          cleaned[key as ExperienceKey] = {
            ...exp,
            points: trimmedPoints,
          };
        }
      });

      await Promise.all([
        setDoc(experienceRef, cleaned),
        setDoc(sectionsRef, { displayNumber, enabled }), // ✅ save displayNumber
      ]);

      setMessage("✅ Saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save experience data:", err);
      setMessage("❌ Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleChange = (
    field: keyof ExperienceItem,
    value: string,
    index?: number
  ) => {
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
      updated[activeTab].points = [...updated[activeTab].points, ""];
      return updated;
    });
  };

  const handleRemovePoint = (index: number) => {
    setExperiences((prev) => {
      const updated = { ...prev };
      updated[activeTab].points = updated[activeTab].points.filter(
        (_, i) => i !== index
      );
      return updated;
    });
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-24">
      {/* Header */}
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">0.{displayNumber}</span> Experience
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {/* Section Config */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 font-mono text-sm">
          <span>Section Number:</span>
          <input
            type="number"
            min={0}
            value={displayNumber}
            onChange={(e) => setDisplayNumber(Number(e.target.value))}
            className="w-20 p-1 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Show Section
        </label>
      </div>

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
                    {experiences[key].title || key}
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
              placeholder="Context, e.g. Freelance"
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
                <div key={idx} className="flex gap-2 items-center my-1">
                  <input
                    placeholder={`Point ${idx + 1}`}
                    value={pt}
                    onChange={(e) =>
                      handleChange("points", e.target.value, idx)
                    }
                    className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
                  />
                  <button
                    onClick={() => handleRemovePoint(idx)}
                    title="Remove bullet point"
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
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
              {message && (
                <span className="text-sm text-green-400">{message}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Experience;
