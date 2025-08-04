export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    if (!cloudName || !uploadPreset) {
      console.error("❌ Missing Cloudinary credentials in .env");
      return "";
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok && data.secure_url) {
        console.log("✅ Image uploaded:", data.secure_url);
        return data.secure_url as string;
      } else {
        console.error("❌ Cloudinary error:", data);
        return "";
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      return "";
    }
  };
  