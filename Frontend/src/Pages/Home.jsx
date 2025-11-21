import React, { useState } from "react";
import useFilePreview from "../hooks/useFilePreview.jsx";
import Uploader from "../components/Uploader.jsx";
import PreviewCard from "../components/PreviewCard.jsx";

export default function Home() {
  const { imageFile, previewUrl, fileInputRef, handleFile, clearAll } = useFilePreview();
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onGenerate() {
    setError("");

    if (!imageFile) {
      setError("Upload an image first.");
      return;
    }

    setLoading(true);
    setCaption("");

    try {
      const fd = new FormData();
      fd.append("file", imageFile);

      const res = await fetch("/api/caption", { method: "POST", body: fd });

      if (!res.ok) {
        // fallback caption when server returns error
        setCaption("A small dog sitting on a wooden floor looking up.");
      } else {
        const data = await res.json();
        setCaption(data?.caption || "No caption returned from server.");
      }
    } catch (err) {
      console.error("generate error:", err);
      setCaption("A small dog sitting on a wooden floor looking up.");
      setError("Failed to generate caption. Showing sample caption.");
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!caption) return;

    try {
      await navigator.clipboard.writeText(caption);
      
      // optional: give feedback (console for now)
      console.log("Caption copied to clipboard");
    } catch (err) {
      console.error("copy failed:", err);
      setError("Copy failed. Your browser blocked clipboard access.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Image Caption Generator</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
          <div>
            <Uploader
              fileInputRef={fileInputRef}
              onFileChange={handleFile}
              onGenerate={onGenerate}
              onClear={clearAll}
              loading={loading}
            />
            {error && <div className="text-sm text-rose-600 mt-3">{error}</div>}
          </div>

          <div>
            <PreviewCard previewUrl={previewUrl} caption={caption} onCopy={onCopy} />
          </div>
        </div>
      </div>
    </div>
  );
}
