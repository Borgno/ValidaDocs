import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Moldura de modal no padrão do ConfirmDeleteDialog: fundo desfocado, card central, fecha no X, no
// clique fora e no Esc.
export function Modal({
  isOpen,
  title,
  description,
  onClose,
  children,
  maxWidth = "max-w-[480px]",
}: {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex animate-fadeIn items-center justify-center bg-black/40 p-5 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[calc(100vh-40px)] w-full ${maxWidth} animate-modalIn overflow-y-auto rounded-2xl border border-glass-border bg-bg p-8 shadow-modal`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 flex items-center justify-center rounded-md bg-transparent p-1.5 text-text-muted transition-all duration-200 hover:bg-surface-light hover:text-text"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
        <div className="mb-6 flex flex-col gap-2 pr-6">
          <h2 className="text-lg font-bold tracking-wider text-text uppercase">{title}</h2>
          {description && (
            <p className="font-inter text-sm leading-relaxed text-text-muted">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
