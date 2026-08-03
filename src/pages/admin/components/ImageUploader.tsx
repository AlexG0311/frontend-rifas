import { useState } from "react";
import { useUpload } from "../pages/Rifas/hooks/useUpload";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const { upload, isUploading } = useUpload();

  const [preview, setPreview] = useState(value ?? "");

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const local = URL.createObjectURL(file);

    setPreview(local);

    try {
      const url = await upload(file);

      setPreview(url);

      onChange(url);
    } catch (err) {
      console.error(err);
      alert("Error subiendo imagen");
    }
  };

  return (
    <div className="space-y-3">
      {preview && (
        <img
          src={preview}
          className="w-full h-56 rounded-lg object-cover border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {isUploading && (
        <p>Subiendo imagen...</p>
      )}
    </div>
  );
}