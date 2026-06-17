import { Form, useActionData, useNavigation, useLoaderData, useRevalidator } from "react-router";
import { useState, useEffect } from "react";
import { FileText, FileSpreadsheet, Package, History, CheckCircle2, XCircle, Play, Loader2, ArrowRight, CheckSquare } from "lucide-react";
import { DocumentPreviewModal } from "../components/DocumentPreviewModal";
import "../styles/conciliacao.css";

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

  const childDocs = documents.filter((d: any) => d.originalName.startsWith("Página"));
  const batchDocs = documents.filter((d: any) => !d.originalName.startsWith("Página"));

  const isProcessing = batchDocs.some((d: any) => d.status === 'PROCESSING');
  
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
    <div className="conciliacao-container">
      
      {/* HEADER E UPLOADS */}
      <div className="conciliacao-header">
        <div className="conciliacao-header-title">
          <div className="conciliacao-icon-box">
            <CheckSquare size={24} />
          </div>
          <div>
            <h2 className="conciliacao-title">Conciliação Inteligente</h2>
            <p className="conciliacao-subtitle">Cruze informações do CTE com a planilha FAT.</p>
          </div>
        </div>
        
        <div className="card upload-card">


          <Form method="post" encType="multipart/form-data" className="upload-form">
            
            <div className="upload-grid">
              
              <label htmlFor="pdf" className="upload-label upload-label-primary">
                <div className="upload-icon-circle-primary">
                  <FileText size={48} color="var(--primary)" strokeWidth={1.5} />
                </div>
                <div className="upload-text-center">
                  <div className="upload-text-name">{pdfName}</div>
                  <div className="upload-text-desc">Arraste o arquivo ou clique para buscar</div>
                </div>
                <input type="file" id="pdf" name="pdf" accept="application/pdf" required className="hidden-input" style={{display: 'none'}} onChange={(e) => setPdfName(e.target.files?.[0]?.name || "Selecionar PDF Unificado")} />
              </label>

              <label htmlFor="excel" className="upload-label upload-label-primary">
                <div className="upload-icon-circle-primary">
                  <FileSpreadsheet size={48} color="var(--primary)" strokeWidth={1.5} />
                </div>
                <div className="upload-text-center">
                  <div className="upload-text-name">{excelName}</div>
                  <div className="upload-text-desc">Apenas formatos .xls ou .xlsx</div>
                </div>
                <input type="file" id="excel" name="excel" accept=".xlsx, .xls" required className="hidden-input" style={{display: 'none'}} onChange={(e) => setExcelName(e.target.files?.[0]?.name || "Selecionar Planilha FAT")} />
              </label>

            </div>

            <button type="submit" className="btn-cruzar-dados" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : <Play size={22} />}
              {isSubmitting ? "INICIANDO PROCESSAMENTO..." : "CRUZAR DADOS AGORA"}
            </button>
            
            {actionData?.success && (
              <div className="alert-success">
                <CheckCircle2 size={20} /> Processamento inciado com sucesso! Lote ID: {actionData.trackingId}
              </div>
            )}
            
            {actionData?.error && (
              <div className="alert-error">
                <XCircle size={20} /> {actionData.error}
              </div>
            )}
          </Form>
        </div>
      </div>

      {/* TABS DE VISUALIZAÇÃO */}
      <div className="tabs-wrapper">
        <button 
          onClick={() => setActiveTab("historico")}
          className={`tab-button ${activeTab === "historico" ? "active" : "inactive"}`}
        >
          Arquivos
          {activeTab === "historico" && <div className="tab-indicator" />}
        </button>
        <button 
          onClick={() => setActiveTab("lotes")}
          className={`tab-button ${activeTab === "lotes" ? "active" : "inactive"}`}
        >
          Lotes
          {activeTab === "lotes" && <div className="tab-indicator" />}
        </button>
      </div>

      {/* CONTEÚDO DA TAB: LOTES */}
      {activeTab === "lotes" && (
        batchDocs.length === 0 ? (
          <div className="empty-state-box">
            <Package size={64} color="var(--text-dim)" strokeWidth={1} className="empty-state-icon" />
            <h3 className="empty-state-title">Nenhum lote enviado</h3>
            <p className="empty-state-desc">Faça o upload do PDF e da Planilha acima para começar.</p>
          </div>
        ) : (
          <div className="grid-lotes">
            {batchDocs.map((doc: any) => {
              const statusClass = doc.status === 'COMPLETED' ? 'completed' : doc.status === 'PROCESSING' ? 'processing' : 'failed';
              const statusText = doc.status === 'COMPLETED' ? 'CONCLUÍDO' : doc.status === 'PROCESSING' ? 'PROCESSANDO' : 'FALHA';
              const excelName = (doc.extractedData as any)?.excelName || "Planilha FAT";
              
              return (
              <div key={doc.id} className="card lote-card">
                <div className="lote-header">
                  <span className={`badge ${statusClass}`}>
                    {statusText}
                  </span>
                  <span className="lote-date">
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {new Date(doc.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="lote-files-box">
                  <button 
                    type="button"
                    className="file-row-interactive"
                    onClick={() => setPreviewDoc({ id: doc.id, name: doc.originalName })}
                  >
                    <div className="file-icon-box primary">
                      <FileText size={24} color="var(--primary)" />
                    </div>
                    <span className="file-name">{doc.originalName}</span>
                  </button>

                  <div className="vertical-separator" />

                  <button 
                    type="button"
                    className="file-row-interactive"
                    onClick={() => setPreviewDoc({ id: doc.id, name: excelName, isSpreadsheet: true })}
                  >
                    <div className="file-icon-box primary">
                      <FileSpreadsheet size={24} color="var(--primary)" />
                    </div>
                    <span className="file-name">{excelName}</span>
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
          const match = doc.originalStorageKey?.match(/batch-([a-f0-9-]+)-page/);
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
          <div className="empty-state-box">
            <History size={64} color="var(--text-dim)" strokeWidth={1} className="empty-state-icon" />
            <h3 className="empty-state-title">Nenhum resultado individual</h3>
            <p className="empty-state-desc">Os documentos processados aparecerão aqui individualmente.</p>
          </div>
        ) : (
          <div className="batch-groups-container">
            {sortedBatchIds.map((batchId) => {
              const docs = childDocsByBatch[batchId];
              const parentDoc = batchDocs.find((b: any) => b.id === batchId);
              const excelName = parentDoc ? ((parentDoc.extractedData as any)?.excelName || "Planilha FAT") : "";
              const batchTitle = parentDoc 
                ? `${parentDoc.originalName} e ${excelName}`
                : "Arquivos Avulsos";
              
              return (
                <div key={batchId} className="batch-group">
                  <div className="batch-group-header">
                    <Package size={16} color="var(--primary)" />
                    <span>Lote: {batchTitle}</span>
                    {parentDoc && (
                      <span className="batch-group-date">
                        {new Date(parentDoc.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {new Date(parentDoc.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid-historico">
                    {docs.map((doc: any) => {
                      const docName = doc.processedName || doc.originalName;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setPreviewDoc({ id: doc.id, name: docName })}
                          className="historico-card"
                        >
                          <div className="historico-file-icon">
                            <FileText size={32} color="var(--primary)" strokeWidth={1.2} />
                          </div>

                          <span className="historico-doc-name">
                            {docName}
                          </span>
                        </button>
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
    </div>
  );
}
