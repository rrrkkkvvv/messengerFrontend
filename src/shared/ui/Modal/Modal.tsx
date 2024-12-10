import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 bg-black bg-opacity-50 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div
        className={`relative z-50  bg-white rounded-lg shadow-xl transform transition duration-300 w-full max-w-lg p-8 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        <button
          className=" absolute top-2 right-2  text-gray-300 hover:text-gray-100 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <IoCloseOutline className="scale-150" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
