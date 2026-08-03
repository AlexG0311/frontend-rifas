import type { ApiResponse } from "../types/api.type";

export interface UploadResponse {
  url: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const response: ApiResponse<UploadResponse> = await res.json();

  if (!res.ok) {
    throw new Error(response.message);
  }

  return response.data.url;
};