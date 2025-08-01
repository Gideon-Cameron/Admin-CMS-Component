import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type TestimonialItem = {
  imageUrl: string;
  quote: string;
  projectLink: string;
};

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { imageUrl: "", quote: "", projectLink: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const testimonialRef = doc(db, "content", "testimonials");

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(testimonialRef);
        if (snap.exists()) {
          const data = snap.data().items as TestimonialItem[];
          setTestimonials(data);
          console.log("✅ Testimonial data loaded:", data);
        } else {
          console.warn("⚠️ Testimonials document does not exist.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch testimonials", err);
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

  const handleAdd = () => {
    setTestimonials((prev) => [...prev, { imageUrl: "", quote: "", projectLink: "" }]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(testimonialRef, { items: testimonials });
      setMessage("Testimonials saved!");
      console.log("💾 Saved testimonial data:", testimonials);
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

      {loading ? (
        <p className="text-center text-[#8892b0]">Loading testimonials...</p>
      ) : (
        <>
          {testimonials.map((item, idx) => (
            <div key={idx} className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Image URL"
                value={item.imageUrl}
                onChange={(e) => handleChange(idx, "imageUrl", e.target.value)}
                className="w-full p-2 rounded bg-gray-100 dark:bg-[#112240] dark:text-white"
              />
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
