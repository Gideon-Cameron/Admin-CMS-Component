import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/uploadImageToCloudinary"; // ← Make sure this path matches

const About = () => {
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState([""]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const aboutRef = doc(db, "content", "about");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const snap = await getDoc(aboutRef);
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || "");
          setParagraphs(data.paragraphs || [""]);
          setImageUrl(data.imageUrl || "");
        }
      } catch (err) {
        console.error("❌ Failed to fetch about content:", err);
      }
    };

    fetchAbout();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setImageUrl(url);
        setMessage("✅ Image uploaded!");
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (err) {
      console.error("❌ Cloudinary upload error:", err);
      setMessage("❌ Upload error");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(aboutRef, { title, paragraphs, imageUrl });
      setMessage("✅ Saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save about data:", err);
      setMessage("❌ Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-24 flex flex-col md:flex-row gap-12 items-center">
      {/* TEXT SIDE */}
      <motion.div className="md:w-3/5">
        <motion.div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono">
            <span className="mr-2">01.</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-[#64ffda] outline-none text-[#64ffda] font-bold text-lg"
            />
          </h2>
          <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#233554]" />
        </motion.div>

        <div className="space-y-4 text-[#4b5563] dark:text-[#8892b0]">
          {paragraphs.map((text, i) => (
            <textarea
              key={i}
              value={text}
              onChange={(e) =>
                setParagraphs((prev) =>
                  prev.map((p, index) => (index === i ? e.target.value : p))
                )
              }
              rows={3}
              className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          ))}
          <button
            onClick={() => setParagraphs([...paragraphs, ""])}
            className="text-sm text-[#64ffda] hover:underline"
          >
            + Add Paragraph
          </button>
        </div>
      </motion.div>

      {/* IMAGE SIDE */}
      <motion.div className="md:w-2/5 flex flex-col items-center gap-4">
        <div className="relative w-64 h-64 rounded overflow-hidden shadow-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
            />
          ) : (
            <p className="text-sm text-center text-[#8892b0]">No image uploaded</p>
          )}
          <div className="absolute inset-0 border-2 border-[#64ffda] rounded pointer-events-none" />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
        />
      </motion.div>

      {/* Save Button */}
      <div className="w-full mt-6 flex gap-4 items-center justify-center md:justify-start">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {uploading && <span className="text-sm text-yellow-400">Uploading image...</span>}
        {message && <span className="text-sm text-green-400">{message}</span>}
      </div>
    </section>
  );
};

export default About;
