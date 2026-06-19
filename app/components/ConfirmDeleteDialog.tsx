import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import "../styles/ConfirmDeleteDialog.css";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={`cdd-backdrop ${visible ? "cdd-backdrop--visible" : ""}`} onClick={onCancel}>
      <div
        className={`cdd-panel ${visible ? "cdd-panel--visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cdd-icon-wrapper">
          <AlertTriangle size={20} />
        </div>

        <div className="cdd-content">
          <p className="cdd-title">{title}</p>
          <p className="cdd-description">{description}</p>
        </div>

        <button className="cdd-btn-close" onClick={onCancel} title="Cancelar">
          <X size={16} />
        </button>

        <div className="cdd-actions">
          <button className="cdd-btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="cdd-btn-confirm" onClick={onConfirm}>
            <Trash2 size={14} />
            Excluir
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
