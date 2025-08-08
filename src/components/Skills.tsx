import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type SkillGroups = Record<string, string[]>;

const Skills = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroups>({});
  const [activeTab, setActiveTab] = useState<string>("");

  const [order, setOrder] = useState<number>(1); // Admin-chosen number for "0.{order} Skills"
  const [enabled, setEnabled] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const skillRef = doc(db, "content", "skills");
  const sectionsRef = doc(db, "sections", "skills");

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const [skillsSnap, sectionsSnap] = await Promise.all([
          getDoc(skillRef),
          getDoc(sectionsRef),
        ]);

        if (skillsSnap.exists()) {
          const data = skillsSnap.data() as SkillGroups;
          setSkillGroups(data);
          setActiveTab(Object.keys(data)[0] || "");
        }

        if (sectionsSnap.exists()) {
          const meta = sectionsSnap.data();
          if (typeof meta.order === "number") setOrder(meta.order);
          if (typeof meta.enabled === "boolean") setEnabled(meta.enabled);
        }
      } catch (err) {
        console.error("❌ Failed to fetch skills data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedGroups: SkillGroups = {};
      Object.entries(skillGroups).forEach(([category, skills]) => {
        const filtered = skills.filter((s) => s.trim() !== "");
        if (filtered.length > 0) {
          cleanedGroups[category] = filtered;
        }
      });

      await Promise.all([
        setDoc(skillRef, cleanedGroups),
        setDoc(sectionsRef, { order, enabled }),
      ]);

      setMessage("✅ Saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save skills", err);
      setMessage("❌ Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSkillChange = (value: string, index: number) => {
    setSkillGroups((prev) => {
      const updated = { ...prev };
      updated[activeTab][index] = value;
      return updated;
    });
  };

  const handleAddSkill = () => {
    setSkillGroups((prev) => {
      const updated = { ...prev };
      updated[activeTab] = [...(updated[activeTab] || []), ""];
      return updated;
    });
  };

  const handleCategoryRename = (newName: string) => {
    if (!newName || newName === activeTab) return;
    setSkillGroups((prev) => {
      const updated = { ...prev };
      const items = updated[activeTab];
      delete updated[activeTab];
      updated[newName] = items;
      setActiveTab(newName);
      return updated;
    });
  };

  const handleAddCategory = () => {
    const newGroupName = `New Group ${Object.keys(skillGroups).length + 1}`;
    setSkillGroups((prev) => ({
      ...prev,
      [newGroupName]: [""],
    }));
    setActiveTab(newGroupName);
  };

  const confirmDeleteCategory = () => {
    setSkillGroups((prev) => {
      const updated = { ...prev };
      delete updated[activeTab];
      const remaining = Object.keys(updated);
      setActiveTab(remaining[0] || "");
      return updated;
    });
    setShowConfirmModal(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">
      {/* Heading */}
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">0.{order}</span> Skills
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {/* Section Settings */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 font-mono text-sm">
          <span>Section Number:</span>
          <input
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
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
        <p className="text-center text-[#8892b0]">Loading skills...</p>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {Object.keys(skillGroups).map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 rounded border text-sm font-mono transition ${
                  activeTab === category
                    ? "bg-[#64ffda]/10 text-[#64ffda] border-[#64ffda]"
                    : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#64ffda] hover:text-[#64ffda]"
                }`}
              >
                {category}
              </button>
            ))}

            {/* Add/Delete */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCategory}
                className="text-sm text-[#64ffda] hover:underline"
              >
                + Add Group
              </button>
              {activeTab && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  title="Delete Group"
                  className="text-red-500 hover:text-red-700 text-lg leading-none"
                >
                  ❌
                </button>
              )}
            </div>
          </div>

          {/* Rename */}
          {activeTab && (
            <div className="mb-6">
              <input
                value={activeTab}
                onChange={(e) => handleCategoryRename(e.target.value)}
                className="p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
            </div>
          )}

          {/* Skills Inputs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
            >
              {skillGroups[activeTab]?.map((skill, idx) => (
                <motion.input
                  key={idx}
                  value={skill}
                  placeholder={`Skill ${idx + 1}`}
                  onChange={(e) => handleSkillChange(e.target.value, idx)}
                  className="p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Add Skill Button */}
          <button
            onClick={handleAddSkill}
            className="mt-4 text-sm text-[#64ffda] hover:underline"
          >
            + Add Skill
          </button>

          {/* Save Button */}
          <div className="mt-6 flex gap-4 items-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && <span className="text-sm text-green-400">{message}</span>}
          </div>

          {/* Confirm Delete Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#0a192f] p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
                <h3 className="text-lg font-semibold mb-4 text-[#111827] dark:text-[#ccd6f6]">
                  Are you sure you want to delete &quot;{activeTab}&quot;?
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#112240]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCategory}
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Skills;
