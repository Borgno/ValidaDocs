import { Link } from "react-router";
import { CheckSquare, FileText, ArrowRight, Shield } from "lucide-react";
import "../styles/home.css";

export function HomeView() {
  return (
    <div className="home-dashboard-container">
      {/* HEADER SECTION */}
      <div className="home-dashboard-header">
        <div className="home-header-title">
          <div className="home-icon-box">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="home-title">ValidaDocs</h1>
            <p className="home-subtitle">Central de Tratamento Automatizado de Documentos.</p>
          </div>
        </div>
      </div>

      {/* CORE AUTOMATIONS GRID */}
      <div className="home-stats-grid">
        {/* CARD 1: CONFERÊNCIA DE LOTES */}
        <div className="home-stat-box card-interactive">
          <div className="home-stat-header">CONFERÊNCIA DE LOTES</div>
          <div className="home-card-body">
            <div className="home-card-icon-wrapper blue-glow">
              <CheckSquare size={32} color="var(--primary)" />
            </div>
            <div className="home-card-info">
              <h3 className="home-card-title">Conferência de Lotes</h3>
              <p className="home-card-description">
                Cruze dados de arquivos PDF unificados com sua planilha para achar seu CTE correspondente.
              </p>
            </div>
          </div>

          <Link to="/conciliacao" className="home-cta-button primary-accent">
            ACESSAR PAINEL <ArrowRight size={16} />
          </Link>
        </div>

        {/* CARD 2: MAPEADOR DE CTE */}
        <div className="home-stat-box card-interactive">
          <div className="home-stat-header">MAPEADOR DE CTE</div>
          <div className="home-card-body">
            <div className="home-card-icon-wrapper blue-glow">
              <FileText size={32} color="var(--primary)" />
            </div>
            <div className="home-card-info">
              <h3 className="home-card-title">Mapeador de CTE</h3>
              <p className="home-card-description">
                Extraia o número do CTE dos comprovantes Sicredi e renomeie os arquivos PDF.
              </p>
            </div>
          </div>

          <Link to="/comprovantes-fat" className="home-cta-button primary-accent">
            ACESSAR PAINEL <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
