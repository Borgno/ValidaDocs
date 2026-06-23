import { Form, useNavigation, useRevalidator, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { FileText, Eye, Loader2, Play, CheckCircle2, XCircle, FilePlus2, History, ArrowRight, Trash2 } from "lucide-react";
import { DocumentPreviewModal } from "../components/DocumentPreviewModal";
import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog";
import "../styles/comprovantes-fat.css";

interface ComprovantesFatViewProps {
  documents: any[];
  actionData?: { success?: boolean; error?: string; trackingId?: string };
}

export function ComprovantesFatView({ documents, actionData }: ComprovantesFatViewProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [pdfName, setPdfName] = useState<string>("Selecionar Comprovante PDF");
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
    <div className="comprovantes-container">

      <div className="comprovantes-header">
        <div className="comprovantes-header-title">
          <div className="comprovantes-icon-box">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="comprovantes-title">Mapeador de CTE</h2>
            <p className="comprovantes-subtitle">Extraia o CTE e padronize os arquivos Sicredi.</p>
          </div>
        </div>
      </div>

      <div className="card upload-card-fat">


        <Form method="post" encType="multipart/form-data" className="upload-form">

          <div className="upload-zone-fat-wrapper">
            <label htmlFor="pdf" className="upload-zone-fat">
              <div className="upload-icon-circle-fat">
                <FilePlus2 size={56} color="var(--primary)" strokeWidth={1.5} />
              </div>
              <div className="upload-text-center">
                <div className="upload-text-name-fat">{pdfName}</div>
                <div className="upload-text-desc-fat">Arraste o comprovante PDF ou clique para buscar</div>
              </div>
              <input type="file" id="pdf" name="pdf" accept="application/pdf" required className="hidden-input" style={{ display: 'none' }} onChange={(e) => setPdfName(e.target.files?.[0]?.name || "Selecionar Comprovante PDF")} />
            </label>
          </div>

          <button type="submit" className="btn-processar-fat" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : <Play size={22} />}
            {isSubmitting ? "PROCESSANDO I/O..." : "RENOMEAR COMPROVANTE"}
          </button>

          {actionData?.success && (
            <div className="alert-success-fat">
              <CheckCircle2 size={20} /> Processamento inciado com sucesso! Job ID: {actionData.trackingId}
            </div>
          )}

          {actionData?.error && (
            <div className="alert-error-fat">
              <XCircle size={20} /> {actionData.error}
            </div>
          )}
        </Form>
      </div>

      <div className="tabs-wrapper">
        <button className="tab-button-fat">
          <History size={20} color="var(--primary)" />
          Histórico de Comprovantes
          <div className="tab-indicator-fat" />
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state-box">
          <History size={64} color="var(--text-dim)" strokeWidth={1} className="empty-state-icon" />
          <h3 className="empty-state-title">Nenhum comprovante processado</h3>
          <p className="empty-state-desc">Faça o upload do PDF acima para padronizar.</p>
        </div>
      ) : (
        <div className="grid-historico">
          {documents.map((doc: any) => {
            const isProcessing = doc.status === 'PROCESSING' || doc.status === 'PENDING';
            const docName = doc.processedName || doc.originalName;

            return (
              <div
                key={doc.id}
                onClick={() => { if (!isProcessing) setPreviewDoc({ id: doc.id, name: docName }) }}
                className="historico-card"
                style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
              >
                {isProcessing ? (
                  <div className="historico-icon-status">
                    <Loader2 size={16} color="var(--primary)" className="animate-spin" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-delete-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(doc.id);
                    }}
                    title="Excluir arquivo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="historico-file-icon">
                  <FileText size={32} color="var(--primary)" strokeWidth={1.2} />
                </div>

                <span className="historico-doc-name">
                  {docName}
                </span>
              </div>
            );
          })}
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
