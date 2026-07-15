import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

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

  useEffect(() => setMounted(true), []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 dark:bg-black/55 backdrop-blur-md flex items-center justify-center p-5 z-[1000] animate-fadeIn" onClick={onCancel}>
      <div
        className="w-full max-w-[480px] max-h-[calc(100vh-40px)] overflow-y-auto bg-bg border border-glass-border rounded-2xl p-8 shadow-modal animate-modalIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 p-1.5 rounded-md bg-transparent text-text-muted flex items-center justify-center transition-all duration-200 hover:bg-error/10 hover:text-error"
          onClick={onCancel} 
          title="Cancelar"
        >
          <X size={16} />
        </button>

        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-text">{title}</h2>
          </div>
          <p className="text-sm font-inter text-text-muted leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <button className="inline-flex items-center justify-center gap-2 border border-glass-border text-text bg-transparent font-bold uppercase tracking-wide text-xs px-6 py-2.5 rounded-lg transition-all duration-200 hover:bg-surface-light" onClick={onCancel}>
            CANCELAR
          </button>
          <button className="inline-flex items-center justify-center gap-2 border border-error text-error bg-transparent font-bold uppercase tracking-wide text-xs px-6 py-2.5 rounded-lg transition-all duration-200 hover:bg-error hover:text-white" onClick={onConfirm}>
            <Trash2 size={16} strokeWidth={2} />
            EXCLUIR
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
