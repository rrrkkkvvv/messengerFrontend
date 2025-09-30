import { ChangeEvent, FC, useRef, useState } from "react";
import { IoMdImages } from "react-icons/io";
interface UploadButtonProps {
  setImagePreview: (url: string) => void;
  setImage: (fileBuffer: number[]) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ setImagePreview, setImage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  function clearInputFile() {
    if (inputRef.current && inputRef.current.value) {
      try {
        inputRef.current.value = ""; //for IE11, latest Chrome/Firefox/Opera...
      } catch (err) {}
      if (inputRef.current.value) {
        //for IE5 ~ IE10
        var form = document.createElement("form"),
          parentNode = inputRef.current.parentNode,
          ref = inputRef.current.nextSibling;
        form.appendChild(inputRef.current);
        form.reset();
        parentNode?.insertBefore(inputRef.current, ref);
      }
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const buffer = Array.from(uint8Array);

      setImage(buffer);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
      clearInputFile();
    }
  };

  return (
    <label style={{ cursor: "pointer" }}>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-50"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <IoMdImages className="text-4xl md:text-3xl transition duration-300 text-gray-50 hover:text-gray-100 " />
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
        ref={inputRef}
      />
    </label>
  );
};

export default UploadButton;
