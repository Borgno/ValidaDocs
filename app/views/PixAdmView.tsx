import { Form, useNavigation, useRevalidator, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { FileText, Eye, Loader2, Play, CheckCircle2, XCircle, FilePlus2, History, ArrowRight, Trash2, Download } from "lucide-react";
import { DocumentPreviewModal } from "../components/DocumentPreviewModal";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";

interface PixAdmViewProps {
  documents: any[];
  actionData?: { success?: boolean; error?: string; trackingId?: string };
}

export function PixAdmView({ documents, actionData }: PixAdmViewProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [pdfName, setPdfName] = useState<string>("Selecionar Comprovante Pix ADM");
  const [previewDoc, setPreviewDoc] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const revalidator = useRevalidator();
  const fetcher = useFetcher();

  const confirmDelete = () => {
    if (!deleteTarget) return;
    fetcher.submit({ actionType: "delete", id: deleteTarget }, { method: "post" });
    setDeleteTarget(null);
  };

  const isProcessing = documents.some((d: any) => d.status === 'PROCESSING' || d.status === 'PENDING');

  useEffect(() => {
    if (isProcessing) {
      const intervalId = setInterval(() => {
        if (revalidator.state === "idle") {
          revalidator.revalidate();
        }
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isProcessing, revalidator]);

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto">

      {/* HEADER */}
      <header className="shrink-0 flex items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-medium uppercase tracking-wide text-text">Pix ADM</h1>
            <p className="text-[13px] font-inter text-text-muted mt-1">Gerencie os comprovantes de Pix do ADM e padronize os arquivos.</p>
          </div>
        </div>
      </header>

      {/* UPLOAD CARD */}
      <div className="bg-card-bg border border-glass-border rounded-xl p-8 shadow-card flex flex-col mb-10">
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-6">
          <label htmlFor="pdf" className="group cursor-pointer flex flex-col items-center justify-center border border-dashed border-primary rounded-xl p-[32px] bg-primary/[0.02] transition-all duration-250 hover:bg-primary/[0.05] hover:border-primary min-h-[160px]">
            <div className="w-14 h-14 rounded-full bg-primary/[0.06] border border-primary/20 flex items-center justify-center text-primary mb-4 transition-all duration-250 group-hover:scale-105 group-hover:bg-primary/[0.12] group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]">
              <FilePlus2 size={48} strokeWidth={1.5} />
            </div>
            <div className="text-[13.6px] font-mono font-semibold text-text mb-1.5 text-center truncate w-full px-4">{pdfName}</div>
            <div className="text-[12px] font-sans text-text-muted text-center uppercase tracking-wide">ARRASTE O COMPROVANTE PIX ADM OU CLIQUE PARA BUSCAR</div>
            <input 
              type="file" 
              id="pdf" 
              name="pdf" 
              accept="application/pdf" 
              required 
              className="hidden" 
              onChange={(e) => setPdfName(e.target.files?.[0]?.name || "Selecionar Comprovante Pix ADM")} 
            />
          </label>

          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium uppercase tracking-wide text-[13px] px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            {isSubmitting ? "PROCESSANDO I/O..." : "RENOMEAR COMPROVANTE"}
          </button>

          {actionData?.success && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-inter bg-success/10 border border-success/20 text-success animate-fadeIn">
              <CheckCircle2 size={16} /> Processamento iniciado com sucesso! Job ID: {actionData.trackingId}
            </div>
          )}

          {actionData?.error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-inter bg-error/10 border border-error/20 text-error animate-fadeIn">
              <XCircle size={16} /> {actionData.error}
            </div>
          )}
        </Form>
      </div>

      {/* TABS */}
      <div className="flex justify-center border-b border-glass-border mb-8">
        <button className="relative flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-text">
          <History size={16} />
          HISTÓRICO DE COMPROVANTES PIX
          <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full bg-primary" />
        </button>
      </div>

      {/* LISTA DE ARQUIVOS */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History size={48} className="text-text-dim mb-4" strokeWidth={1.5} />
          <h3 className="text-xl font-bold text-text mb-2">Nenhum comprovante processado</h3>
          <p className="text-sm font-inter text-text-muted">Faça o upload do PDF acima para padronizar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 pb-12">
          {Object.entries(
            documents.reduce((acc, doc) => {
              let dateGroup = "Processando / Outros";
              
              if (doc.status === 'COMPLETED' && doc.processedName) {
                const dateMatch = doc.processedName.match(/^(\d{2}-\d{2}-\d{4})/);
                if (dateMatch) {
                  dateGroup = dateMatch[1].replace(/-/g, "/"); // Volta para o formato legível PT-BR (16/07/2026)
                }
              }
              
              if (!acc[dateGroup]) acc[dateGroup] = [];
              acc[dateGroup].push(doc);
              return acc;
            }, {} as Record<string, any[]>)
          ).sort(([dateA], [dateB]) => {
            // Se for 'Processando / Outros', joga pro começo
            if (dateA === "Processando / Outros") return -1;
            if (dateB === "Processando / Outros") return 1;
            
            // Tenta ordenar do mais recente para o mais antigo considerando DD/MM/YYYY
            const [d1, m1, y1] = dateA.split('/');
            const [d2, m2, y2] = dateB.split('/');
            const timeA = new Date(`${y1}-${m1}-${d1}`).getTime();
            const timeB = new Date(`${y2}-${m2}-${d2}`).getTime();
            return timeB - timeA;
          }).map(([dateGroup, docsGroup]: [string, any]) => (
            <div key={dateGroup} className="flex flex-col gap-4 bg-surface/50 border border-glass-border rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-[13px] text-text-muted">
                    <History size={16} className="text-primary" />
                    <span className="font-medium text-text uppercase tracking-widest">
                      {dateGroup}
                    </span>
                  </div>
                </div>
                {dateGroup !== "Processando / Outros" && (
                  <a 
                    href={`/api/pix-download/${dateGroup.replace(/\//g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg transition-colors hover:bg-primary/20"
                    title="Baixar todos os comprovantes deste dia"
                  >
                    <Download size={14} />
                    BAIXAR
                  </a>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {docsGroup.map((doc: any) => {
                  const isProcessing = doc.status === 'PROCESSING' || doc.status === 'PENDING';
                  const docName = doc.processedName || doc.originalName;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => { if (!isProcessing) setPreviewDoc({ id: doc.id, name: docName }) }}
                      className="group relative bg-card-bg border border-glass-border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ease-ui hover:shadow-card hover:-translate-y-1 cursor-pointer"
                      style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
                    >
                      {isProcessing ? (
                        <div className="absolute top-3 right-3">
                          <Loader2 size={16} className="text-primary animate-spin" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="absolute top-3 right-3 w-7 h-7 rounded-md bg-transparent text-text-dim flex items-center justify-center transition-colors hover:bg-error/10 hover:text-error opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(doc.id);
                          }}
                          title="Excluir arquivo"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-105">
                        <FileText size={20} strokeWidth={2} />
                      </div>

                      <span className="text-sm font-bold text-text line-clamp-2 w-full break-all" title={docName}>
                        {docName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentPreviewModal previewDoc={previewDoc} setPreviewDoc={setPreviewDoc} theme="primary" />

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        title="Excluir Comprovante"
        description="Esta ação é irreversível. O arquivo será removido permanentemente do armazenamento e do sistema."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
