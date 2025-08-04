import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/uploadImageToCloudinary";

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
    <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-24 flex flex-col md:flex-row gap-12 items-start">
      {/* LEFT - TEXT */}
      <motion.div className="md:w-3/5">
        <motion.div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono">
            <span className="mr-2">01.</span> About
          </h2>
          <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#233554]" />
        </motion.div>

        <div className="mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white text-xl font-semibold"
            placeholder="Section Title"
          />
        </div>

        <div className="space-y-4">
          {paragraphs.map((text, i) => (
            <textarea
              key={i}
              value={text}
              onChange={(e) =>
                setParagraphs((prev) =>
                  prev.map((p, index) => (index === i ? e.target.value : p))
                )
              }
              rows={4}
              placeholder={`Paragraph ${i + 1}`}
              className="w-full p-3 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
            />
          ))}
          <button
            onClick={() => setParagraphs([...paragraphs, ""])}
            className="text-sm text-[#64ffda] hover:underline mt-1"
          >
            + Add Paragraph
          </button>
        </div>
      </motion.div>

      {/* RIGHT - IMAGE */}
      <motion.div
        className="md:w-2/5 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-[#64ffda] shadow-lg">
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0])
          }
          className="text-sm file:bg-[#64ffda] file:text-[#0a192f] file:px-4 file:py-2 file:rounded file:cursor-pointer"
        />
      </motion.div>

      {/* ACTIONS */}
      <div className="w-full mt-10 flex gap-4 items-center justify-start">
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
        {message && (
          <span className="text-sm text-green-400">{message}</span>
        )}
      </div>
    </section>
  );
};

export default About;
