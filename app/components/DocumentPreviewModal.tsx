import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Download, X, Search } from "lucide-react";
import "../styles/DocumentPreviewModal.css";

interface DocumentPreviewModalProps {
  previewDoc: { id: string; name: string; isSpreadsheet?: boolean } | null;
  setPreviewDoc: (doc: { id: string; name: string; isSpreadsheet?: boolean } | null) => void;
  theme?: "primary" | "success";
}

export function DocumentPreviewModal({ previewDoc, setPreviewDoc, theme = "primary" }: DocumentPreviewModalProps) {
  if (!previewDoc) return null;

  const isSuccess = theme === "success";
  
  // Asseguramos que o modal só tentará montar no client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [sheetData, setSheetData] = useState<{ headers: string[]; rows: any[][] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewDoc) return;

    setLoading(true);
    setError(null);
    setSheetData(null);
    setSearchQuery("");
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    if (previewDoc.isSpreadsheet) {
      fetch(`/api/document/${previewDoc.id}/sheet`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          const isJson = contentType && contentType.includes("application/json");
          const data = isJson ? await res.json() : null;

          if (!res.ok) {
            throw new Error(data?.error || "Erro ao carregar dados da planilha.");
          }
          return data;
        })
        .then((data) => {
          setSheetData({
            headers: data.headers || [],
            rows: data.rows || []
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Falha ao processar a planilha.");
          setLoading(false);
        });
    } else {
      fetch(`/api/document/${previewDoc.id}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Erro ao carregar o documento PDF.");
          }
          return res.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Falha ao processar o PDF.");
          setLoading(false);
        });
    }
  }, [previewDoc]);

  const filteredRows = sheetData?.rows
    ? sheetData.rows.filter(row => 
        row.some(cell => 
          String(cell ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  const isCurrencyColumn = (header: string) => {
    const normalized = header.toLowerCase();
    return normalized === "vl_pago" || normalized.includes("valor") || normalized.includes("pago");
  };

  const formatHeader = (header: string) => {
    return header.replace(/_/g, " ").toUpperCase();
  };

  const formatCell = (value: any, header: string) => {
    if (isCurrencyColumn(header)) {
      const num = typeof value === "number" ? value : parseFloat(String(value).replace(/\./g, "").replace(",", "."));
      if (!isNaN(num)) {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
      }
    }
    return String(value ?? "");
  };

  const modalContent = (
    <div onClick={() => setPreviewDoc(null)} className="modal-overlay">
      <div onClick={e => e.stopPropagation()} className="modal-content-glass">
        {/* Header do modal */}
        <div className="modal-header">
          <div className="modal-header-wrapper">
            <div className={`modal-icon-container ${isSuccess ? 'success' : 'primary'}`}>
              <FileText size={24} color={isSuccess ? "var(--success)" : "var(--primary)"} />
            </div>
            <div>
              <div className="modal-header-subtitle">
                {previewDoc.isSpreadsheet ? "VISUALIZAÇÃO DE PLANILHA" : "VISUALIZAÇÃO DE DOCUMENTO"}
              </div>
              <div className="modal-header-title">
                {previewDoc.name}
              </div>
            </div>
          </div>
          <div className="modal-actions-wrapper">
            <a 
              href={previewDoc.isSpreadsheet ? `/api/document/${previewDoc.id}?spreadsheet=true` : `/api/document/${previewDoc.id}?download=true`} 
              download 
              className={`btn-download-modal ${isSuccess ? 'success' : 'primary'}`}
            >
              <Download size={18} /> Baixar
            </a>
            <button 
              onClick={() => setPreviewDoc(null)} 
              className="btn-close-modal" 
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer inline */}
        <div className="modal-viewer">
          {loading ? (
            <div className="sheet-loading">
              <div className="spinner" />
              <span>{previewDoc.isSpreadsheet ? "Carregando dados da planilha..." : "Carregando documento PDF..."}</span>
            </div>
          ) : error ? (
            <div className="sheet-error">
              <span>{error}</span>
            </div>
          ) : previewDoc.isSpreadsheet ? (
            <div className="sheet-preview-container">
              <div className="sheet-search-bar">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Buscar em todas as colunas..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="sheet-stats">
                  <span>Total de itens: <strong>{sheetData?.rows.length || 0}</strong></span>
                  {filteredRows.length !== (sheetData?.rows.length || 0) && (
                    <span>Encontrados: <strong>{filteredRows.length}</strong></span>
                  )}
                </div>
              </div>

              <div className="sheet-table-wrapper">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      {sheetData?.headers.map((header, idx) => (
                        <th key={idx} className={isCurrencyColumn(header) ? "text-right" : ""}>
                          {formatHeader(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={sheetData?.headers.length || 1} className="sheet-empty-table">
                          {searchQuery ? "Nenhum registro encontrado para a busca." : "A planilha não possui dados."}
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {sheetData?.headers.map((header, colIdx) => {
                            const val = row[colIdx];
                            const isCurrency = isCurrencyColumn(header);
                            return (
                              <td 
                                key={colIdx} 
                                className={`${isCurrency ? "mono text-right font-bold" : ""} ${header === "nr_carta_frete" ? "mono" : ""}`}
                              >
                                {formatCell(val, header)}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : pdfUrl ? (
            <embed 
              src={pdfUrl} 
              type="application/pdf" 
              className="modal-pdf-embed"
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
