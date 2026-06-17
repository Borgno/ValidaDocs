import { Form, useNavigation, useRevalidator } from "react-router";
import { useState, useEffect } from "react";
import { FileText, Eye, Loader2, Play, CheckCircle2, XCircle, FilePlus2, History, ArrowRight } from "lucide-react";
import { DocumentPreviewModal } from "../components/DocumentPreviewModal";
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
  const revalidator = useRevalidator();

  const isProcessing = documents.some((d: any) => d.status === 'PROCESSING');
  
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
            <h2 className="comprovantes-title">Renomear Comprovantes</h2>
            <p className="comprovantes-subtitle">Extraia o código AD e padronize os arquivos Sicredi FAT.</p>
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
              <input type="file" id="pdf" name="pdf" accept="application/pdf" required className="hidden-input" onChange={(e) => setPdfName(e.target.files?.[0]?.name || "Selecionar Comprovante PDF")} />
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
            const isProcessing = doc.status === 'PROCESSING';
            const docName = doc.processedName || doc.originalName;
            
            return (
              <button
                key={doc.id}
                onClick={() => { if (!isProcessing) setPreviewDoc({ id: doc.id, name: docName }) }}
                disabled={isProcessing}
                className="historico-card"
              >
                {isProcessing && (
                  <div className="historico-icon-status">
                    <Loader2 size={16} color="var(--primary)" className="animate-spin" />
                  </div>
                )}

                <div className="historico-file-icon">
                  <FileText size={48} color="var(--primary)" strokeWidth={1} />
                </div>

                <span className="historico-doc-name">
                  {docName}
                </span>
                
                <div className="historico-action-text">
                  {isProcessing ? 'PROCESSANDO...' : <><Eye size={14} className="historico-action-icon" /> VISUALIZAR <ArrowRight size={14} /></>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <DocumentPreviewModal previewDoc={previewDoc} setPreviewDoc={setPreviewDoc} theme="primary" />
    </div>
  );
}
