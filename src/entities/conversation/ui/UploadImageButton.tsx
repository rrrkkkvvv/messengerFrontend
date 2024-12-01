import React, { ChangeEvent, useState } from "react";
import { IoMdImages } from "react-icons/io";

interface UploadButtonProps {
  onUpload: (url: string) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        console.error("Error uploading file:", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label style={{ cursor: "pointer" }}>
      {isLoading ? (
        <div
          className="animate-spin h-8 w-8 border-t-4 border-b-4 border-y-green-500 rounded-full"
          role="status"
        ></div>
      ) : (
        <IoMdImages className="text-4xl transition duration-300 text-white hover:text-green-500 " />
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </label>
  );
};

export default UploadButton;
