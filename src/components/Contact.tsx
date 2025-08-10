import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Contact = () => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sectionsRef = doc(db, "sections", "contact");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsSnap = await getDoc(sectionsRef);
        if (sectionsSnap.exists()) {
          const sectionData = sectionsSnap.data();
          setDisplayNumber(sectionData.displayNumber ?? 1);
          setEnabled(sectionData.enabled ?? true);
          setDescription(sectionData.description ?? "");
        }
      } catch (err) {
        console.error("❌ Failed to fetch contact section config:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(sectionsRef, {
        enabled,
        displayNumber,
        description,
      });
      setMessage("✅ Saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save contact section config:", err);
      setMessage("❌ Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">
      {/* Header */}
      <motion.div className="flex items-center mb-10">
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono">
          <span className="mr-2">{`0.${displayNumber}`}</span> Contact Section
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#233554]" />
      </motion.div>

      {/* Section Settings */}
      <div className="flex flex-wrap gap-6 mb-10">
        <label className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="accent-[#64ffda]"
          />
          Show this section
        </label>

        <label className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300">
          Display Number:
          <input
            type="number"
            min={1}
            value={displayNumber}
            onChange={(e) =>
              setDisplayNumber(
                e.target.value === "" ? 1 : Number(e.target.value)
              )
            }
            className="w-20 px-2 py-1 rounded bg-gray-100 dark:bg-[#112240] dark:text-white border border-gray-300 dark:border-gray-600"
          />
        </label>
      </div>

      {/* Description Field */}
      <div className="mb-10">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Enter description..."
          className="w-full p-4 text-base rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
        />
      </div>

      {/* Save Button */}
      <div className="w-full mt-6 flex flex-col items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && <span className="text-sm text-green-400">{message}</span>}
      </div>
    </section>
  );
};

export default Contact;
