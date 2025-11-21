import React from "react";

export default function PreviewCard({ previewUrl, caption, onCopy }) {
  return (
    <div className="h-[520px] p-4 rounded-lg border-2 border-dashed border-slate-200 flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-md overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="text-center text-slate-400 p-4">
            <div className="text-sm font-medium mb-1">No image yet</div>
            <div className="text-xs">Upload an image to preview it.</div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm text-slate-700 mb-2">Generated caption</label>

        <div className="min-h-14 p-3 rounded-md bg-slate-50 border border-slate-100 text-slate-800">
          {caption ? <p>{caption}</p> : <p className="text-slate-400">No caption generated yet.</p>}
        </div>

        <div className="mt-3 flex gap-3">
          <button onClick={onCopy} className="px-3 py-2 rounded-md text-sm border border-slate-200 text-slate-700 hover:bg-slate-50">
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
