import { useState, useEffect, ReactNode, FC } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
  alwaysRender?: boolean;
  animationStyles: (isVisible: boolean) => string;
  portalId: string;
  styles: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  styles,
  animationStyles,
  alwaysRender,
  portalId,
}) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isOpen]);
  if (!alwaysRender) {
    if (!isOpen) return null;
  }
  return createPortal(
    <div
      onClick={onClose}
      className={`fixed inset-0  z-20 flex   transition   duration-300  ${styles}  ${animationStyles(
        isVisible
      )} `}
    >
      <>{children}</>
    </div>,
    document.querySelector(`#${portalId}`) as HTMLElement
  );
};

export default Modal;
