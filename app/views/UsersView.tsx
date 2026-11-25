import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  KeyRound,
  Loader2,
  Search,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Form, Link, useFetcher, useNavigation, useSearchParams, useSubmit } from "react-router";
import { Modal } from "../components/Modal";
import {
  PAGE_SIZE,
  ROLE_LABELS,
  type ListUsersQuery,
  type ManagedUser,
  type Role,
} from "../services/users/users.shared";

// Tela de usuários portada do ModuloDefault (app/routes/users): lista com busca e filtros na URL,
// criação em modal e edição num painel lateral aberto por ?userId=.

export type UsersActionResult = {
  intent: string;
  ok: boolean;
  message?: string;
  error?: string;
  field?: string;
  temporaryPassword?: string;
};

type UsersViewProps = {
  users: ManagedUser[];
  total: number;
  params: ListUsersQuery;
  currentUserId: string;
};

// Fuso fixo para o texto do servidor e do navegador baterem na hidratação.
function formatDateTime(value: string | null) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const labelClass = "ml-1 text-[10px] font-bold tracking-[0.2em] text-text-dim uppercase";
const inputClass =
  "h-11 w-full rounded-lg border border-glass-border bg-surface px-3 text-sm text-text outline-none transition-colors placeholder:text-text-dim focus:border-border-focus disabled:opacity-60";
const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-xs font-bold tracking-wide uppercase transition-all duration-200 disabled:opacity-60";
const primaryButton = `${outlineButton} border-primary text-primary hover:bg-primary hover:text-white`;
const neutralButton = `${outlineButton} border-glass-border text-text hover:bg-surface-light`;
const dangerButton = `${outlineButton} border-error text-error hover:bg-error hover:text-white`;

// --- Badges ---------------------------------------------------------------------------------

function Badge({ tone, children }: { tone: "primary" | "error" | "warning" | "neutral"; children: React.ReactNode }) {
  const tones = {
    primary: "bg-badge-primary-bg text-badge-primary-text",
    error: "bg-badge-error-bg text-badge-error-text",
    warning: "bg-badge-warning-bg text-badge-warning-text",
    neutral: "border border-glass-border text-text-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return <Badge tone={role === "admin" ? "primary" : "neutral"}>{ROLE_LABELS[role]}</Badge>;
}

// Bolinha decorativa: o texto do badge já diz o status.
function StatusBadge({ user }: { user: ManagedUser }) {
  if (!user.active) {
    return (
      <Badge tone="error">
        <span aria-hidden className="size-1.5 rounded-full bg-error" />
        Inativo
      </Badge>
    );
  }
  if (user.mustChangePassword) {
    return (
      <Badge tone="warning">
        <span aria-hidden className="size-1.5 rounded-full bg-warning" />
        Troca de senha pendente
      </Badge>
    );
  }
  return (
    <Badge tone="neutral">
      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
      Ativo
    </Badge>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} role="alert" className="ml-1 text-xs font-bold text-error">
      {message}
    </p>
  );
}

