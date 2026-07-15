import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Download, X, Search, Loader2 } from "lucide-react";

interface DocumentPreviewModalProps {
  previewDoc: { id: string; name: string; isSpreadsheet?: boolean } | null;
  setPreviewDoc: (doc: { id: string; name: string; isSpreadsheet?: boolean } | null) => void;
  theme?: "primary" | "success";
}

export function DocumentPreviewModal({ previewDoc, setPreviewDoc, theme = "primary" }: DocumentPreviewModalProps) {
  if (!previewDoc) return null;

  const isSuccess = theme === "success";
  
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
    <div onClick={() => setPreviewDoc(null)} className="fixed inset-0 bg-black/40 dark:bg-black/55 backdrop-blur-md flex items-center justify-center p-5 z-[1000] animate-fadeIn">
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[1300px] h-[calc(100vh-40px)] flex flex-col bg-bg border border-glass-border rounded-2xl shadow-modal animate-modalIn relative overflow-hidden">
        
        {/* Header do modal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-5 py-3 bg-surface border-b border-glass-border">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${isSuccess ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
              <FileText size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {previewDoc.isSpreadsheet ? "VISUALIZAÇÃO DE PLANILHA" : "VISUALIZAÇÃO DE DOCUMENTO"}
              </span>
              <h2 className="text-[15px] font-semibold text-text truncate max-w-[300px] md:max-w-[500px]" title={previewDoc.name}>
                {previewDoc.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={previewDoc.isSpreadsheet ? `/api/document/${previewDoc.id}?spreadsheet=true` : `/api/document/${previewDoc.id}?download=true`} 
              download={previewDoc.name}
              className={`inline-flex items-center justify-center gap-2 border bg-transparent font-bold uppercase tracking-wide text-xs px-4 py-2 rounded-md transition-all duration-200 ease-ui hover:text-white ${isSuccess ? 'border-success text-success hover:bg-success' : 'border-primary text-primary hover:bg-primary'}`}
            >
              <Download size={16} /> BAIXAR
            </a>
            <button 
              onClick={() => setPreviewDoc(null)} 
              className="p-1.5 shrink-0 rounded-md bg-transparent text-text-muted flex items-center justify-center transition-all duration-200 hover:bg-error/10 hover:text-error" 
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer inline */}
        <div className="flex-1 min-h-0 bg-bg relative flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="text-sm font-inter">
                {previewDoc.isSpreadsheet ? "Carregando dados da planilha..." : "Carregando documento PDF..."}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm font-inter">
                {error}
              </div>
            </div>
          ) : previewDoc.isSpreadsheet ? (
            <div className="flex flex-col h-full">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-glass-border gap-4 shrink-0 bg-card-bg">
                <div className="relative flex items-center w-full sm:w-72">
                  <Search size={16} className="absolute left-4 text-text-muted peer-focus:text-primary" />
                  <input 
                    type="text" 
                    placeholder="Buscar em todas as colunas..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full bg-surface border border-glass-border rounded-lg pl-11 pr-4 text-sm text-text placeholder:text-text-dim placeholder:font-normal focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all peer"
                  />
                </div>
                <div className="flex gap-4 text-sm font-inter text-text-muted">
                  <span>Total: <strong className="text-text font-mono">{sheetData?.rows.length || 0}</strong></span>
                  {filteredRows.length !== (sheetData?.rows.length || 0) && (
                    <span>Encontrados: <strong className="text-text font-mono">{filteredRows.length}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-card-bg">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-light border-b border-glass-border z-10 backdrop-blur-md">
                    <tr>
                      {sheetData?.headers.map((header, idx) => (
                        <th key={idx} className={`py-3 px-4 text-xs font-bold text-text-dim uppercase tracking-widest whitespace-nowrap ${isCurrencyColumn(header) ? "text-right" : ""}`}>
                          {formatHeader(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-inter">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={sheetData?.headers.length || 1} className="py-12 text-center text-text-muted text-sm border-b border-glass-border">
                          {searchQuery ? "Nenhum registro encontrado para a busca." : "A planilha não possui dados."}
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-glass-border hover:bg-surface-light/50 transition-colors">
                          {sheetData?.headers.map((header, colIdx) => {
                            const val = row[colIdx];
                            const isCurrency = isCurrencyColumn(header);
                            const isMono = header === "nr_carta_frete" || isCurrency;
                            return (
                              <td 
                                key={colIdx} 
                                className={`py-3 px-4 text-sm text-text whitespace-nowrap ${isMono ? "font-mono font-medium" : ""} ${isCurrency ? "text-right" : ""}`}
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
              className="w-full h-full rounded-b-xl"
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
