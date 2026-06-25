"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react";
import { uploadProfessionalImage as uploadWorkImage } from "@/lib/professionals-service";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  accent?: string;
};

export function ImageUploader({ value, onChange, accent = "#A855F7" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        // Validate type
        if (!file.type.startsWith("image/")) {
          throw new Error("Solo se permiten imágenes (JPG, PNG, WebP)");
        }
        // Validate size (max 10 MB original — gets compressed automatically)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("La imagen no puede pesar más de 10 MB");
        }
        const url = await uploadWorkImage(file);
        onChange(url);
      } catch (e: any) {
        setError(e?.message || "Error al procesar la imagen");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden group" style={{ background: "rgba(11, 16, 32, 0.6)" }}>
          { }
          <img src={value} alt="Preview" className="w-full aspect-[4/3] object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: accent }}
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg bg-red-500 text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          disabled={uploading}
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-rm-text2 hover:text-white transition-all disabled:opacity-50"
          style={{
            borderColor: dragOver ? accent : "rgba(255, 255, 255, 0.15)",
            background: dragOver ? `${accent}10` : "rgba(11, 16, 32, 0.4)",
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin mb-2" style={{ color: accent }} />
              <p className="text-xs">Procesando imagen...</p>
            </>
          ) : (
            <>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${accent}20`, color: accent }}
              >
                <Upload size={20} />
              </div>
              <p className="text-sm font-medium text-white mb-1">
                Arrastra una imagen aquí
              </p>
              <p className="text-xs">o click para seleccionar</p>
              <p className="text-[10px] mt-2 text-rm-text2/60">
                JPG, PNG, WebP · Máx 10 MB (se comprime automáticamente)
              </p>
            </>
          )}
        </button>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 p-2 rounded-lg text-xs flex items-center gap-2 text-red-400"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!value && !error && (
        <p className="mt-2 text-[10px] text-rm-text2/60 flex items-center gap-1">
          <ImageIcon size={10} />
          Recomendado: 1344×768px · Se comprime a máximo 1280px de ancho
        </p>
      )}
    </div>
  );
}
