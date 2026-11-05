import { Eye, EyeOff, FileCheck } from "lucide-react";
import { useState } from "react";

// Moldura das telas fora do app (login, troca obrigatória de senha). Vem do ModuloDefault, com os
// tokens de cor do ValidaDocs.
export function AuthCard({ subtitle, children }: { subtitle: string; children: React.ReactNode }) {
  return (
    <div className="h-dvh w-full overflow-y-auto bg-bg selection:bg-primary/30">
      <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-6">
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-[22px] bg-primary text-white ring-4 ring-primary/10">
              <FileCheck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tighter uppercase">ValidaDocs</h1>
            <p className="text-center font-medium text-text-muted">{subtitle}</p>
          </div>

          <div className="rounded-[2rem] border border-glass-border bg-card-bg p-10 shadow-card">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Campo com rótulo em caixa alta e ícone à esquerda.
export function AuthField({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="ml-4 text-[10px] font-bold tracking-[0.2em] text-text-dim uppercase"
      >
        {label}
      </label>
      <div className="group relative">
        <div className="absolute top-1/2 left-5 z-10 -translate-y-1/2 text-text-dim transition-colors group-focus-within:text-primary">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="ml-4 text-xs font-bold text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-2xl bg-badge-error-bg p-4 text-xs font-bold text-badge-error-text"
    >
      {children}
    </div>
  );
}

export const authInputClass =
  "h-14 w-full rounded-3xl border border-glass-border bg-surface pr-6 pl-14 text-text outline-none transition-colors placeholder:text-text-dim focus:border-border-focus";

// Campo de senha com botão para mostrar e ocultar o que foi digitado.
export function PasswordInput({
  className = "",
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${authInputClass} pr-14 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-dim transition-colors hover:text-text focus-visible:text-primary"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
