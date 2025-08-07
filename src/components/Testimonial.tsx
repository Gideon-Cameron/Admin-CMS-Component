import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/uploadImageToCloudinary";

type TestimonialItem = {
  imageUrl: string;
  quote: string;
  projectLink: string;
};

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { imageUrl: "", quote: "", projectLink: "" },
  ]);

  const [sectionOrder, setSectionOrder] = useState<number>(5);
  const [enabled, setEnabled] = useState<boolean>(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const testimonialRef = doc(db, "content", "testimonials");
  const sectionMetaRef = doc(db, "sections", "testimonials");

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const [snap, metaSnap] = await Promise.all([
          getDoc(testimonialRef),
          getDoc(sectionMetaRef),
        ]);

        if (snap.exists()) {
          const data = snap.data().items as TestimonialItem[];
          setTestimonials(data);
          console.log("✅ Testimonials loaded:", data);
        }

        if (metaSnap.exists()) {
          const meta = metaSnap.data();
          setSectionOrder(meta.order ?? 5);
          setEnabled(meta.enabled ?? true);
          console.log("⚙️ Testimonial meta loaded:", meta);
        }
      } catch (err) {
        console.error("❌ Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleChange = (index: number, field: keyof TestimonialItem, value: string) => {
    setTestimonials((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        handleChange(index, "imageUrl", url);
        setMessage("✅ Image uploaded");
        console.log("🖼️ Uploaded image:", url);
      }
    } catch (err) {
      console.error("❌ Failed to upload image", err);
      setMessage("Upload failed");
    } finally {
      setUploadingIndex(null);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAdd = () => {
    setTestimonials((prev) => [...prev, { imageUrl: "", quote: "", projectLink: "" }]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setDoc(testimonialRef, { items: testimonials }),
        setDoc(sectionMetaRef, { order: sectionOrder, enabled }),
      ]);
      setMessage("✅ Testimonials saved");
      console.log("💾 Saved testimonials:", testimonials);
      console.log("⚙️ Saved meta:", { order: sectionOrder, enabled });
    } catch (err) {
      console.error("❌ Failed to save testimonials", err);
      setMessage("Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <section id="testimonials" className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-24">
      <motion.div
        className="flex items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-[#007acc] dark:text-[#64ffda] font-mono whitespace-nowrap">
          <span className="mr-2">05.</span> Testimonials
        </h2>
        <div className="h-px ml-5 flex-1 max-w-[300px] bg-[#8892b0]" />
      </motion.div>

      {/* Section Settings */}
      <div className="flex items-center gap-6 mb-8">
        <label className="flex items-center gap-2 font-mono text-sm">
          Section Order:
          <input
            type="number"
            min={0}
            value={sectionOrder}
            onChange={(e) => setSectionOrder(Number(e.target.value))}
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
        <p className="text-center text-[#8892b0]">Loading testimonials...</p>
      ) : (
        <>
          {testimonials.map((item, idx) => (
            <div key={idx} className="mb-10 space-y-4 p-4 border rounded border-[#64ffda]/30">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#64ffda]">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={`testimonial-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#112240] flex items-center justify-center text-sm text-[#64ffda]">
                      No image
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(idx, file);
                  }}
                  className="text-sm text-[#64ffda]"
                />
                {uploadingIndex === idx && (
                  <p className="text-xs text-yellow-400">Uploading...</p>
                )}
              </div>

              <textarea
                placeholder="Testimonial (max 1000 chars)"
                maxLength={1000}
                value={item.quote}
                onChange={(e) => handleChange(idx, "quote", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
              <input
                type="text"
                placeholder="Project link"
                value={item.projectLink}
                onChange={(e) => handleChange(idx, "projectLink", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="mt-4 text-sm text-[#64ffda] hover:underline"
          >
            + Add Testimonial
          </button>

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

export default Testimonial;
