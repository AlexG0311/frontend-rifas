import { useState } from "react";
import { uploadImage } from "../../../services/upload.service";

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    setIsUploading(true);

    try {
      return await uploadImage(file);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
  };
};