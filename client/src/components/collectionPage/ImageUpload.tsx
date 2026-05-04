import { Music, Pencil, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  initialPreview?: string;
  onFileSelect: (file: File | null) => void;
}

export default function ImageUpload({
  onFileSelect,
  initialPreview,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
  };
  return (
    <div
      {...getRootProps()}
      className={`rounded-sm w-45 aspect-square flex items-center justify-center group cursor-pointer overflow-hidden border-none outline-none focus:outline-none ${isDragActive ? "bg-emerald-500/10" : "bg-zinc-800 hover:bg-zinc-800"}`}
      // className="bg-zinc-800 rounded-sm w-45 aspect-square flex items-center justify-center group"
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex flex-col items-center justify-center gap-1 transition-all">
            <Pencil className="size-10 text-white" />
            <p className="text-white tracking-tight font-medium">
              Choose photo
            </p>
          </div>

          <button
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <>
          <Music
            className={`text-zinc-500 size-16 transition-all ${isDragActive ? "scale-110" : "group-hover:hidden"}`}
          />

          <div
            className={`hidden group-hover:flex flex-col items-center justify-center gap-1 text-center ${isDragActive ? "hidden" : ""}`}
          >
            <Pencil className="size-10 text-white" />
            <p className="text-white font-medium tracking-tight">
              Choose photo
            </p>
          </div>
        </>
      )}
    </div>
  );
}
