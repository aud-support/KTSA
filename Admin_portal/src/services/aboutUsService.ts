import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

/**
 * Fetch current About Us content from the backend (S3).
 */
export const getAboutUsContent = async (): Promise<any> => {
  const response = await axios.get(`${API_BASE_URL}/api/about-us/content`);
  return response.data;
};

/**
 * Save About Us content to the backend.
 * @param data     - The AboutData object (without the image URL field)
 * @param image    - Optional new team image file
 * @param rulebook - Optional new rulebook PDF file
 */
export const saveAboutUsContent = async (
  data: any,
  image: File | null,
  rulebook?: File | null,
): Promise<void> => {
  const formData = new FormData();

  // Attach JSON payload as a Blob so Spring can deserialize it as @RequestPart
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }

  if (rulebook) {
    formData.append("rulebook", rulebook);
  }

  await axios.post(`${API_BASE_URL}/api/about-us/content`, formData);
};
