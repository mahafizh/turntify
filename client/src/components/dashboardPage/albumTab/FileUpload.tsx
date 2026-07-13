import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

interface FileUploadProps {
  label: string;
  initialPreview?: string;
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({
  label,
  onFileSelect,
  initialPreview,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
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
    setFileName(null);
    onFileSelect(null);
  };

  return (
    <Field className="w-full">
      <FieldLabel className="text-white">{label}</FieldLabel>

      <div
        {...getRootProps()}
        className={`
          relative mt-2 flex flex-col items-center justify-center rounded-lg border-2 transition-all
          ${preview ? "border-solid border-zinc-800 bg-zinc-900/50" : "border-dashed border-zinc-900"}
          ${!preview ? "bg-zinc-900/50 hover:bg-zinc-900/80" : "bg-transparent"}
          ${isDragActive ? "border-emerald-500 bg-emerald-500/5" : ""}
          p-4 cursor-pointer
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-32 w-32 overflow-hidden rounded-md border border-zinc-800 hover:border-zinc-800">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                onClick={removeFile}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-3 rounded-full p-3 ${isDragActive ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-900 text-zinc-400"}`}
            >
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              {isDragActive ? "Drop file here" : "Click or drag file here"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </Field>
  );
}
