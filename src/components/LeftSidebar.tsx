import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type SocialLink = {
  name: string;
  url: string;
};

const SocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([{ name: "", url: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const ref = doc(db, "content", "social");

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const rawLinks = data.links || [];

          // Transform strings into objects if old format
          const formatted: SocialLink[] = rawLinks.map((item: any) =>
            typeof item === "string" ? { name: "", url: item } : item
          );

          setLinks(formatted.slice(0, 5));
          console.log("✅ Loaded social links:", formatted);
        } else {
          console.warn("⚠️ Social links document does not exist.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch social links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleChange = (index: number, key: keyof SocialLink, value: string) => {
    const updated = [...links];
    updated[index][key] = value;
    setLinks(updated);
  };

  const handleAddLink = () => {
    if (links.length < 5) {
      setLinks([...links, { name: "", url: "" }]);
    }
  };

  const handleRemoveLink = (index: number) => {
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const filtered = links
        .filter((link) => link.url.trim() !== "")
        .slice(0, 5);

      await setDoc(ref, { links: filtered });
      console.log("💾 Saved social links:", filtered);
      setMessage("Saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save social links:", err);
      setMessage("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-12 py-20 md:py-24">
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">06.</span> Social Links
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading social links...</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-4">
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 flex-col md:flex-row">
                <input
                  type="text"
                  placeholder="Link name (e.g. GitHub)"
                  value={link.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                  className="w-full md:w-1/3 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
                />
                <input
                  type="url"
                  placeholder="https://your-link.com"
                  value={link.url}
                  onChange={(e) => handleChange(idx, "url", e.target.value)}
                  className="w-full md:flex-1 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
                />
                <button
                  onClick={() => handleRemoveLink(idx)}
                  title="Remove link"
                  className="text-red-500 hover:text-red-700 self-start"
                >
                  ❌
                </button>
              </div>
            ))}
            {links.length < 5 && (
              <button
                onClick={handleAddLink}
                className="text-sm text-[#64ffda] hover:underline mt-2"
              >
                + Add Link
              </button>
            )}
          </div>

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
        </motion.div>
      )}
    </section>
  );
};

export default SocialLinks;
