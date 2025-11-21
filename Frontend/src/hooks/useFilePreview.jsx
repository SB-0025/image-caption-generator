import { useState, useEffect, useRef } from "react";

export default function useFilePreview() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(e) {
    const f = e?.target?.files && e.target.files[0];
    if (!f) return;
    if (!f.type || !f.type.startsWith("image/")) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function clearAll() {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return {
    imageFile,
    previewUrl,
    fileInputRef,
    handleFile,
    clearAll,
    setImageFile,
    setPreviewUrl,
  };
}
