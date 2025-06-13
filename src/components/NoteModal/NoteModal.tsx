import { createPortal } from "react-dom";
import css from "./NoteModal.module.css";
import { useEffect } from "react";

interface NoteModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function NoteModal({ onClose, children }: NoteModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEscClick = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscClick);
    return () => document.removeEventListener("keydown", handleEscClick);
  }, [onClose]);

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}