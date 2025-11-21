import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Tooltip from "../components/Tooltip"; 

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
      console.log("🔄 Fetching hero data from Firestore...");
      setLoading(true);
      try {
        const snap = await getDoc(heroRef);
        if (snap.exists()) {
          const data = snap.data();
          console.log("✅ Hero document data:", data);
          setIntro(data.intro || "");
          setName(data.name || "");
          setSubtitle(data.subtitle || "");
          setDescription(data.description || "");
        } else {
          console.log("⚠️ Hero document does not exist.");
        }
      } catch (error) {
        console.error("🔥 Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  const handleSave = async () => {
    console.log("💾 Saving hero data:", { intro, name, subtitle, description });
    setSaving(true);
    try {
      await setDoc(heroRef, { intro, name, subtitle, description });
      console.log("✅ Hero data saved.");
      setMessage("Saved successfully!");
    } catch (error) {
      console.error("🔥 Failed to save hero data:", error);
      setMessage("Error saving. See console.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <p className="text-center text-[#8892b0]">Loading hero content...</p>;
  }

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-4xl mx-auto space-y-6">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-[#0a192f]"
      >
        Admin Control Panel
      </motion.h1>

      {/* NAME */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-[#0a192f] flex items-center gap-2"
      >
        Name
        <Tooltip text="Displayed as the main headline on the hero section." />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 mb-4 p-2 rounded bg-white border border-gray-300"
        />
      </motion.label>

      {/* SUBTITLE */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-[#0a192f] flex items-center gap-2"
      >
        Subtitle
        <Tooltip text="Appears directly below the name." />

        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full mt-1 mb-4 p-2 rounded bg-white border border-gray-300"
        />
      </motion.label>

      {/* DESCRIPTION */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-base font-semibold text-[#0a192f] flex items-center gap-2"
      >
        Description
        <Tooltip text="A longer text block describing you or your services." />

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-white border border-gray-300"
        />
      </motion.label>

      {/* BUTTON */}
      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && <span className="text-sm text-green-600">{message}</span>}
      </div>
    </section>
  );
};

export default Hero;
