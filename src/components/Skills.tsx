import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type SkillGroups = Record<string, string[]>;

const Skills = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroups>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const skillRef = doc(db, "content", "skills");

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(skillRef);
        if (snap.exists()) {
          const data = snap.data() as SkillGroups;
          setSkillGroups(data);
          setActiveTab(Object.keys(data)[0] || "");
          console.log("✅ Skill data loaded:", data);
        } else {
          console.warn("⚠️ Skills document does not exist.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(skillRef, skillGroups);
      setMessage("Skills saved!");
      console.log("💾 Saved skills data:", skillGroups);
    } catch (err) {
      console.error("❌ Failed to save skills", err);
      setMessage("Save failed. See console.");
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

  const handleDeleteCategory = () => {
    if (!confirm(`Are you sure you want to delete '${activeTab}'?`)) return;
    setSkillGroups((prev) => {
      const updated = { ...prev };
      delete updated[activeTab];
      const remaining = Object.keys(updated);
      setActiveTab(remaining[0] || "");
      return updated;
    });
  };

  return (
    <section id="skills" className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">04.</span> Skills
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading skills...</p>
      ) : (
        <>
          {/* Tab Buttons */}
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

            {/* Add/Delete Buttons Together */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCategory}
                className="text-sm text-[#64ffda] hover:underline"
              >
                + Add Group
              </button>
              {activeTab && (
                <button
                  onClick={handleDeleteCategory}
                  title="Delete Group"
                  className="text-red-500 hover:text-red-700 text-lg leading-none"
                >
                  ❌
                </button>
              )}
            </div>
          </div>

          {/* Rename Active Group */}
          {activeTab && (
            <div className="mb-6">
              <input
                value={activeTab}
                onChange={(e) => handleCategoryRename(e.target.value)}
                className="p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
            </div>
          )}

          {/* Skill Inputs */}
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
        </>
      )}
    </section>
  );
};

export default Skills;
