import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Hero = () => {
  const [intro, setIntro] = useState("");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const heroRef = doc(db, "content", "hero");

  useEffect(() => {
    const fetchHero = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(heroRef);
        if (snap.exists()) {
          const data = snap.data();
          setIntro(data.intro || "");
          setName(data.name || "");
          setSubtitle(data.subtitle || "");
          setDescription(data.description || "");
        }
      } catch (error) {
        console.error("Failed to fetch hero content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(heroRef, { intro, name, subtitle, description });
      setMessage("Saved successfully!");
    } catch (error) {
      console.error("Failed to save", error);
      setMessage("Error saving. See console.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-4xl mx-auto space-y-4">
      {loading ? (
        <p className="text-center text-[#8892b0]">Loading hero content...</p>
      ) : (
        <>
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-mono text-[#64ffda]"
          >
            Intro Text
            <input
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full mt-1 mb-4 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          </motion.label>

          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-[#ccd6f6]"
          >
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 mb-4 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          </motion.label>

          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-[#8892b0]"
          >
            Subtitle
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full mt-1 mb-4 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          </motion.label>

          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-[#8892b0]"
          >
            Description
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          </motion.label>

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
        </>
      )}
    </section>
  );
};

export default Hero;
