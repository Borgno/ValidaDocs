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
            <p className="home-subtitle">Central de Conciliação e Tratamento Automatizado de Documentos.</p>
          </div>
        </div>
      </div>

      {/* CORE AUTOMATIONS GRID */}
      <div className="home-stats-grid">
        {/* CARD 1: CONCILIÇÃO INTELIGENTE */}
        <div className="home-stat-box card-interactive">
          <div className="home-stat-header">CONCILIÇÃO DE FRETE</div>
          <div className="home-card-body">
            <div className="home-card-icon-wrapper blue-glow">
              <CheckSquare size={32} color="var(--primary)" />
            </div>
            <div className="home-card-info">
              <h3 className="home-card-title">Conciliação Inteligente</h3>
              <p className="home-card-description">
                Cruze dados de arquivos PDF unificados de CTEs com planilhas financeiras FAT para auditar inconsistências.
              </p>
            </div>
          </div>

          <Link to="/conciliacao" className="home-cta-button primary-accent">
            ACESSAR PAINEL <ArrowRight size={16} />
          </Link>
        </div>

        {/* CARD 2: RENOMEAÇÃO DE COMPROVANTES */}
        <div className="home-stat-box card-interactive">
          <div className="home-stat-header">COMPROVANTES FINANCEIROS</div>
          <div className="home-card-body">
            <div className="home-card-icon-wrapper blue-glow">
              <FileText size={32} color="var(--primary)" />
            </div>
            <div className="home-card-info">
              <h3 className="home-card-title">Renomear Comprovantes</h3>
              <p className="home-card-description">
                Extraia o código AD de comprovantes Sicredi e normalize os nomes dos arquivos PDF de forma padronizada.
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
