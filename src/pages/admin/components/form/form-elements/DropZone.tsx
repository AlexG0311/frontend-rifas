import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard";
import { useUpload } from "../../../pages/Rifas/hooks/useUpload";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export default function DropzoneImage({
  value,
  onChange,
}: Props) {
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const { upload, isUploading } = useUpload();

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];

      // Preview inmediata
      setPreview(URL.createObjectURL(file));

      try {
        const url = await upload(file);

        setPreview(url);

        onChange(url);
      } catch (error) {
        console.error(error);
        alert("No se pudo subir la imagen");
      }
    },
    [upload, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
  });

  return (
    <ComponentCard
      title="Imagen principal"
      desc="Esta imagen será la portada de la rifa"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition p-6
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />

            {isUploading ? (
              <p className="text-center text-blue-600">
                Subiendo imagen...
              </p>
            ) : (
              <p className="text-center text-blue-600">
                Haz clic o arrastra otra imagen para reemplazarla.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="font-semibold text-lg">
              {isDragActive
                ? "Suelta la imagen aquí"
                : "Arrastra una imagen"}
            </p>

            <p className="text-gray-500 mt-2">
              PNG, JPG o WEBP
            </p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}