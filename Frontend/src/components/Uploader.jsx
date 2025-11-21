import React from "react";

export default function Uploader({ fileInputRef, onFileChange, onGenerate, onClear, loading }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-700">Upload image</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-violet-600 file:text-white hover:file:cursor-pointer"
      />

      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          className="flex-1 py-2 rounded-md text-white font-medium bg-violet-600 hover:bg-violet-700 transition"
        >
          {loading ? "Generating..." : "Generate Caption"}
        </button>

        <button onClick={onClear} className="px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
          Clear
        </button>
      </div>

      <div className="text-sm text-slate-500">
        <strong>Notes:</strong>
        <ul className="list-disc ml-5 mt-2">
          <li>Upload an image.</li>
          <li>Click “Generate Caption”.</li>
          <li>See the caption below.</li>
        </ul>
      </div>
    </div>
  );
}
