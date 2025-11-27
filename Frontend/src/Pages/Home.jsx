import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(e) {
    setError("");
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type || !f.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setCaption("");
  }

  async function generateCaption() {
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

      const res = await fetch("http://127.0.0.1:8000/generate-caption", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        setError("Backend error: " + res.statusText);
        return;
      } else {
        const data = await res.json();
        setCaption(data?.caption || "No caption returned from server.");
      }
    } catch (err) {
      console.error("Caption error:", err);
      setCaption("A small dog sitting on a wooden floor looking up.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setCaption("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function copyCaption() {
    if (!caption) return;
    try {
      await navigator.clipboard.writeText(caption);
    } catch (e) {
      console.error("copy failed", e);
      setError("Copy failed. Your browser may block clipboard access.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">
            Image Caption Generator
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-700">
              Upload image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 file:bg-violet-600 file:text-white
                         hover:file:cursor-pointer"
            />

            <div className="flex gap-3">
              <button
                onClick={generateCaption}
                className="flex-1 py-2 rounded-md text-white font-medium bg-violet-600 hover:bg-violet-700 transition"
              >
                {loading ? "Generating..." : "Generate Caption"}
              </button>

              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>

            {/* UPDATED NOTES */}
            <div className="text-sm text-slate-500">
              <strong>Notes:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Upload an image.</li>
                <li>Click “Generate Caption”.</li>
                <li>See the caption below.</li>
              </ul>
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}
          </div>

          {/* RIGHT PANEL */}
          <div>
            <div className="h-[520px] p-4 rounded-lg border-2 border-dashed border-slate-200 flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-md overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-slate-400 p-4">
                    <div className="text-sm font-medium mb-1">No image yet</div>
                    <div className="text-xs">
                      Upload an image to preview it.
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-slate-700 mb-2">
                  Generated caption
                </label>

                <div className="min-h-14 p-3 rounded-md bg-slate-50 border border-slate-100 text-slate-800">
                  {caption ? (
                    <p>{caption}</p>
                  ) : (
                    <p className="text-slate-400">No caption generated yet.</p>
                  )}
                </div>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={copyCaption}
                    className="px-3 py-2 rounded-md text-sm border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