function Alert({ tone, children }: { tone: "error" | "primary"; children: React.ReactNode }) {
  const classes =
    tone === "error"
      ? "bg-badge-error-bg text-badge-error-text"
      : "bg-badge-primary-bg text-badge-primary-text";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl p-3 text-xs font-bold ${classes}`}>
      {children}
    </div>
  );
}

function RoleSelect({ id, defaultValue, disabled }: { id: string; defaultValue: Role; disabled?: boolean }) {
  return (
    <select id={id} name="role" defaultValue={defaultValue} disabled={disabled} className={inputClass}>
      <option value="user">{ROLE_LABELS.user}</option>
      <option value="admin">{ROLE_LABELS.admin}</option>
    </select>
  );
}

// --- Criação --------------------------------------------------------------------------------

function CreateUserModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (message: string) => void;
}) {
  const fetcher = useFetcher<UsersActionResult>();
  const pending = fetcher.state !== "idle";
  const result = fetcher.data?.intent === "create" ? fetcher.data : undefined;
  const fieldError = (field: string) => (result && !result.ok && result.field === field ? result.error : undefined);

  // O pai remonta o modal a cada abertura (key), o que zera o formulário e o fetcher.
  const done = fetcher.state === "idle" && result?.ok;
  useEffect(() => {
    if (done) onCreated(result?.message ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Novo usuário"
        description="A pessoa entra com a senha inicial e escolhe uma nova no primeiro acesso."
      >
        <fetcher.Form method="post" className="space-y-4" noValidate>
          <input type="hidden" name="intent" value="create" />
          <div className="space-y-1.5">
            <label htmlFor="create-fullName" className={labelClass}>Nome</label>
            <input id="create-fullName" name="fullName" autoComplete="off" className={inputClass} aria-invalid={Boolean(fieldError("fullName"))} />
            <FieldError id="create-fullName" message={fieldError("fullName")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="create-email" className={labelClass}>E-mail</label>
            <input id="create-email" name="email" type="email" autoComplete="off" className={inputClass} aria-invalid={Boolean(fieldError("email"))} />
            <FieldError id="create-email" message={fieldError("email")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="create-role" className={labelClass}>Cargo</label>
            <RoleSelect id="create-role" defaultValue="user" />
            <FieldError id="create-role" message={fieldError("role")} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="create-password" className={labelClass}>Senha inicial</label>
            <input id="create-password" name="password" type="password" autoComplete="new-password" className={inputClass} aria-invalid={Boolean(fieldError("password"))} />
            {fieldError("password") ? (
              <FieldError id="create-password" message={fieldError("password")} />
            ) : (
              <p className="ml-1 font-inter text-xs text-text-dim">Ao menos 8 caracteres. Entregue à pessoa por um canal seguro.</p>
            )}
          </div>
          {result && !result.ok && !result.field && <Alert tone="error">{result.error}</Alert>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className={neutralButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={primaryButton} disabled={pending}>
              {pending && <Loader2 size={14} className="animate-spin" />}
              Criar usuário
            </button>
          </div>
        </fetcher.Form>
    </Modal>
  );
}

// --- Painel do usuário ----------------------------------------------------------------------

function EditForm({ user, isSelf }: { user: ManagedUser; isSelf: boolean }) {
  const fetcher = useFetcher<UsersActionResult>();
  const pending = fetcher.state !== "idle";
  const result = fetcher.data?.intent === "update" ? fetcher.data : undefined;
  const fieldError = (field: string) => (result && !result.ok && result.field === field ? result.error : undefined);

  return (
    <fetcher.Form method="post" className="space-y-4" noValidate>
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="id" value={user.id} />
      <div className="space-y-1.5">
        <label htmlFor="edit-fullName" className={labelClass}>Nome</label>
        <input id="edit-fullName" name="fullName" defaultValue={user.fullName} className={inputClass} />
        <FieldError id="edit-fullName" message={fieldError("fullName")} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="edit-role" className={labelClass}>Cargo</label>
        <RoleSelect id="edit-role" defaultValue={user.role} disabled={isSelf} />
        {isSelf ? (
          <p className="ml-1 font-inter text-xs text-text-dim">Você não pode mudar o próprio cargo.</p>
        ) : (
          <FieldError id="edit-role" message={fieldError("role")} />
        )}
      </div>
      {result && !result.ok && !result.field && <Alert tone="error">{result.error}</Alert>}
      {result?.ok && fetcher.state === "idle" && <Alert tone="primary">{result.message}</Alert>}
      <button type="submit" className={primaryButton} disabled={pending}>
        {pending && <Loader2 size={14} className="animate-spin" />}
        Salvar alterações
      </button>
    </fetcher.Form>
  );
}

type PendingConfirm = {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  submit: Record<string, string>;
};

function AccessActions({ user, isSelf }: { user: ManagedUser; isSelf: boolean }) {
  const fetcher = useFetcher<UsersActionResult>();
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pending = fetcher.state !== "idle";
  const result = fetcher.data;

  useEffect(() => {
    if (fetcher.state === "idle" && result?.temporaryPassword) setTemporaryPassword(result.temporaryPassword);
  }, [fetcher.state, result]);

  function run() {
    if (!confirm) return;
    fetcher.submit({ ...confirm.submit, id: user.id }, { method: "post" });
    setConfirm(null);
  }

  async function copy() {
    if (!temporaryPassword) return;
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={neutralButton}
          disabled={pending}
          onClick={() =>
            setConfirm({
              title: "Resetar senha?",
              description: `${user.fullName || user.email} sai de todas as sessões abertas e troca a senha no próximo acesso.`,
              confirmLabel: "Resetar senha",
              submit: { intent: "resetPassword" },
            })
          }
        >
          <KeyRound size={14} />
          Resetar senha
        </button>
        {!isSelf && (
          <button
            type="button"
            className={user.active ? dangerButton : neutralButton}
            disabled={pending}
            onClick={() =>
              setConfirm(
                user.active
                  ? {
                      title: "Desativar usuário?",
                      description: `${user.fullName || user.email} perde o acesso na hora, inclusive nas sessões abertas. Dá para reativar depois.`,
                      confirmLabel: "Desativar",
                      danger: true,
                      submit: { intent: "setActive", active: "false" },
                    }
                  : {
                      title: "Reativar usuário?",
                      description: `${user.fullName || user.email} volta a ter acesso.`,
                      confirmLabel: "Reativar",
                      submit: { intent: "setActive", active: "true" },
                    },
              )
            }
          >
            {user.active ? <UserX size={14} /> : <UserCheck size={14} />}
            {user.active ? "Desativar" : "Reativar"}
          </button>
        )}
      </div>
      {result && !result.ok && fetcher.state === "idle" && <Alert tone="error">{result.error}</Alert>}
      {result?.ok && result.intent === "setActive" && fetcher.state === "idle" && <Alert tone="primary">{result.message}</Alert>}

      <Modal isOpen={confirm !== null} onClose={() => setConfirm(null)} title={confirm?.title ?? ""} description={confirm?.description}>
        <div className="flex justify-end gap-3">
          <button type="button" className={neutralButton} onClick={() => setConfirm(null)}>Cancelar</button>
          <button type="button" className={confirm?.danger ? dangerButton : primaryButton} onClick={run}>
            {confirm?.confirmLabel}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={temporaryPassword !== null}
        onClose={() => {
          setTemporaryPassword(null);
          setCopied(false);
        }}
        title="Senha temporária"
        description="Entregue à pessoa por um canal seguro. Ela não será mostrada de novo, e a troca é obrigatória no próximo acesso."
      >
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-glass-border bg-surface p-3">
          <code data-testid="temporary-password" className="flex-1 font-mono text-lg font-bold tracking-wider text-text">
            {temporaryPassword}
          </code>
          <button type="button" onClick={copy} aria-label="Copiar senha" className="flex size-9 items-center justify-center rounded-lg border border-glass-border text-text-muted transition-colors hover:text-text">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className={primaryButton}
            onClick={() => {
              setTemporaryPassword(null);
              setCopied(false);
            }}
          >
            Entendi
          </button>
        </div>
      </Modal>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-glass-border pt-6">
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-[3px] rounded-full bg-primary" />
        <h3 className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function UserDrawer({ user, isSelf, onClose }: { user: ManagedUser | null; isSelf: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!user) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [user, onClose]);

  if (!mounted || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1050] flex animate-fadeIn justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={user.fullName || user.email}
        className="flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-glass-border bg-bg p-8 shadow-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-text">{user.fullName || "Sem nome"}</h2>
            <p className="truncate font-inter text-sm text-text-muted">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-light hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <RoleBadge role={user.role} />
          <StatusBadge user={user} />
          <span className="text-xs text-text-muted">
            Último acesso: <span className="font-mono">{formatDateTime(user.lastLoginAt)}</span>
          </span>
        </div>

        <div className="space-y-6">
          <DrawerSection title="Dados">
            {/* key: o formulário volta aos valores do banco quando o usuário muda por fora. */}
            <EditForm key={`${user.id}:${user.fullName}:${user.role}`} user={user} isSelf={isSelf} />
          </DrawerSection>
          <DrawerSection title="Acesso">
            <AccessActions key={user.id} user={user} isSelf={isSelf} />
          </DrawerSection>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

// --- Página ---------------------------------------------------------------------------------

export function UsersView({ users, total, params, currentUserId }: UsersViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const filterForm = useRef<HTMLFormElement>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const selectedId = searchParams.get("userId");
  const selected = users.find((user) => user.id === selectedId) ?? null;
  const filtered = Boolean(params.search || params.role || params.active !== undefined);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const loading = navigation.state === "loading" && navigation.location.pathname === "/usuarios";

  function openUser(id: string | null) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id) next.set("userId", id);
        else next.delete("userId");
        return next;
      },
      { preventScrollReset: true },
    );
  }

  function pageHref(page: number) {
    const next = new URLSearchParams(searchParams);
    next.delete("userId");
    if (page > 1) next.set("page", String(page));
    else next.delete("page");
    const query = next.toString();
    return query ? `?${query}` : "?";
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-medium tracking-wide text-text uppercase">Usuários</h1>
            <p className="mt-1 font-inter text-[13px] text-text-muted">Quem acessa o sistema e com qual cargo.</p>
          </div>
        </div>
        <button type="button" className={primaryButton} onClick={() => setCreating(true)}>
          <UserPlus size={16} />
          Novo usuário
        </button>
      </header>

      <div className="rounded-xl border border-glass-border bg-card-bg shadow-card">
        {/* Filtros em GET: ficam na URL e o loader recarrega a lista. */}
        <Form ref={filterForm} method="get" className="flex flex-col gap-3 border-b border-glass-border p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-text-dim" />
            <input
              name="q"
              type="search"
              defaultValue={params.search ?? ""}
              placeholder="Buscar por nome ou e-mail"
              aria-label="Buscar usuário"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select
            name="role"
            aria-label="Cargo"
            defaultValue={params.role ?? ""}
            onChange={() => submit(filterForm.current)}
            className={`${inputClass} md:w-48`}
          >
            <option value="">Todos os cargos</option>
            <option value="admin">{ROLE_LABELS.admin}</option>
            <option value="user">{ROLE_LABELS.user}</option>
          </select>
          <select
            name="active"
            aria-label="Status"
            defaultValue={params.active === undefined ? "" : String(params.active)}
            onChange={() => submit(filterForm.current)}
            className={`${inputClass} md:w-44`}
          >
            <option value="">Todos os status</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className={neutralButton}>Buscar</button>
            {filtered && (
              <Link to="/usuarios" className={neutralButton}>Limpar</Link>
            )}
          </div>
        </Form>

        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <Users size={32} strokeWidth={1.5} className="text-text-dim" />
              <p className="font-semibold text-text">Nenhum usuário encontrado</p>
              <p className="font-inter text-sm text-text-muted">
                {filtered ? "Ajuste a busca ou os filtros." : "Crie o primeiro usuário para começar."}
              </p>
            </div>
          ) : (
            <>
              <table className="hidden w-full text-left text-sm md:table">
                <thead>
                  <tr className="border-b border-glass-border text-[11px] tracking-wider text-text-muted uppercase">
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Cargo</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Último acesso</th>
                    <th className="px-4 py-3 font-semibold">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => openUser(user.id)}
                      className="cursor-pointer border-b border-glass-border transition-colors last:border-0 hover:bg-surface"
                    >
                      <td className="px-4 py-3">
                        <button type="button" className="text-left" aria-label={`Abrir ${user.fullName || user.email}`}>
                          <p className="font-bold text-text">{user.fullName || "Sem nome"}</p>
                          <p className="font-inter text-xs text-text-muted">{user.email}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3"><StatusBadge user={user} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">{formatDateTime(user.lastLoginAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">{formatDateTime(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="divide-y divide-glass-border md:hidden">
                {users.map((user) => (
                  <li key={user.id}>
                    <button type="button" onClick={() => openUser(user.id)} className="w-full space-y-1 p-4 text-left hover:bg-surface">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-bold text-text">{user.fullName || "Sem nome"}</p>
                        <RoleBadge role={user.role} />
                      </div>
                      <p className="truncate font-inter text-xs text-text-muted">{user.email}</p>
                      {(!user.active || user.mustChangePassword) && <StatusBadge user={user} />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-glass-border px-4 py-3 text-xs text-text-muted">
          <span>
            <span className="font-mono font-bold">{total}</span> {total === 1 ? "usuário" : "usuários"}
          </span>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <Link
                to={pageHref(params.page - 1)}
                aria-disabled={params.page <= 1}
                className={`flex size-8 items-center justify-center rounded-lg border border-glass-border ${params.page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-surface-light"}`}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </Link>
              <span className="font-mono">
                {params.page} / {pageCount}
              </span>
              <Link
                to={pageHref(params.page + 1)}
                aria-disabled={params.page >= pageCount}
                className={`flex size-8 items-center justify-center rounded-lg border border-glass-border ${params.page >= pageCount ? "pointer-events-none opacity-40" : "hover:bg-surface-light"}`}
                aria-label="Próxima página"
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {notice && (
        <div className="fixed right-6 bottom-24 z-[1200] max-w-sm animate-fadeIn md:bottom-6">
          <Alert tone="primary">{notice}</Alert>
        </div>
      )}
      <CreateUserModal
        key={String(creating)}
        isOpen={creating}
        onClose={() => setCreating(false)}
        onCreated={(message) => {
          setCreating(false);
          setNotice(`Usuário criado. ${message}`);
        }}
      />
      <UserDrawer user={selected} isSelf={selected?.id === currentUserId} onClose={() => openUser(null)} />
    </div>
  );
}
