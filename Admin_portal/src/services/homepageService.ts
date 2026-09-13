import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

export const saveHomepageContent = async (data: any, image: File | null) => {
  const formData = new FormData();

  // Append JSON data as blob with application/json type
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  // Append image only if provided
  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/homepage/content`,
    formData,
  );

  return response.data;
};

export const getHomepageContent = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/homepage/content`);
  return response.data;
};
