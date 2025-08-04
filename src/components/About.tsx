import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/uploadImageToCloudinary";

const About = () => {
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
      await setDoc(aboutRef, { title: "About Me", paragraphs, imageUrl });
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
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-24">
      {/* Header */}
      <motion.div className="flex items-center mb-10">
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono">
          <span className="mr-2">01.</span> About Me
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#233554]" />
      </motion.div>

      {/* Content Grid */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* LEFT - TEXT */}
        <motion.div className="md:w-3/5 space-y-6">
          {paragraphs.map((text, i) => (
            <textarea
              key={i}
              value={text}
              onChange={(e) =>
                setParagraphs((prev) =>
                  prev.map((p, index) => (index === i ? e.target.value : p))
                )
              }
              rows={6}
              placeholder={`Paragraph ${i + 1}`}
              className="w-full p-4 text-base rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          ))}
          <button
            onClick={() => setParagraphs([...paragraphs, ""])}
            className="text-sm text-[#64ffda] hover:underline"
          >
            + Add Paragraph
          </button>
        </motion.div>

        {/* RIGHT - IMAGE */}
        <motion.div
          className="md:w-2/5 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative w-64 h-64 overflow-hidden border-2 border-[#64ffda] shadow-lg rounded">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#112240] flex items-center justify-center text-sm text-[#64ffda]">
                No image uploaded
              </div>
            )}
          </div>

          <label className="cursor-pointer text-sm bg-[#64ffda] text-[#0a192f] px-5 py-2 rounded hover:bg-[#52d0c5] transition">
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0])
              }
              className="hidden"
            />
          </label>
        </motion.div>
      </div>

      {/* SAVE BUTTON */}
      <div className="w-full mt-12 flex flex-col items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded bg-[#64ffda] text-[#0a192f] font-semibold hover:bg-[#52d0c5] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {uploading && (
          <span className="text-sm text-yellow-400">Uploading image...</span>
        )}
        {message && <span className="text-sm text-green-400">{message}</span>}
      </div>
    </section>
  );
};

export default About;
