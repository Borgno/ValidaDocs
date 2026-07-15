import { Form, useActionData, useNavigation, useLoaderData, useRevalidator, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { FileText, FileSpreadsheet, Package, History, CheckCircle2, XCircle, Play, Loader2, ArrowRight, CheckSquare, Trash2, Download } from "lucide-react";
import { DocumentPreviewModal } from "../components/DocumentPreviewModal";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";

// Interface baseada no retorno do loader da rota
interface ConciliacaoViewProps {
  documents: any[];
  actionData?: { success?: boolean; error?: string; trackingId?: string };
}

export function ConciliacaoView({ documents, actionData }: ConciliacaoViewProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [pdfName, setPdfName] = useState<string>("Selecionar PDF Unificado");
  const [excelName, setExcelName] = useState<string>("Selecionar Planilha FAT");
  const [previewDoc, setPreviewDoc] = useState<{ id: string; name: string; isSpreadsheet?: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<"lotes" | "historico">("historico");
  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  const [deleteBatchTarget, setDeleteBatchTarget] = useState<string | null>(null);
  const [deleteFileTarget, setDeleteFileTarget] = useState<string | null>(null);

  const confirmDeleteBatch = () => {
    if (!deleteBatchTarget) return;
    fetcher.submit({ actionType: "deleteBatch", id: deleteBatchTarget }, { method: "post" });
    setDeleteBatchTarget(null);
  };

  const confirmDeleteFile = () => {
    if (!deleteFileTarget) return;
    fetcher.submit({ actionType: "deleteFile", id: deleteFileTarget }, { method: "post" });
    setDeleteFileTarget(null);
  };

  const childDocs = documents.filter((d: any) => d.originalName.startsWith("Página"));
  const batchDocs = documents.filter((d: any) => !d.originalName.startsWith("Página"));

  const isProcessing = batchDocs.some((d: any) => d.status === 'PROCESSING' || d.status === 'PENDING');
  
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
      
      {/* HEADER E UPLOADS */}
      <header className="shrink-0 flex items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <CheckSquare size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-medium uppercase tracking-wide text-text">Conferência de Lotes</h1>
            <p className="text-[13px] font-inter text-text-muted mt-1">Cruze informações do PDF para achar seu CTE na planilha.</p>
          </div>
        </div>
      </header>
        
      <div className="bg-card-bg border border-glass-border rounded-xl p-8 shadow-card flex flex-col mb-10">
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label htmlFor="pdf" className="group cursor-pointer flex flex-col items-center justify-center border border-dashed border-primary rounded-xl p-[32px] bg-primary/[0.02] transition-all duration-250 hover:bg-primary/[0.05] hover:border-primary min-h-[160px]">
              <div className="w-14 h-14 rounded-full bg-primary/[0.06] border border-primary/20 flex items-center justify-center text-primary mb-4 transition-all duration-250 group-hover:scale-105 group-hover:bg-primary/[0.12] group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]">
                <FileText size={48} strokeWidth={1.5} />
              </div>
              <div className="text-[13.6px] font-mono font-semibold text-text mb-1.5 text-center truncate w-full px-4">{pdfName}</div>
              <div className="text-[12px] font-sans text-text-muted text-center uppercase tracking-wide">ARRASTE O ARQUIVO OU CLIQUE PARA BUSCAR</div>
              <input type="file" id="pdf" name="pdf" accept="application/pdf" required className="hidden" onChange={(e) => setPdfName(e.target.files?.[0]?.name || "Selecionar PDF Unificado")} />
            </label>

            <label htmlFor="excel" className="group cursor-pointer flex flex-col items-center justify-center border border-dashed border-primary rounded-xl p-[32px] bg-primary/[0.02] transition-all duration-250 hover:bg-primary/[0.05] hover:border-primary min-h-[160px]">
              <div className="w-14 h-14 rounded-full bg-primary/[0.06] border border-primary/20 flex items-center justify-center text-primary mb-4 transition-all duration-250 group-hover:scale-105 group-hover:bg-primary/[0.12] group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]">
                <FileSpreadsheet size={48} strokeWidth={1.5} />
              </div>
              <div className="text-[13.6px] font-mono font-semibold text-text mb-1.5 text-center truncate w-full px-4">{excelName}</div>
              <div className="text-[12px] font-sans text-text-muted text-center uppercase tracking-wide">APENAS FORMATOS .XLS OU .XLSX</div>
              <input type="file" id="excel" name="excel" accept=".xlsx, .xls" required className="hidden" onChange={(e) => setExcelName(e.target.files?.[0]?.name || "Selecionar Planilha FAT")} />
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium uppercase tracking-wide text-[13px] px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            {isSubmitting ? "INICIANDO PROCESSAMENTO..." : "CRUZAR DADOS AGORA"}
          </button>
          
          {actionData?.success && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-inter bg-success/10 border border-success/20 text-success animate-fadeIn">
              <CheckCircle2 size={16} /> Processamento inciado com sucesso! Lote ID: {actionData.trackingId}
            </div>
          )}
          
          {actionData?.error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-inter bg-error/10 border border-error/20 text-error animate-fadeIn">
              <XCircle size={16} /> {actionData.error}
            </div>
          )}
        </Form>
      </div>

      {/* TABS DE VISUALIZAÇÃO */}
      <div className="flex justify-center border-b border-glass-border mb-8">
        <button 
          onClick={() => setActiveTab("historico")}
          className={`relative flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "historico" ? "text-text" : "text-text-muted hover:text-text"}`}
        >
          ARQUIVOS
          {activeTab === "historico" && <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full bg-primary" />}
        </button>
        <button 
          onClick={() => setActiveTab("lotes")}
          className={`relative flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "lotes" ? "text-text" : "text-text-muted hover:text-text"}`}
        >
          LOTES
          {activeTab === "lotes" && <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full bg-primary" />}
        </button>
      </div>

      {/* CONTEÚDO DA TAB: LOTES */}
      {activeTab === "lotes" && (
        batchDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-text-dim mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-text mb-2">Nenhum lote enviado</h3>
            <p className="text-sm font-inter text-text-muted">Faça o upload do PDF e da Planilha acima para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
            {batchDocs.map((doc: any) => {
              const isCompleted = doc.status === 'COMPLETED';
              const isProcessing = doc.status === 'PROCESSING';
              
              let statusClasses = "bg-badge-error-bg text-badge-error-text border-error/20";
              let statusText = 'FALHA';
              
              if (isCompleted) {
                statusClasses = "bg-badge-primary-bg text-badge-primary-text border-primary/20";
                statusText = 'CONCLUÍDO';
              } else if (isProcessing) {
                statusClasses = "bg-badge-warning-bg text-badge-warning-text border-warning/20";
                statusText = 'PROCESSANDO';
              }

              const excelName = (doc.extractedData as any)?.excelName || "Planilha FAT";
              
              return (
              <div key={doc.id} className="bg-surface border border-glass-border rounded-xl p-5 flex flex-col transition-all hover:bg-surface-light hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusClasses}`}>
                      {statusText}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {new Date(doc.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-md bg-transparent text-text-dim flex items-center justify-center transition-colors hover:bg-error/10 hover:text-error"
                    onClick={() => setDeleteBatchTarget(doc.id)}
                    title="Excluir lote"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 bg-card-bg border border-glass-border rounded-lg p-2">
                  <button 
                    type="button"
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-light transition-colors text-left"
                    onClick={() => setPreviewDoc({ id: doc.id, name: doc.originalName })}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-medium text-text truncate">{doc.originalName}</span>
                  </button>

                  <div className="h-px bg-glass-border mx-2" />

                  <button 
                    type="button"
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-light transition-colors text-left"
                    onClick={() => setPreviewDoc({ id: doc.id, name: excelName, isSpreadsheet: true })}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <FileSpreadsheet size={16} />
                    </div>
                    <span className="text-sm font-medium text-text truncate">{excelName}</span>
                  </button>
                </div>
              </div>
            )})}
          </div>
        )
      )}

      {/* CONTEÚDO DA TAB: ARQUIVOS */}
      {activeTab === "historico" && (() => {
        // Agrupa os documentos filhos pelo ID do Lote
        const childDocsByBatch = childDocs.reduce((acc: Record<string, any[]>, doc: any) => {
          const match = doc.originalStorageKey?.match(/batch-([a-f0-9-]+)/);
          const batchId = match ? match[1] : "avulso";
          if (!acc[batchId]) {
            acc[batchId] = [];
          }
          acc[batchId].push(doc);
          return acc;
        }, {});

        // Ordena para que os lotes mais recentes fiquem no topo
        const sortedBatchIds = Object.keys(childDocsByBatch).sort((a, b) => {
          const parentA = batchDocs.find((x) => x.id === a);
          const parentB = batchDocs.find((x) => x.id === b);
          if (!parentA) return 1;
          if (!parentB) return -1;
          return new Date(parentB.createdAt).getTime() - new Date(parentA.createdAt).getTime();
        });

        return childDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <History size={48} className="text-text-dim mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-text mb-2">Nenhum resultado individual</h3>
            <p className="text-sm font-inter text-text-muted">Os documentos processados aparecerão aqui individualmente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-12">
            {sortedBatchIds.map((batchId) => {
              const docs = childDocsByBatch[batchId];
              const parentDoc = batchDocs.find((b: any) => b.id === batchId);
              const excelName = parentDoc ? ((parentDoc.extractedData as any)?.excelName || "Planilha FAT") : "";
              const batchTitle = parentDoc 
                ? `${parentDoc.originalName} e ${excelName}`
                : "Arquivos Avulsos";
              
              return (
                <div key={batchId} className="flex flex-col gap-4 bg-surface/50 border border-glass-border rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-[13px] text-text-muted">
                        <Package size={16} className="text-primary" />
                        Lote: {batchTitle}
                        {parentDoc && (
                          <span className="ml-2 font-mono">
                            {new Date(parentDoc.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {new Date(parentDoc.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                    {parentDoc && (
                      <a 
                        href={`/api/batch-download/${batchId}`} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg transition-colors hover:bg-primary/20"
                        title="Baixar lote compactado"
                      >
                        <Download size={14} />
                        BAIXAR
                      </a>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {docs.map((doc: any) => {
                      const docName = doc.processedName || doc.originalName;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setPreviewDoc({ id: doc.id, name: docName })}
                          className="group relative bg-card-bg border border-glass-border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ease-ui hover:shadow-card hover:-translate-y-1 cursor-pointer"
                        >
                          <button
                            type="button"
                            className="absolute top-3 right-3 w-7 h-7 rounded-md bg-transparent text-text-dim flex items-center justify-center transition-colors hover:bg-error/10 hover:text-error opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteFileTarget(doc.id);
                            }}
                            title="Excluir arquivo"
                          >
                            <Trash2 size={14} />
                          </button>

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
              );
            })}
          </div>
        );
      })()}

      <DocumentPreviewModal previewDoc={previewDoc} setPreviewDoc={setPreviewDoc} theme="primary" />

      <ConfirmDeleteDialog
        isOpen={deleteBatchTarget !== null}
        title="Excluir Lote Completo"
        description="Todos os arquivos desmembrados deste lote serão excluídos permanentemente do armazenamento. Esta ação não pode ser desfeita."
        onConfirm={confirmDeleteBatch}
        onCancel={() => setDeleteBatchTarget(null)}
      />

      <ConfirmDeleteDialog
        isOpen={deleteFileTarget !== null}
        title="Excluir Arquivo"
        description="Este arquivo será removido permanentemente do armazenamento. Se for o último do seu lote, o lote será excluído automaticamente."
        onConfirm={confirmDeleteFile}
        onCancel={() => setDeleteFileTarget(null)}
      />
    </div>
  );
}
