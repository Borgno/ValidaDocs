import { Link } from "react-router";
import { CheckSquare, FileText, ArrowRight, Shield } from "lucide-react";

export function HomeView() {
  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto">
      {/* HEADER SECTION */}
      <header className="shrink-0 flex items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Shield size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-medium uppercase tracking-wide text-text">ValidaDocs</h1>
            <p className="text-[13px] font-inter text-text-muted mt-1">Central de Tratamento Automatizado de Documentos.</p>
          </div>
        </div>
      </header>

      {/* CORE AUTOMATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: CONFERÊNCIA DE LOTES */}
        <div className="bg-card-bg border border-glass-border rounded-xl p-6 shadow-sm flex flex-col transition-all hover:border-border-focus hover:shadow-md h-[240px]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              CONFERÊNCIA DE LOTES
            </h2>
          </div>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 shrink-0 bg-primary/10 border border-glass-border rounded-xl flex items-center justify-center shadow-primary-glow border-primary/30">
              <CheckSquare size={28} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-text">Conferência de Lotes</h3>
              <p className="text-[13px] font-inter text-text-muted leading-relaxed">
                Cruze dados de arquivos PDF unificados com sua planilha para achar seu CTE correspondente.
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <Link to="/conciliacao" className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium uppercase tracking-wide text-[13px] px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white">
              ACESSAR PAINEL <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* CARD 2: MAPEADOR DE CTE */}
        <div className="bg-card-bg border border-glass-border rounded-xl p-6 shadow-sm flex flex-col transition-all hover:border-border-focus hover:shadow-md h-[240px]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
            <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              MAPEADOR DE CTE
            </h2>
          </div>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 shrink-0 bg-primary/10 border border-glass-border rounded-xl flex items-center justify-center shadow-primary-glow border-primary/30">
              <FileText size={28} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-text">Mapeador de CTE</h3>
              <p className="text-[13px] font-inter text-text-muted leading-relaxed">
                Extraia o número do CTE dos comprovantes Sicredi e renomeie os arquivos PDF.
              </p>
            </div>
          </div>

          <div className="mt-auto">
            <Link to="/comprovantes-fat" className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium uppercase tracking-wide text-[13px] px-6 py-3 rounded-lg transition-all duration-200 hover:bg-primary hover:text-white">
              ACESSAR PAINEL <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
