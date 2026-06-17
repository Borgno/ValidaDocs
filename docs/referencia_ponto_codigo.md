# Código Fonte Referência: Ponto (Styles e Views)

Este documento contém todo o código CSS e TSX (HTML/Views) do projeto Ponto, para servir como referência de como a estilização e estrutura devem ser feitas.

## 1. Global Styles (app.css)
```css
/* Google Fonts carregada via <link> no root.tsx */

:root {
  --primary: #0066ff;
  --primary-glow: rgba(0, 102, 255, 0.12);
  --secondary: #0044cc;
  --bg: #090b0e;
  --card-bg: #0f1217;
  --text: #f3f5f8;
  --text-muted: #8e99a7;
  --text-dim: #556070;
  --success: #00d084;
  --error: #ff4a5a;
  --warning: #ffb700;
  --glass-border: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(0, 102, 255, 0.4);
  --accent-gradient: var(--primary);
  --surface: rgba(255, 255, 255, 0.03);
  --surface-light: rgba(255, 255, 255, 0.06);

  /* 8pt Grid System */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
}

html,
body {
  height: 100vh;
  width: 100vw;
}

body {
  background-color: var(--bg);
  color: var(--text);
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.5;
}

h1,
h2,
h3 {
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* True Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 72px;
  background: var(--bg);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: var(--space-5) 0 var(--space-4) 0;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar.expanded {
  width: 240px;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--glass-border);
  padding-top: var(--space-3);
}

.sidebar-toggle {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  margin: 0 auto var(--space-3) auto;
  transition: all 0.2s ease;
}

.sidebar.expanded .sidebar-toggle {
  margin-left: 14px;
  justify-content: flex-start;
  padding-left: 10px;
  width: calc(100% - 28px);
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.sidebar-link {
  color: var(--text-muted);
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.2s ease;
  text-decoration: none;
  background: transparent;
  position: relative;
  flex-shrink: 0;
}

.sidebar.expanded .sidebar-link {
  width: calc(100% - 28px);
  margin: 0 14px;
  justify-content: flex-start;
  padding-left: 10px;
}

.sidebar-text {
  margin-left: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.sidebar.expanded .sidebar-text {
  opacity: 1;
  transition-delay: 0.1s;
}

.sidebar-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-link.active {
  color: var(--primary);
  background: transparent;
}

.sidebar-link.active::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--primary);
  border-radius: 0 4px 4px 0;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.expanded .sidebar-link.active::before {
  left: -14px;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--space-6) var(--space-3);
  padding-left: calc(72px + var(--space-3));
  min-height: 100vh;
}

.card {
  width: 100%;
  max-width: 580px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  padding: var(--space-5) var(--space-6);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

/* Page Layout Standard - Chronos */
.page-shell {
  width: 100%;
  padding-left: 72px;
  /* For sidebar */
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 24px;
}

.page-topbar-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.page-main {
  flex: 1;
  padding: 0 32px 32px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

/* Mobile Styles */
@media (max-width: 800px) {
  .page-shell {
    padding-left: 0;
    padding-bottom: 0;
  }

  .page-topbar {
    padding: 24px 24px 16px;
  }

  .page-main {
    padding: 0 24px 96px; /* 96px allows content to scroll past the bottom nav */
  }

  .sidebar {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    flex-direction: row !important;
    width: 100% !important;
    height: auto !important;
    padding: 10px 16px !important;
    padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    gap: 0;
    border-radius: 0;
    border-top: 1px solid var(--glass-border);
    border-left: none;
    border-right: none;
    border-bottom: none;
    justify-content: space-between !important;
  }

  .sidebar-top {
    flex-direction: row !important;
    flex: 1;
    align-items: center;
  }

  .sidebar-nav {
    flex-direction: row !important;
    flex: 1;
    justify-content: space-around;
    gap: 0 !important;
  }

  .sidebar-bottom {
    flex-direction: row !important;
    border-top: none !important;
    padding-top: 0 !important;
    align-items: center;
  }

  .sidebar-toggle {
    display: none !important;
  }

  .sidebar-text {
    display: none !important;
  }

  .sidebar-link {
    width: 44px !important;
    height: 44px !important;
    margin: 0 !important;
  }

  .sidebar-link.active::before {
    left: 50% !important;
    top: -10px !important;
    transform: translateX(-50%) !important;
    width: 20px !important;
    height: 3px !important;
    border-radius: 0 0 4px 4px !important;
  }

  .container {
    padding: 16px 0 80px 0 !important;
    align-items: flex-start;
  }



  .container {
    padding: 16px 0 80px 0;
    /* Space for bottom dock */
    align-items: flex-start;
  }

  .card {
    border: none;
    padding: 20px 16px;
    min-height: auto;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    /* Remove blur no mobile para performance */
    background: var(--card-bg);
  }

  body {
    background-image: none;
    background-color: var(--bg);
  }

  h1 {
    font-size: 1.4rem;
  }

  .header {
    margin-bottom: 20px;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-5);
}

h1 {
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--text);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin-top: var(--space-1);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.input-group {
  margin-bottom: 24px;
}

.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}





.btn-now:hover {
  background: rgba(192, 74, 26, 0.25);
  border-color: var(--primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}







.btn-remove:hover {
  transform: scale(1.1);
}

.btn-add {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px dashed var(--glass-border);
  border-radius: 8px;
  color: var(--text-muted);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.results {
  margin-top: auto;
  padding-top: 32px;
  border-top: 1px solid var(--glass-border);
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-label {
  color: var(--text-muted);
  font-weight: 500;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.overtime {
  color: var(--primary);
}

.missing {
  color: var(--text);
}

.btn-save,
.btn-register {
  width: 100%;
  padding: 14px 20px;
  margin-top: 12px;
  background: transparent;
  border: 1px solid var(--primary);
  border-radius: 4px;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.btn-save:hover,
.btn-register:hover {
  background: var(--primary);
  color: white;
  box-shadow: 0 0 16px var(--primary-glow);
  transform: none;
  filter: none;
}

.btn-save:active,
.btn-register:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 7, 10, 0.55);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content {
  background: rgba(15, 18, 23, 0.75);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  padding: 32px;
  /* Shadow pattern: elevated modal shadow from design guide + premium drop shadow */
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 20px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.btn-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
}

.btn-close:hover {
  background: rgba(255, 74, 90, 0.12);
  color: #ff4a5a;
  border-color: rgba(255, 74, 90, 0.25);
  transform: rotate(90deg);
}

.modal-header {
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    height: 100dvh;
    max-height: 100dvh;
    max-width: 100%;
    border-radius: 0;
    border: none;
    padding: 60px 16px 24px;
    background: var(--bg);
    /* Performance priority on mobile */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  .btn-close {
    top: 16px;
    right: 16px;
  }
}

@media (min-width: 601px) {
  .modal-content {
    border-radius: 16px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.02);
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--glass-border);
}

.stat-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Dashboard & Calendar */
.modal-content.large {
  max-width: 700px;
  width: 95%;
}

.calendar-header h2 {
  font-size: 1.25rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  /* Tighter gap */
  margin-bottom: 16px;
}



.month-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weekday-label {
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  padding-bottom: 4px;
}




.stat-value {
  font-size: 1.1rem;
}

.day-details {
  padding: 12px 16px;
  border-radius: 8px;
}

.info-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s;
}

.info-box:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.info-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.info-value.overtime {
  color: var(--primary);
}

.info-value.missing {
  color: var(--text);
}

.calendar-day:hover {
  background: rgba(192, 74, 26, 0.1);
  border-color: var(--primary);
}

.calendar-day.other-month {
  opacity: 0.2;
  cursor: default;
}

.calendar-day.today {
  border-color: var(--primary);
  background: rgba(192, 74, 26, 0.05);
}

.calendar-day.selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.day-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 4px;
  box-shadow: 0 0 8px currentColor;
}

.day-indicator.positive {
  background: var(--primary);
}

.day-indicator.negative {
  background: #FF4444;
}

.day-details {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.day-details h3 {
  font-size: 1rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 700px) {
  .modal-content.large {
    height: 100dvh;
    border-radius: 0;
    max-width: 100%;
    overflow-y: auto;
  }

  .calendar-grid {
    gap: 2px;
    width: 100%;
  }

  .calendar-day {
    font-size: 0.65rem;
    border-radius: 6px;
    min-width: 0;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 8px;
}

/* Login Page */
.login-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: transparent;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(17, 24, 39, 0.6);

  border: 1px solid var(--glass-border);
  padding: 48px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: modalIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 64px;
  height: 64px;
  background: var(--primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-header h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field svg {
  position: absolute;
  left: 16px;
  color: var(--text-muted);
  pointer-events: none;
  transition: all 0.2s;
}

.input-field input {
  padding-left: 48px;
  height: 56px;
}

.input-field input:focus+svg {
  color: var(--primary);
}

.login-btn {
  height: 56px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  filter: brightness(1.1);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer button {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}

.login-footer button:hover {
  color: var(--primary);
  text-decoration: underline;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* DayDetails Component Styles */
.day-modal-info-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.day-modal-header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  padding: 24px 0 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.day-modal-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.day-modal-stat-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.day-modal-stat-icon {
  opacity: 0.7;
}

.day-modal-stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
}

.day-modal-stat-value.overtime {
  color: var(--primary);
}

.day-modal-stat-value.missing {
  color: var(--text);
}

.day-modal-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.day-modal-section-title {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 8px;
}

.day-modal-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 8px;
}

.day-modal-timeline-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  min-height: 48px;
}

.day-modal-timeline-indicator {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12px;
  /* Ensure proper vertical line rendering height */
  align-self: stretch;
}

.day-modal-timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  z-index: 2;
  margin-top: 5px;
  transition: all 0.25s ease;
}

.day-modal-timeline-dot.entrada {
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary-glow), 0 0 0 2px rgba(0, 102, 255, 0.2);
}

.day-modal-timeline-dot.saida {
  background: transparent;
  border: 2px solid var(--text-dim);
}

.day-modal-timeline-line {
  position: absolute;
  top: 15px;
  bottom: -15px;
  width: 2px;
  background: rgba(255, 255, 255, 0.06);
  z-index: 1;
}

.day-modal-timeline-content {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
}

.day-modal-timeline-pair {
  display: flex;
  align-items: center;
  gap: 16px;
}

.day-modal-timeline-punch {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.day-modal-timeline-arrow {
  color: var(--text-dim);
  font-size: 0.85rem;
  font-weight: 500;
}

.day-modal-timeline-time {
  font-size: 1.15rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text);
}

.day-modal-timeline-type {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.day-modal-empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-dim);
  font-size: 0.9rem;
  border: 1px dashed rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}

.day-modal-observation {
  margin-top: 8px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.015);
  border-left: 3px solid var(--primary);
  border-radius: 0 12px 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.day-modal-observation-title {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.day-modal-observation-text {
  font-size: 0.9rem;
  color: rgba(243, 245, 248, 0.85);
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Componentes Compartilhados — usados em múltiplas páginas */
/* Cabeçalho padrão de página */
.admin-header-new {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.header-row-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-row-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

/* Navegação de Mês (MonthSelector) */
.month-nav-new {
  display: flex;
  align-items: center;
  gap: 8px;
}

.month-label-new {
  font-weight: 700;
  text-transform: capitalize;
  min-width: 140px;
  text-align: center;
  font-size: 0.95rem;
}

/* Toggle de visualização (Grade / Detalhado) */
.toggles-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-container-new {
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
  border: 1px solid var(--glass-border);
}

.view-toggle-new {
  padding: 6px 14px;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-muted);
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-new.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Saldo do mês em linha */
.balance-mini-left {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  margin-top: 10px;
}

.balance-mini-left .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

.balance-mini-left .value {
  font-size: 1rem;
  font-weight: 800;
}

/* Select customizado */
.custom-select {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 0.9rem;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.custom-select:focus {
  border-color: var(--primary);
  background: rgba(0, 0, 0, 0.4);
}

/* Grid de filtros */
.filters-grid-new {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Utilitários de layout */
.label-icon-flex {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-group-no-margin {
  margin-bottom: 0 !important;
}

/* Responsivo compartilhado */
@media (max-width: 600px) {
  .header-row-1 {
    flex-direction: row;
    justify-content: space-between;
  }

  .header-row-2 {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toggles-group {
    justify-content: space-between;
  }

  .toggle-container-new {
    flex: 1;
  }

  .view-toggle-new {
    flex: 1;
    text-align: center;
  }

  .month-label-new {
    min-width: 110px;
    font-size: 0.85rem;
  }

  .filters-grid-new {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.4rem;
  }
}

/* Barra de progresso global de navegação */
.global-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  transition: transform 200ms ease-in-out, opacity 200ms;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  background: var(--primary);
  box-shadow: none;
  pointer-events: none;
}

.global-progress-bar.active {
  opacity: 1;
  transform: scaleX(1);
}

/* Customização do avatar do menu lateral */
.sidebar-avatar {
  border-radius: 8px !important;
}

/* =========================================================================
   SHEET (SIDE DRAWER) MODAL
   ========================================================================= */

.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 10, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.sheet-overlay.visible {
  background: rgba(5, 7, 10, 0.55);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  pointer-events: auto;
}

.sheet-content {
  position: fixed;
  top: 0;
  right: -100%;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background: rgba(15, 18, 23, 0.95);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.5);
  transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.sheet-content.visible {
  right: 0;
}

.sheet-btn-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.sheet-btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  transform: rotate(90deg);
}

.sheet-header {
  padding: 40px 32px 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
}

.sheet-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(102, 153, 255, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(102, 153, 255, 0.2);
}

.sheet-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
  margin: 0;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

/* =========================================================================
   PREMIUM CENTERED MODAL
   ========================================================================= */

.premium-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 10, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.premium-modal-overlay.visible {
  background: rgba(5, 7, 10, 0.65);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  pointer-events: auto;
}

.premium-modal-content {
  position: relative;
  width: 100%;
  max-width: 540px;
  background: rgba(18, 22, 28, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow:
    0 24px 80px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  opacity: 0;
  transform: scale(0.96) translateY(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
}

.premium-modal-content.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.premium-modal-accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), #a855f7, var(--primary));
  opacity: 0.8;
}

.premium-btn-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.premium-btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  transform: rotate(90deg) scale(1.05);
}

.premium-modal-header {
  padding: 32px 32px 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.premium-modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 153, 255, 0.15), rgba(168, 85, 247, 0.15));
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.premium-modal-icon svg {
  width: 28px;
  height: 28px;
}

.premium-modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
  margin: 0;
}

.premium-modal-body {
  padding: 0 32px 32px 32px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

/* =========================================================================
   ACTION BUTTONS (GLOBAL)
   ========================================================================= */
.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  letter-spacing: 0.03em;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.action-btn.primary {
  background: rgba(0, 102, 255, 0.12);
  border-color: rgba(0, 102, 255, 0.35);
  color: #6699ff;
}

.action-btn.primary:hover {
  background: rgba(0, 102, 255, 0.20);
  border-color: rgba(0, 102, 255, 0.6);
  color: #80aaff;
}
```

## 2. Styles específicos

### admin.css
```css
/* Estilos específicos do Admin / Relatórios */

.btn-saldos-new {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-saldos-new:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
}

.team-balance-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.team-balance-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}
.team-balance-item.clickable {
  cursor: pointer;
}
.team-balance-item.clickable:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
  transform: translateY(-2px);
}
.emp-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.emp-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.emp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.emp-name {
  font-weight: 700;
  font-size: 0.9rem;
}
.emp-team {
  font-size: 0.7rem;
  color: var(--text-muted);
}
.emp-balances {
  display: flex;
  gap: 16px;
}
.balance-mini {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.balance-mini .label {
  font-size: 0.55rem;
  color: var(--text-muted);
  text-transform: uppercase;
}
.balance-mini .value {
  font-size: 0.85rem;
  font-weight: 700;
}

/* CSS para admin */
.admin-header-actions {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.filters-wrapper-new {
  margin-bottom: 24px;
}

.label-icon-flex {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-group-no-margin {
  margin-bottom: 0 !important;
}

.balance-left-spaced {
  margin-top: 16px;
}

.avatar-stack-left-aligned {
  justify-content: flex-start !important;
}

.admin-history-scroll {
  padding-right: 4px;
}

.admin-modal-record-item {
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-modal-record-item:last-child {
  border-bottom: none;
}

.admin-history-avatar {
  border-radius: 8px !important;
  flex-shrink: 0;
}

.emp-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.emp-details-name {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.emp-details-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.admin-modal-punches-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 8px 0;
}

.admin-modal-punch-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.punch-pill-time {
  font-weight: 600;
  color: var(--text);
}

.punch-pill-arrow {
  color: var(--text-dim);
  font-size: 0.75rem;
}

.admin-modal-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 16px;
}

.admin-history-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.admin-modal-stats-row {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.admin-modal-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-item-label {
  text-transform: uppercase;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-item-value {
  font-weight: 700;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.05rem;
}

.stat-item-value.overtime {
  color: var(--primary);
}

.stat-item-value.missing {
  color: var(--text);
}

.admin-modal-observation-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.015);
  border-left: 3px solid var(--primary);
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
  margin-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.admin-modal-no-punches {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-style: italic;
}

.balance-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.balance-tag.positive {
  background: rgba(0, 208, 132, 0.12);
  color: var(--success);
  border: 1px solid rgba(0, 208, 132, 0.25);
}

.balance-tag.negative {
  background: rgba(255, 74, 90, 0.12);
  color: var(--error);
  border: 1px solid rgba(255, 74, 90, 0.25);
}

.no-records-centered {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 0;
}

```

### calendar.css
```css
/* Estilos de Calendário e Detalhes de Agenda Semanal Compartilhados - Chronos Mono Blue */

.weekly-schedule-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.schedule-day-row {
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.schedule-day-row:hover {
  background: var(--surface-light);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.day-info-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  padding-right: 20px;
  border-right: 1px solid var(--glass-border);
}

.day-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
}

.day-name {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.punches-flow {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.day-punches-wrapper {
  display: flex;
  gap: 8px;
}

.punch-card-mini {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: fit-content;
}

.punch-item {
  display: flex;
  flex-direction: column;
}

.p-label {
  font-size: 0.55rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.p-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
}

.punch-arrow {
  color: var(--text-dim);
  font-size: 0.8rem;
}

.day-balance-tag {
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 70px;
  text-align: center;
}

.no-records-text {
  font-size: 0.8rem;
  color: var(--text-dim);
}

/* mini-avatares em calendários */
.scheduled-avatars-new {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap !important;
  margin-top: 4px;
  width: 100%;
}

.avatar-mini-new {
  border-radius: 50% !important;
  border: 1px solid var(--surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin-left: -8px;
  z-index: 1;
  width: 22px !important;
  height: 22px !important;
  transition: transform 0.15s;
}

.avatar-mini-new:hover {
  transform: translateY(-2px);
  z-index: 5;
}

.avatar-mini-new:first-child {
  margin-left: 0;
}

.avatar-mini-new img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-more-new {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: bold;
  margin-left: 6px;
  z-index: 2;
  white-space: nowrap;
}

.team-day-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.calendar-wrapper {
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  /* sem margin-bottom para não cortar o espaço */
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--surface-light);
  border-bottom: 1px solid var(--glass-border);
}

.weekday-label {
  text-align: center;
  padding: 12px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.calendar-grid-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(0, 1fr);
  flex: 1;
  min-height: 0;
}

.calendar-day {
  border-right: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  min-height: 0;
  height: 100%;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background 0.15s;
  background: transparent;
  cursor: pointer;
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.02);
}

.calendar-day.other-month {
  opacity: 0.15;
  cursor: default;
}

.calendar-day:hover,
.calendar-day.selected {
  background: var(--primary-glow);
  box-shadow: inset 0 0 0 1px var(--primary);
  color: var(--primary);
  z-index: 2;
}

.day-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 6px var(--primary);
}

.day-indicator.positive {
  background: var(--primary);
  color: var(--primary);
  box-shadow: 0 0 6px var(--primary);
}

.day-indicator.negative {
  background: var(--error);
  color: var(--error);
  box-shadow: 0 0 6px var(--error);
}

.calendar-day-bottom-text {
  font-size: 0.65rem;
  color: var(--text-dim);
  align-self: flex-start;
  margin-top: auto;
  font-family: 'JetBrains Mono', monospace;
}

.calendar-day.selected .calendar-day-bottom-text {
  color: var(--text-muted);
}

/* Estilo Responsivo / Mobile styles */
@media (max-width: 600px) {
  .schedule-day-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .day-info-mini {
    flex-direction: row;
    justify-content: space-between;
    border-right: none;
    border-bottom: 1px solid var(--glass-border);
    padding-right: 0;
    padding-bottom: 8px;
  }

  .day-num {
    font-size: 1.1rem;
  }

  .punches-flow {
    flex-wrap: wrap;
  }

  .day-balance-tag {
    align-self: flex-end;
  }

  .avatar-mini-new {
    width: 20px !important;
    height: 20px !important;
    margin-left: -6px !important;
  }
}

/* ============================================
   CHRONOS — Sistema de Design v4
   Layout: topbar 3 zonas + calendário full-width
   ============================================ */

.page-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* ─── Topbar: 3 zonas em linha ─────────────────────── */
.page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 64px;
  flex-shrink: 0;
  gap: 16px;
}

/* Zona A – título (extrema esquerda) */
.page-topbar-left {
  flex-shrink: 0;
}

.page-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
}

.page-subtitle {
  font-size: 0.7rem;
  color: var(--text-dim);
  font-weight: 500;
  margin-top: 2px;
  display: block;
}

/* Zona B – controles (toggle + filtros, centro-direita) */
.page-topbar-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

/* Zona C – mês + ações (extrema direita) */
.page-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* ─── Subbar: Filtros, Toggle e Saldo ───────────────── */
.page-subbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  height: 56px;
  /* Altura rígida para todas as views */
  box-sizing: border-box;
}

.page-subbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-subbar-right {
  display: flex;
  align-items: center;
}

/* Toggle Grade/Detalhado inline na subbar */
.subbar-toggle {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.subbar-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 5px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}

.subbar-toggle-btn.active {
  background: rgba(0, 102, 255, 0.85);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);
}

/* Filtros inline na subbar */
.subbar-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 3px 14px;
  transition: border-color 0.15s;
}

.subbar-filter:hover,
.subbar-filter:focus-within {
  border-color: rgba(0, 102, 255, 0.4);
}

.subbar-filter-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.subbar-filter select {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  padding: 5px 16px 5px 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
}

.subbar-filter select option {
  background: #0f1217;
}

/* Saldo na subbar */
.subbar-balance {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.subbar-balance-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.subbar-balance-value {
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
}

.subbar-balance-value.overtime {
  color: var(--primary);
}

.subbar-balance-value.missing {
  color: var(--text);
}

/* Select de mês estilo minimalista */
.month-select-clean {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text);
  padding: 7px 32px 7px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 0.15s;
}

.month-select-clean:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.month-select-clean option {
  background: #0f1217;
}


/* Separador após topbar */
.page-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 16px 32px 0;
  flex-shrink: 0;
}

/* Layout: sem sidebar, main ocupa tudo */
.page-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar removida — classes mantidas por compatibilidade mas ocultas */
.page-sidebar {
  display: none;
}

.sidebar-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 6px;
  margin-top: 12px;
}

.sidebar-section-label:first-child {
  margin-top: 0;
}


.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}

.sidebar-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.sidebar-toggle-btn.active {
  background: rgba(0, 102, 255, 0.12);
  color: #80aaff;
  font-weight: 600;
}

.sidebar-toggle-btn .btn-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Filtro select na sidebar */
.sidebar-select-wrapper {
  position: relative;
}

.sidebar-select {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: var(--text);
  padding: 9px 28px 9px 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: border-color 0.15s;
}

.sidebar-select:focus,
.sidebar-select:hover {
  border-color: rgba(0, 102, 255, 0.45);
}

.sidebar-select option {
  background: #0f1217;
}

/* Saldo do mês na sidebar */
.sidebar-balance-card {
  margin-top: 4px;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-balance-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 6px;
  display: block;
}

.sidebar-balance-value {
  font-size: 1.4rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.03em;
  display: block;
}

.sidebar-balance-value.overtime {
  color: var(--primary);
}

.sidebar-balance-value.missing {
  color: var(--text);
}

/* Info badge modo visualização */
.view-mode-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6699ff;
  background: rgba(0, 102, 255, 0.08);
  border: 1px solid rgba(0, 102, 255, 0.2);
  margin-bottom: 4px;
}

/* Área do calendário — ocupa tudo */
.page-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px 28px 20px;
}

/* Override calendário para ser maior */
.calendar-wrapper {
  flex: 1 !important;
  min-height: 0 !important;
}

.calendar-grid-container {
  grid-auto-rows: minmax(72px, 1fr) !important;
}

/* Override toggle buttons antigos (para não conflitar) */
.mini-toggle-container {
  display: none;
}

/* Override calendar day highlight */
.calendar-day:hover,
.calendar-day.selected {
  background: rgba(0, 102, 255, 0.12) !important;
  box-shadow: inset 0 0 0 1px #0066ff !important;
  color: #0066ff !important;
  z-index: 2;
}

.day-indicator.positive {
  background: #0066ff !important;
  box-shadow: 0 0 6px #0066ff !important;
}

.escala-info-badge {
  color: #6699ff !important;
  border-color: rgba(0, 102, 255, 0.3) !important;
  background: rgba(0, 102, 255, 0.08) !important;
}

/* Legado: ocultar classes antigas */
.history-header-new,
.filter-row-new,
.divider-new {
  display: none !important;
}

/* ===== MonthSelector: usa a classe month-select-clean ===== */
.export-btn-new {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  letter-spacing: 0.03em;
}

.export-btn-new:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.export-btn-new.premium-export {
  background: rgba(0, 102, 255, 0.10);
  border-color: rgba(0, 102, 255, 0.30);
  color: #6699ff;
}

.export-btn-new.premium-export:hover {
  background: rgba(0, 102, 255, 0.18);
  border-color: rgba(0, 102, 255, 0.55);
  color: #80aaff;
}



.history-header-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.3), transparent);
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-left h1 {
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #8e99a7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.04em;
  margin: 0;
  line-height: 1.1;
  text-transform: none;
}

.mini-toggle-container {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 6px;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

.mini-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.mini-toggle-btn.active {
  color: #fff;
  background: rgba(0, 102, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.header-actions-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.export-btn-new {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.export-btn-new:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.export-btn-new.premium-export {
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 102, 255, 0.05) 100%);
  border-color: rgba(0, 102, 255, 0.3);
  color: #66a3ff;
}

.export-btn-new.premium-export:hover {
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.25) 0%, rgba(0, 102, 255, 0.1) 100%);
  border-color: rgba(0, 102, 255, 0.5);
  box-shadow: 0 6px 20px rgba(0, 102, 255, 0.2);
}

.filter-row-new {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.filter-pills-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group-new {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 8px 16px;
  gap: 12px;
  transition: all 0.2s ease;
}

.filter-group-new:hover,
.filter-group-new:focus-within {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(0, 102, 255, 0.5);
  box-shadow: 0 0 0 1px rgba(0, 102, 255, 0.5), 0 4px 12px rgba(0, 102, 255, 0.15);
}

.filter-group-new svg {
  color: #0066ff;
}

.filter-group-new label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.filter-group-new select {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  padding-right: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238e99a7' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
}

.filter-group-new select option {
  background: #0f1217;
  color: #fff;
}

.balance-info-new {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 20px;
  border-radius: 12px;
  gap: 16px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.2);
}

.balance-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.balance-value {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  padding: 6px 14px;
  border-radius: 8px;
  letter-spacing: -0.02em;
}

.balance-value.overtime {
  background: transparent;
  color: var(--primary);
  border: none;
  box-shadow: none;
}

.balance-value.missing {
  background: transparent;
  color: var(--text);
  border: none;
  box-shadow: none;
}

.divider-new {
  display: none;
}

/* Override calendar grid colors for Chronos Blue */
.calendar-day:hover,
.calendar-day.selected {
  background: rgba(0, 102, 255, 0.12) !important;
  box-shadow: inset 0 0 0 1px #0066ff !important;
  color: #0066ff !important;
  z-index: 2;
}

.day-indicator.positive {
  background: #0066ff !important;
  color: #0066ff !important;
  box-shadow: 0 0 6px #0066ff !important;
}

.balance-value.overtime {
  color: var(--primary) !important;
}

.escala-info-badge {
  color: #0066ff !important;
  border-color: #0066ff !important;
  background: rgba(0, 102, 255, 0.12) !important;
}
```

### dashboard.css
```css
/* Estilos específicos do Dashboard / Histórico de Ponto - Chronos Mono Blue */

.dashboard-sub-header {
  margin-bottom: -8px;
}

.dashboard-modal-grid {
  grid-template-columns: 1fr;
  gap: 16px;
}

.dashboard-modal-edit-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-modal-goal-banner {
  padding: 16px;
  background: var(--surface-light);
  border-radius: 4px;
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-modal-goal-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text);
}

.dashboard-modal-goal-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.dashboard-modal-goal-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.dashboard-modal-goal-input {
  width: 100px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 6px 30px 6px 10px;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  text-align: center;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.dashboard-modal-goal-input:focus {
  border-color: var(--primary);
  outline: none;
}

.dashboard-modal-goal-input-icon {
  position: absolute;
  right: 10px;
  opacity: 0.5;
  pointer-events: none;
}

.dashboard-modal-punches-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dashboard-modal-punch-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  position: relative;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.dashboard-modal-punch-card:last-child {
  border-bottom: none;
}

.dashboard-modal-punch-card.invalid {
  border-bottom-color: var(--error);
}

.dashboard-modal-error-badge {
  position: absolute;
  top: -4px;
  right: 0;
  background: rgba(255, 74, 90, 0.12);
  border: 1px solid rgba(255, 74, 90, 0.25);
  color: #ff4a5a;
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.dashboard-modal-input-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}

.dashboard-modal-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-modal-label.invalid {
  color: var(--error);
}

.dashboard-modal-input-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dashboard-modal-input-row input {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  text-align: center;
  font-size: 0.95rem;
  width: 100%;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-modal-input-row input:focus {
  border-color: var(--primary);
  background: rgba(0, 102, 255, 0.04);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
  outline: none;
}

.dashboard-modal-input-row input.invalid {
  border-color: var(--error);
  background: rgba(255, 74, 90, 0.04);
  box-shadow: 0 0 0 3px rgba(255, 74, 90, 0.15);
}

.dashboard-modal-clear-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboard-modal-clear-btn:hover {
  background: rgba(255, 74, 90, 0.12);
  color: #ff4a5a;
}

.dashboard-modal-arrow {
  margin-top: 22px;
  color: var(--text-dim);
}

.dashboard-modal-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dashboard-modal-actions-grid-spaced {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel-glass {
  background: transparent !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--text-muted) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
}

.btn-cancel-glass:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--text) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.btn-edit-glass {
  padding: 14px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  background: transparent !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--text-muted) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
}

.btn-edit-glass:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--text) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.btn-delete-dashed {
  padding: 14px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  background: transparent !important;
  border: 1px dashed var(--error) !important;
  color: var(--error) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
}

.btn-delete-dashed:hover {
  background: rgba(255, 74, 90, 0.05) !important;
  border-style: solid !important;
}

.dashboard-modal-empty {
  text-align: center;
  padding: 40px 0;
}

.dashboard-modal-empty p {
  color: var(--text-muted);
  margin-bottom: 16px;
}

.btn-add-primary {
  padding: 12px 20px !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  width: auto !important;
  display: inline-flex !important;
  align-items: center;
  background: transparent !important;
  border: 1px solid var(--primary) !important;
  color: var(--primary) !important;
  box-shadow: none !important;
  border-radius: 4px !important;
}

.btn-add-primary:hover {
  background: var(--primary) !important;
  color: white !important;
}

.btn-icon-margin {
  margin-right: 8px;
}

/* Tabela de Relatório de Espelho de Ponto (Visualização Detalhada) */
.dashboard-table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  width: 100%;
  margin-top: 16px;
  flex: 1;
  min-height: 0;
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
}

.dashboard-history-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.dashboard-history-table th {
  padding: 12px 16px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--glass-border);
}

.dashboard-history-table td {
  padding: 14px 16px;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--glass-border);
  vertical-align: middle;
}

.dashboard-table-row-clickable {
  cursor: pointer;
  transition: background 0.15s ease;
}

.dashboard-table-row-clickable:hover {
  background: rgba(255, 255, 255, 0.02);
}

.dashboard-history-table .date-col {
  font-weight: 600;
  color: var(--text);
}

.dashboard-history-table .weekday-col {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.dashboard-table-punches-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dashboard-table-punch-tag {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 0.8rem;
  color: var(--text);
}

.dashboard-table-row-clickable:hover .dashboard-table-punch-tag {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
}

.dashboard-table-no-records {
  color: var(--text-dim);
  font-size: 0.8rem;
  font-style: italic;
}

.overtime-text {
  color: var(--primary);
  font-weight: 600;
}

.missing-text {
  color: var(--text);
  font-weight: 500;
}

.dashboard-status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
}

.dashboard-status-badge.normal {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
}

.dashboard-status-badge.overtime {
  background: rgba(0, 102, 255, 0.1);
  color: var(--primary);
  border: 1px solid rgba(0, 102, 255, 0.2);
}

.dashboard-status-badge.missing {
  background: rgba(255, 74, 90, 0.1);
  color: var(--error);
  border: 1px solid rgba(255, 74, 90, 0.2);
}

.dashboard-status-badge.incomplete {
  background: rgba(255, 179, 0, 0.1);
  color: #ffb300;
  border: 1px solid rgba(255, 179, 0, 0.2);
}

.dashboard-status-badge.folga {
  background: transparent;
  color: var(--text-dim);
}

.history-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  padding: 32px 48px;
  padding-left: calc(72px + 48px);
}

.history-header-compact {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--glass-border);
}

.history-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.history-header-title-group h1 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--text);
  text-transform: uppercase;
}

.history-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-filter-pills {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: all 0.15s;
}

.filter-pill:hover, .filter-pill:focus-within {
  background: var(--surface-light);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text);
}

.filter-pill select {
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  appearance: none;
  padding-right: 4px;
}

.filter-pill select option {
  background: var(--card-bg);
  color: var(--text);
}

.mini-toggle-container {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 2px;
}

.mini-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.mini-toggle-btn.active {
  background: var(--primary);
  color: white;
}

.dashboard-export-btn {
  background: var(--surface-light);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  font-size: 0.85rem;
}

.dashboard-export-btn:hover {
  background: var(--surface);
  color: var(--text);
}

```

### escala.css
```css
/* Estilos específicos da Escala Mensal - Chronos Mono Blue */

.escala-info-badge {
  padding: 8px 12px;
  background: var(--primary-glow);
  border: 1px solid var(--primary);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.escala-filters-container {
  margin-bottom: 24px;
}

.filters-grid-new.single-col {
  grid-template-columns: 1fr;
}

.input-group-no-margin {
  margin-bottom: 0 !important;
}

.label-icon-flex {
  display: flex;
  align-items: center;
  gap: 6px;
}

.calendar-day.scheduled {
  background: var(--surface);
  border-color: var(--glass-border);
}

.calendar-day.default-cursor {
  cursor: default;
}

.escala-modal-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.escala-modal-employee-card {
  padding: 14px 18px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.escala-modal-employee-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.escala-modal-employee-card.scheduled-card {
  border-color: var(--primary);
  background: rgba(0, 102, 255, 0.06);
  box-shadow: 0 4px 20px rgba(0, 102, 255, 0.08);
}

.escala-modal-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.escala-modal-badge.scheduled {
  background: rgba(0, 102, 255, 0.12);
  color: var(--primary);
  border: 1px solid rgba(0, 102, 255, 0.25);
  box-shadow: 0 0 12px rgba(0, 102, 255, 0.15);
}

.escala-modal-avatar {
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.escala-modal-employee-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
}

.escala-modal-empty-box {
  text-align: center;
  padding: 20px 0;
}

.escala-modal-empty-box p {
  color: var(--text-muted);
}

.escala-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  padding: 32px 48px;
  padding-left: calc(72px + 48px);
}

.escala-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}
```

### home.css
```css
/* Estilos da Tela Inicial (Home Dashboard) - Chronos Mono Blue */

.home-dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* Hero clock panel */
.home-hero-card {
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 16px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.home-hero-title {
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
  letter-spacing: 0.15em;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.home-clock-text {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 8px 0;
  text-shadow: 0 0 20px var(--primary-glow);
  line-height: 1;
}

.home-button-wrapper {
  width: 100%;
  max-width: 320px;
  margin-top: 8px;
}

.home-punch-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.home-punch-btn:hover {
  background: var(--primary-glow);
}

.home-punch-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 0 16px var(--primary-glow);
}

/* Stats grid */
.home-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.home-stat-box {
  background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

.home-stat-box.timeline-box {
  grid-column: span 2;
}

.home-stat-header {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.home-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}

.home-stat-value.overtime {
  color: var(--primary);
  text-shadow: 0 0 12px var(--primary-glow);
}

.home-stat-value.missing {
  color: var(--text);
}

.home-stat-meta-row {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

/* Inline Daily Goal Configuration */
.home-goal-input-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.home-goal-inline-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 4px 8px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  width: 72px;
  font-size: 0.75rem;
  transition: border-color 0.2s;
  text-align: center;
}

.home-goal-inline-input:focus {
  border-color: var(--primary);
  outline: none;
  background: rgba(0, 0, 0, 0.4);
}

.home-goal-inline-icon {
  opacity: 0.5;
  pointer-events: none;
  flex-shrink: 0;
}

/* Horizontal Progress Bars */
.home-progress-bar-container {
  height: 4px;
  background: var(--surface-light);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.home-progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.home-progress-bar.success {
  background: var(--primary);
}

.home-progress-bar.warning {
  background: var(--text-dim);
}

/* Punch timeline */
.home-punch-timeline-container {
  overflow-x: auto;
  width: 100%;
  padding: 8px 0;
  margin-top: 4px;
}

.home-punch-timeline {
  display: flex;
  min-width: max-content;
  gap: 32px;
  align-items: flex-start;
  justify-content: flex-start;
  padding-bottom: 8px;
}

.home-punch-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
  flex: 1;
  transition: all 0.2s;
}

.home-node-circle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 24px;
  margin-bottom: 8px;
}

.home-node-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
  z-index: 2;
  transition: all 0.2s;
}

.home-punch-node.empty .home-node-circle {
  background: var(--text-dim);
  box-shadow: none;
}

.home-node-line-left, .home-node-line-right {
  position: absolute;
  top: 50%;
  height: 1px;
  background: var(--glass-border);
  z-index: 1;
}

.home-node-line-left {
  left: 0;
  right: 50%;
}

.home-node-line-right {
  left: 50%;
  right: 0;
}

.home-punch-node:first-child .home-node-line-left {
  display: none;
}

.home-punch-node:last-child .home-node-line-right {
  display: none;
}

.home-node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.home-node-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 110px;
}

.home-node-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 6px 20px 6px 6px;
  color: var(--text);
  font-size: 0.95rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  text-align: center;
  width: 100%;
  transition: all 0.2s;
  letter-spacing: 1px;
}

.home-node-input:focus {
  border-color: var(--primary);
  background: rgba(0, 0, 0, 0.4);
  outline: none;
}

.home-node-input.invalid {
  border-color: var(--error) !important;
  background: rgba(255, 74, 90, 0.04);
}

.home-node-clear-btn {
  position: absolute;
  right: 6px;
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}

.home-node-clear-btn:hover {
  color: var(--error);
}

.home-node-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.home-punch-node.empty .home-node-label {
  color: var(--text-dim);
}

.home-node-error-badge {
  font-size: 0.6rem;
  color: var(--error);
  font-weight: 600;
  margin-top: 4px;
  text-align: center;
  display: block;
}

/* Suggestions row */
.home-sugestao-saida-row {
  border-top: 1px solid var(--glass-border);
  padding-top: 12px;
  margin-top: 16px;
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.05em;
  font-weight: 600;
}



/* Responsiveness */
@media (max-width: 768px) {
  .home-stats-grid {
    grid-template-columns: 1fr;
  }
  .home-stat-box.timeline-box {
    grid-column: span 1;
  }
  .home-clock-text {
    font-size: 3.2rem;
  }
}

```

### management.css
```css
.management-container select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

.management-container select:focus {
  border-color: var(--primary);
  background: rgba(0, 102, 255, 0.04);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
}

.management-container select option {
  background: #0f172a;
  color: white;
}

/* CSS para gestão */
.management-header {
  margin-bottom: 0px;
}

.btn-teams-action {
  width: auto !important;
  padding: 12px 20px !important;
  background: var(--primary) !important;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-rows: 1fr;
  gap: 16px;
  padding-bottom: 24px;
  align-items: stretch;
}

/* Custom Scrollbar for users-grid removed so native scrolling works if needed */

.user-grid-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.user-grid-card.clickable-card {
  cursor: pointer;
}

.user-grid-card:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.user-grid-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-grid-info {
  margin-bottom: 16px;
}

.user-grid-name {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-grid-username {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.user-grid-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.badge-role-admin {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(0, 85, 255, 0.25);
  color: #6699FF;
  border: 1px solid rgba(0, 85, 255, 0.4);
  text-transform: uppercase;
  font-weight: 800;
}

.badge-role-user {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  text-transform: uppercase;
  font-weight: 800;
}

.badge-team-primary {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(0, 85, 255, 0.12);
  color: var(--primary);
  border: 1px solid rgba(0, 85, 255, 0.25);
  font-weight: 600;
}

.badge-team-manager {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(0, 85, 255, 0.18);
  color: #6699FF;
  border: 1px solid rgba(0, 85, 255, 0.3);
  font-weight: 600;
}

.badge-team-employee {
  font-size: 0.65rem;
  padding: 3px 10px;
  border-radius: 8px;
  background: rgba(0, 85, 255, 0.10);
  color: var(--primary);
  border: 1px solid rgba(0, 85, 255, 0.2);
  font-weight: 600;
}

.badge-team-empty {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-style: italic;
}



.modal-gap-32 {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.modal-gap-24 {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-gap-16 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-gap-8 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-section-label-uppercase {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-section-label-uppercase::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--glass-border);
}

.modal-input-bar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  gap: 8px;
  transition: border-color 0.2s;
}

.modal-input-bar:focus-within {
  border-color: var(--border-focus);
}

.modal-input-bar input {
  background: transparent;
  border: none;
  color: white;
  padding: 10px 14px;
  font-size: 0.95rem;
  flex: 1;
  outline: none;
}

.modal-input-bar button {
  border-radius: 8px;
  padding: 0 24px;
  font-weight: 600;
}

.team-list-card-item {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.team-list-card-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.btn-icon-red-transparent {
  color: #ff4a5a !important;
  background: transparent !important;
  transition: all 0.2s;
}

.btn-icon-red-transparent:hover {
  background: rgba(255, 74, 90, 0.12) !important;
}

.user-team-primary-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(0, 102, 255, 0.04);
  border: 1px solid rgba(0, 102, 255, 0.15);
  border-radius: 12px;
}

.user-team-primary-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-team-primary-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.user-team-link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.user-team-link-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-team-link-select {
  padding: 6px 10px !important;
  font-size: 0.75rem !important;
  border-radius: 8px !important;
  margin: 0 !important;
  width: auto !important;
}

.select-team-add {
  flex: 2;
  padding: 10px 12px !important;
  font-size: 0.85rem !important;
  border-radius: 8px !important;
}

.select-role-add {
  flex: 1;
  padding: 10px 12px !important;
  font-size: 0.85rem !important;
  border-radius: 8px !important;
}

.btn-delete-user-glass {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-user-glass:hover {
  background: rgba(239, 68, 68, 0.2);
}

.modal-grid-gap-8 {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-team-name {
  margin: 0 !important;
  height: 54px !important;
}

.team-list-name {
  font-weight: 600;
}

.modal-team-list-container {
  margin-bottom: 12px;
}

.icon-shield-purple {
  color: #6699FF;
}

.form-no-margin {
  margin: 0 !important;
}

.user-team-name-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-empty-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.input-password-change {
  flex: 1;
  margin: 0 !important;
}

.btn-save-password {
  width: auto !important;
  padding: 0 20px !important;
}

.password-feedback-error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 8px;
  font-weight: 500;
}

.password-feedback-success {
  color: var(--success);
  font-size: 0.85rem;
  margin-top: 8px;
}

.password-feedback-error {
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 8px;
}

.form-no-margin {
  margin: 0 !important;
}

/* =========================================================================
   SETTINGS MODAL STRUCTURE (Vercel/Linear style)
   ========================================================================= */

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.settings-section-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.settings-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--glass-border);
  gap: 16px;
}

.settings-card-row:last-child {
  border-bottom: none;
}

.settings-card-row.ghost-row {
  background: rgba(255, 255, 255, 0.01);
}

.settings-card-row.ghost-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.settings-card-footer {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.settings-input {
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text);
  font-size: 0.9rem;
  width: 100%;
  outline: none;
  transition: all 0.2s;
}

.settings-input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.03);
}

.settings-select {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 6px 10px;
  color: var(--text);
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f3f5f8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 32px;
}

.settings-select option {
  background: var(--card-bg);
  color: var(--text);
}

.settings-select:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.settings-btn-primary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn-primary:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Danger Zone */
.danger-zone {
  margin-top: 16px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
}

.danger-zone-content {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.danger-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.danger-btn:hover {
  background: #ef4444;
  color: white;
}

/* Premium Modals (Huashu Design) */

.modal-section-label-uppercase {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-section-label-uppercase::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--glass-border);
}

.modal-input-bar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  gap: 8px;
  transition: border-color 0.2s;
}

.modal-input-bar:focus-within {
  border-color: var(--border-focus);
}

.modal-input-bar input {
  background: transparent;
  border: none;
  color: white;
  padding: 10px 14px;
  font-size: 0.95rem;
  flex: 1;
  outline: none;
}

.modal-input-bar button {
  border-radius: 8px;
  padding: 0 24px;
  font-weight: 600;
}

.team-list-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.01);
}

.team-list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--glass-border);
  transition: background 0.2s;
}

.team-list-row:last-child {
  border-bottom: none;
}

.team-list-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.team-list-name {
  font-weight: 500;
  color: var(--text);
}

.btn-icon-subtle {
  color: var(--text-dim);
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-subtle:hover {
  background: rgba(255, 74, 90, 0.1);
  color: var(--error);
}

.user-team-primary-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 102, 255, 0.1);
  color: var(--primary);
  border: 1px solid rgba(0, 102, 255, 0.2);
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
}

.modal-select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  cursor: pointer;
}

.modal-select:focus {
  border-color: var(--border-focus);
}

.modal-add-team-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.modal-add-team-row select {
  flex: 1;
}

.btn-danger-glass {
  width: 100%;
  padding: 14px;
  background: rgba(255, 74, 90, 0.05);
  border: 1px dashed rgba(255, 74, 90, 0.3);
  color: var(--error);
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger-glass:hover {
  background: rgba(255, 74, 90, 0.1);
  border-style: solid;
}
```

### profile.css
```css
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* HERO SECTION */
.profile-hero {
  position: relative;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 32px 24px 24px;
  text-align: center;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(135deg, rgba(0, 85, 255, 0.2) 0%, rgba(0, 85, 255, 0.0) 100%);
  z-index: 0;
}

.profile-avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  z-index: 1;
}

.profile-avatar-wrapper .avatar-component {
  border-radius: 50% !important;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
  border: 4px solid var(--bg) !important;
}

.profile-camera-btn {
  position: absolute;
  bottom: 0px;
  right: -4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid var(--bg);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-camera-btn:hover {
  transform: scale(1.1);
}

.profile-name-input {
  position: relative;
  z-index: 1;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: white;
  background: transparent;
  border: none;
  text-align: center;
  width: 100%;
  outline: none;
  margin-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}

.profile-name-input:focus {
  border-bottom-color: var(--primary);
}

.profile-username {
  position: relative;
  z-index: 1;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: block;
}

.profile-badge {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.profile-badge.admin {
  background: rgba(0, 85, 255, 0.15);
  border-color: rgba(0, 85, 255, 0.2);
  color: var(--primary);
}

/* CONTENT GRID */
.profile-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .profile-content-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.profile-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-card-title svg {
  color: var(--primary);
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.team-item.primary .team-icon {
  background: rgba(0, 85, 255, 0.15);
  color: var(--primary);
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-name {
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.team-role {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ADMIN CARD */
.profile-card.admin-card {
  background: linear-gradient(135deg, rgba(0, 85, 255, 0.1) 0%, rgba(0, 85, 255, 0.02) 100%);
  border-color: rgba(0, 85, 255, 0.2);
}

.admin-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: auto;
  padding-bottom: 16px;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: var(--primary);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
  width: 100%;
}

.admin-btn:hover {
  background: rgba(0, 102, 255, 1);
}

/* DANGER ZONE */
.profile-danger-zone {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}
```

### simulador.css
```css
.day-header-mob {
  display: none;
}
.mob-label {
  display: none;
}

.suggestion-top-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.sim-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sim-thead-final {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
  gap: 12px;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0 16px;
}
.sim-rows-final {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sim-day-row-final {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 1fr 100px;
  gap: 12px;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
}
.sim-day-row-final.active {
  background: rgba(255, 255, 255, 0.05);
}

.col-name {
  font-size: 0.9rem;
}
.col-res-final {
  text-align: right;
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.day-field input {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 8px;
  color: white;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  outline: none;
}
.day-field input:focus {
  border-color: var(--primary);
  background: rgba(0, 0, 0, 0.4);
}

.pos {
  color: var(--primary) !important;
}
.neg {
  color: var(--text) !important;
}

.footer-panel-compact {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.balance-compact {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.balance-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
}
.balance-value {
  font-size: 1.4rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 8px;
}
.stats-compact {
  display: flex;
  gap: 20px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.stat-item strong {
  color: white;
  margin-left: 4px;
}

@media (max-width: 800px) {
  .desktop-only {
    display: none !important;
  }
  .card {
    padding: 12px;
  }
  .sim-thead-final {
    display: none;
  }
  .sim-day-row-final {
    display: block;
    padding: 12px;
    margin-bottom: 8px;
  }
  .day-header-mob {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .day-header-mob strong {
    font-size: 1.1rem;
  }
  .day-res-mob {
    font-size: 1.1rem;
    font-weight: 800;
  }

  .sim-day-row-final {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .day-header-mob {
    grid-column: span 2;
  }

  .mob-label {
    display: block;
    font-size: 0.6rem;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 4px;
    font-weight: 700;
    text-align: center;
  }
  .day-field input {
    padding: 10px;
    font-size: 1rem;
    border-radius: 8px;
  }

  .footer-panel-compact {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .balance-compact {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .stats-compact {
    justify-content: center;
  }
}

/* CSS para simulador*/
.simulador-container {
  align-items: center;
}

.simulador-card {
  max-width: 900px;
  width: 100%;
}

.simulador-header {
  margin-bottom: 16px;
}

.day-field.goal input {
  color: var(--text) !important;
}


```

## 3. Views (Componentes / HTML)

### AdminView.tsx
```tsx
import { useMemo } from "react";
import { User as UserIcon, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Timer, TrendingDown, TrendingUp, Filter, Layers, Users, Calculator, Wallet } from "lucide-react";
import { useAdminView } from "../hooks/useAdminView";
import { useNavigate } from "react-router";
import { minutesToHHMM } from "../utils/time";
import { Modal } from "../components/Modal";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarVertical } from "../components/CalendarVertical";
import { MonthSelector } from "../components/MonthSelector";
import { AvatarGroup } from "../components/AvatarGroup";
import { Avatar } from "../components/Avatar";
import { DayInfo } from "../components/DayInfo";
import { type SavedDay } from "../types";
import "../styles/calendar.css";
import "../styles/admin.css";

interface AdminViewProps {
  user: any;
  employees: any[];
  historyData: Record<string, SavedDay[]>;
  teamName: string | null;
  teams: any[];
  managerTeams: any[];
  isManager: boolean;
  isAdmin: boolean;
  activeManagerTeamId: string | null;
}

export function AdminView({
  user,
  employees,
  historyData,
  teamName,
  teams,
  managerTeams,
  isManager,
  isAdmin,
  activeManagerTeamId
}: AdminViewProps) {
  const navigate = useNavigate();

  const { state, actions, computed } = useAdminView(user, isAdmin, employees, historyData);

  const {
    selectedTeamId, selectedUserId, currentDate, selectedDateStr,
    isModalOpen, isTeamBalanceModalOpen, calendarView
  } = state;

  const {
    setSelectedTeamId, setSelectedUserId, setIsModalOpen,
    setIsTeamBalanceModalOpen, setCalendarView, changeMonth, handleDayClick
  } = actions;

  const {
    filteredEmployees, selectedDayGlobalData, selectedDayUserData,
    recordCount, selectedUserBalances, teamBalances
  } = computed;

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const numDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: numDays }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dateObj = new Date(year, month, dayNum);
      const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '');

      return {
        dateStr,
        dayNum,
        weekday,
      };
    });
  }, [currentDate]);

  return (
    <div className="page-shell">
      {/* Topbar: Title left, Actions right */}
      <div className="page-topbar">
        <div className="page-topbar-left">
          <h1 className="page-title">Relatórios</h1>
        </div>

        <div className="page-topbar-right">
          <MonthSelector currentDate={currentDate} onChangeMonth={changeMonth} />
          <button className="action-btn" onClick={() => setIsTeamBalanceModalOpen(true)}>
            <Wallet size={14} /> Saldos
          </button>
          {selectedUserId !== "todos" && (
            <a
              href={`/api/export-punches?month=${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}&userId=${selectedUserId}`}
              className="action-btn"
            >Exportar CSV</a>
          )}
        </div>
      </div>

      {/* Subbar: Toggle & Filters left, Balance right */}
      <div className="page-subbar">
        <div className="page-subbar-left">
          <div className="subbar-toggle">
            <button
              onClick={() => setCalendarView('grid')}
              className={`subbar-toggle-btn ${calendarView === 'grid' ? 'active' : ''}`}
            >Grade</button>
            <button
              onClick={() => setCalendarView('list')}
              className={`subbar-toggle-btn ${calendarView === 'list' ? 'active' : ''}`}
            >Detalhado</button>
          </div>

          {(isAdmin || managerTeams.length > 0) && (
            <div className="subbar-filter">
              <span className="subbar-filter-label">Equipe</span>
              {isAdmin ? (
                <select
                  value={selectedTeamId}
                  onChange={(e) => { setSelectedTeamId(e.target.value); setSelectedUserId("todos"); }}
                >
                  <option value="todos">Todas</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              ) : (
                <select
                  value={activeManagerTeamId || managerTeams[0]?.teamId}
                  onChange={(e) => navigate(`/admin?teamFilter=${e.target.value}`)}
                >
                  {managerTeams.map((mt: any) => (
                    <option key={mt.teamId} value={mt.teamId}>{mt.teamName}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="subbar-filter">
            <span className="subbar-filter-label">Colaborador</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="todos">Todos</option>
              {filteredEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="page-subbar-right">
          {selectedUserId !== "todos" && selectedUserBalances && (
            <div className="subbar-balance">
              <span className="subbar-balance-label">Saldo do mês</span>
              <span className={`subbar-balance-value ${selectedUserBalances.monthly >= 0 ? 'overtime' : 'missing'}`}>
                {selectedUserBalances.monthly === 0 ? '00:00' : `${selectedUserBalances.monthly > 0 ? '+' : '-'}${minutesToHHMM(Math.abs(selectedUserBalances.monthly))}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="page-content">
        <div className="page-main">
          {calendarView === 'grid' ? (
            <CalendarGrid
              currentDate={currentDate}
              selectedDateStr={selectedDateStr}
              isModalOpen={isModalOpen}
              onDayClick={handleDayClick}
              renderDay={(d, isSelected, isWeekend) => {
                const recCount = recordCount(d.dateStr);
                return (
                  <div className={`calendar-day ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}>
                    <span>{d.day}</span>
                    {selectedUserId === "todos" ? (
                      recCount > 0 && (
                        <AvatarGroup
                          users={filteredEmployees.filter(emp => (historyData[emp.id] || []).some(h => h.date === d.dateStr))}
                          max={typeof window !== 'undefined' && window.innerWidth < 600 ? 2 : 3}
                          size={32}
                        />
                      )
                    ) : (
                      <>
                        {(historyData[selectedUserId] || []).some(h => h.date === d.dateStr) && (
                          <div className={`day-indicator ${(historyData[selectedUserId] || []).find(h => h.date === d.dateStr)?.isOvertime ? 'positive' : 'negative'}`} />
                        )}
                        <span className="calendar-day-bottom-text">
                          {((historyData[selectedUserId] || []).find(h => h.date === d.dateStr))?.worked || ''}
                        </span>
                      </>
                    )}
                  </div>
                );
              }}
            />
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-history-table">
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>DIA</th>
                    {selectedUserId === "todos" ? (
                      <th colSpan={3}>RESUMO DA EQUIPE</th>
                    ) : (
                      <>
                        <th>MARCAÇÕES</th>
                        <th>TOTAL</th>
                        <th>SALDO</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>

                  {daysInMonth.map((d: any) => {
                    const formattedDate = String(d.dayNum).padStart(2, '0') + '/' + String(currentDate.getMonth() + 1).padStart(2, '0');

                    return (
                      <tr
                        key={d.dateStr}
                        onClick={() => handleDayClick(d.dateStr)}
                        className="dashboard-table-row-clickable"
                        title="Clique para detalhar os registros deste dia"
                      >
                        <td className="font-mono date-col">{formattedDate}</td>
                        <td className="weekday-col">{d.weekday}</td>

                        {selectedUserId === "todos" ? (
                          <td colSpan={3}>
                            {(() => {
                              const dayGlobalRecords = filteredEmployees.map(emp => {
                                const record = (historyData[emp.id] || []).find((h: SavedDay) => h.date === d.dateStr);
                                return record ? { emp, record } : null;
                              }).filter(r => r !== null) as { emp: any, record: SavedDay }[];

                              return dayGlobalRecords.length > 0 ? (
                                <div className="team-day-summary" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <AvatarGroup
                                    users={dayGlobalRecords.map(r => r.emp)}
                                    max={5}
                                    size={24}
                                    className="avatar-stack-left-aligned"
                                  />
                                  <span className="summary-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {dayGlobalRecords.length} colaborador{dayGlobalRecords.length > 1 ? 'es' : ''} registrou{dayGlobalRecords.length > 1 ? 'am' : ''} ponto
                                  </span>
                                </div>
                              ) : (
                                <span className="dashboard-table-no-records">Nenhum registro da equipe</span>
                              );
                            })()}
                          </td>
                        ) : (
                          <>
                            <td>
                              {(() => {
                                const userRecord = (historyData[selectedUserId] || []).find((h: SavedDay) => h.date === d.dateStr);
                                return userRecord ? (
                                  <div className="dashboard-table-punches-list">
                                    {userRecord.punches?.map((p: string, i: number) => (
                                      <span key={i} className="font-mono dashboard-table-punch-tag">
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="dashboard-table-no-records">Sem registros</span>
                                );
                              })()}
                            </td>
                            <td className="font-mono">
                              {(() => {
                                const userRecord = (historyData[selectedUserId] || []).find((h: SavedDay) => h.date === d.dateStr);
                                return userRecord?.worked || "--:--";
                              })()}
                            </td>
                            {(() => {
                              const userRecord = (historyData[selectedUserId] || []).find((h: SavedDay) => h.date === d.dateStr);
                              return (
                                <td className={`font-mono ${userRecord ? (userRecord.isOvertime ? 'overtime-text' : 'missing-text') : ''}`}>
                                  {userRecord?.diff || "--:--"}
                                </td>
                              );
                            })()}
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Detalhes do Dia */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        icon={<CalendarIcon size={20} color="var(--primary)" />}
        className="large"
      >
        {selectedUserId === "todos" ? (
          selectedDayGlobalData && selectedDayGlobalData.length > 0 ? (
            <div className="history-list admin-history-scroll">
              {selectedDayGlobalData.map(record => (
                <div key={record.user.id} className="admin-modal-record-item">
                  {/* Cabeçalho do funcionário + Totais (Lado a Lado) */}
                  <div className="admin-modal-record-header">
                    <div className="admin-history-card-header" style={{ marginBottom: 0 }}>
                      <Avatar
                        src={record.user.avatarUrl}
                        name={record.user.name}
                        size={36}
                        className="admin-history-avatar"
                      />
                      <div className="emp-details">
                        <div className="emp-details-name" style={{ fontSize: '0.9rem' }}>{record.user.name}</div>
                        <div className="emp-details-sub" style={{ fontSize: '0.7rem' }}>
                          {record.user.teamName || (record.user.userTeams && record.user.userTeams.length > 0 ? record.user.userTeams[0].teamName : "Sem Equipe")}
                        </div>
                      </div>
                    </div>

                    {/* Totais do funcionário do lado direito */}
                    <div className="admin-modal-stats-row">
                      <div className="admin-modal-stat-item">
                        <span className="stat-item-label">Meta</span>
                        <span className="stat-item-value">{record.data.goal}</span>
                      </div>
                      <div className="admin-modal-stat-item">
                        <span className="stat-item-label">Trabalhado</span>
                        <span className="stat-item-value">{record.data.worked}</span>
                      </div>
                      <div className="admin-modal-stat-item">
                        <span className="stat-item-label">Saldo</span>
                        <span className={`stat-item-value ${record.data.isOvertime ? "overtime" : "missing"}`}>
                          {record.data.diff}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Batidas e Observação (Abaixo) */}
                  <div className="admin-modal-record-body">
                    {/* Batidas do dia em formato de Pills em linha */}
                    <div className="admin-modal-punches-row">
                      {record.data.punches && record.data.punches.length > 0 ? (
                        (record.data.punches as string[]).map((p, idx) => {
                          const isEntrada = idx % 2 === 0;
                          if (isEntrada) {
                            const exitTime = (record.data.punches as string[])[idx + 1] || "--:--";
                            return (
                              <div key={idx} className="admin-modal-punch-pill">
                                <span className="punch-pill-time">{p}</span>
                                <span className="punch-pill-arrow">→</span>
                                <span className="punch-pill-time">{exitTime}</span>
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <span className="admin-modal-no-punches">Sem batidas registradas</span>
                      )}
                    </div>

                    {/* Observação */}
                    {record.data.observation && (
                      <div className="admin-modal-observation-text">
                        <strong>Obs:</strong> {record.data.observation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-records-centered">
              Ninguém registrou ponto neste dia para a equipe selecionada.
            </p>
          )
        ) : (
          selectedDayUserData ? (
            <DayInfo
              punches={selectedDayUserData.punches}
              worked={selectedDayUserData.worked}
              diff={selectedDayUserData.diff}
              isOvertime={selectedDayUserData.isOvertime}
              showGoal={false}
              observation={selectedDayUserData.observation}
            />
          ) : (
            <p className="no-records-centered">
              Sem registros.
            </p>
          )
        )}
      </Modal>

      {/* Modal de Saldos da Equipe */}
      <Modal
        isOpen={isTeamBalanceModalOpen}
        onClose={() => setIsTeamBalanceModalOpen(false)}
        title="Saldos da Equipe"
        icon={<Wallet size={20} color="var(--primary)" />}
        className="large"
      >
        <div className="team-balance-list">
          {teamBalances.map(emp => (
            <div
              key={emp.id}
              className="team-balance-item clickable"
              onClick={() => {
                setSelectedUserId(emp.id);
                setCalendarView('list');
                setIsTeamBalanceModalOpen(false);
              }}
            >
              <div className="emp-info">
                <Avatar src={emp.avatarUrl} name={emp.name} size={36} className="emp-avatar" />
                <div>
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-team">{emp.teamName || (emp.userTeams && emp.userTeams.length > 0 ? emp.userTeams[0].teamName : "Sem Equipe")}</div>
                </div>
              </div>
              <div className="emp-balances">
                <div className="balance-mini">
                  <span className="label">Saldo Mensal</span>
                  <span className={`value ${emp.balances.monthly >= 0 ? 'overtime' : 'missing'}`}>
                    {emp.balances.monthly === 0 ? '00:00' : `${emp.balances.monthly > 0 ? '+' : '-'}${minutesToHHMM(Math.abs(emp.balances.monthly))}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

```

### DashboardView.tsx
```tsx
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Timer, TrendingDown, TrendingUp, Trash2, Edit3, Plus, Loader2, Clock, ArrowRight } from "lucide-react";
import { useFetcher } from "react-router";
import { useDashboardView } from "../hooks/useDashboardView";
import { type SavedDay } from "../types";
import { minutesToTime, timeToMinutes, minutesToHHMM, formatTimeInput } from "../utils/time";
import { Modal } from "../components/Modal";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarVertical } from "../components/CalendarVertical";
import { MonthSelector } from "../components/MonthSelector";
import { DayInfo } from "../components/DayInfo";
import "../styles/calendar.css";
import "../styles/dashboard.css";

interface DashboardViewProps {
  user: any;
  history: SavedDay[];
}

export function DashboardView({ user, history }: DashboardViewProps) {
  const fetcher = useFetcher();

  const { state, actions, computed } = useDashboardView(user, history, fetcher);

  const {
    currentDate, selectedDateStr, isModalOpen, isEditing,
    editPunches, editGoal, editObservation, calendarView
  } = state;

  const {
    setIsModalOpen, setIsEditing, setEditGoal, setEditObservation,
    setCalendarView, changeMonth, handleDayClick, updatePunch,
    handleSaveEdit, startEditing
  } = actions;

  const { monthStats, selectedDayData } = computed;

  // Gera todos os dias do mês selecionado
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const numDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: numDays }, (_, i) => {
      const dayNum = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dateObj = new Date(year, month, dayNum);
      const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '');

      const record = history.find(h => h.date === dateStr);

      return {
        dateStr,
        dayNum,
        weekday,
        record,
      };
    });
  }, [currentDate, history]);

  return (
    <div className="page-shell">
      {/* Topbar: Title left, Actions right */}
      <div className="page-topbar">
        <div className="page-topbar-left">
          <h1 className="page-title">Espelho de Ponto</h1>
        </div>
        <div className="page-topbar-right">
          <MonthSelector currentDate={currentDate} onChangeMonth={changeMonth} />
          <a
            href={`/api/export-punches?month=${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
            className="action-btn"
          >Exportar CSV</a>
        </div>
      </div>

      {/* Subbar: Toggle left, Balance right */}
      <div className="page-subbar">
        <div className="page-subbar-left">
          <div className="subbar-toggle">
            <button
              onClick={() => setCalendarView('grid')}
              className={`subbar-toggle-btn ${calendarView === 'grid' ? 'active' : ''}`}
            >Grade</button>
            <button
              onClick={() => setCalendarView('list')}
              className={`subbar-toggle-btn ${calendarView === 'list' ? 'active' : ''}`}
            >Detalhado</button>
          </div>
        </div>
        <div className="page-subbar-right">
          <div className="subbar-balance">
            <span className="subbar-balance-label">Saldo do mês</span>
            <span className={`subbar-balance-value ${monthStats.isPositive ? 'overtime' : 'missing'}`}>
              {monthStats.balance}
            </span>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="page-main">
          {calendarView === 'grid' ? (
            <CalendarGrid
              currentDate={currentDate}
              selectedDateStr={selectedDateStr}
              isModalOpen={isModalOpen}
              onDayClick={handleDayClick}
              renderDay={(d, isSelected, isWeekend) => {
                const hasData = history.find(h => h.date === d.dateStr);
                return (
                  <div className={`calendar-day ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{d.day}</span>
                      {hasData && <div className={`day-indicator ${hasData.isOvertime ? 'positive' : 'negative'}`} />}
                    </div>
                    <span className="calendar-day-bottom-text">{hasData ? hasData.worked : ''}</span>
                  </div>
                );
              }}
            />
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-history-table">
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>DIA</th>
                    <th>MARCAÇÕES</th>
                    <th>TOTAL</th>
                    <th>SALDO</th>
                  </tr>
                </thead>
                <tbody>
                  {daysInMonth.map((d: any) => {
                    const formattedDate = String(d.dayNum).padStart(2, '0') + '/' + String(currentDate.getMonth() + 1).padStart(2, '0');

                    return (
                      <tr
                        key={d.dateStr}
                        onClick={() => handleDayClick(d.dateStr)}
                        className="dashboard-table-row-clickable"
                        title="Clique para editar as batidas deste dia"
                      >
                        <td className="font-mono date-col">{formattedDate}</td>
                        <td className="weekday-col">{d.weekday}</td>
                        <td>
                          {d.record ? (
                            <div className="dashboard-table-punches-list">
                              {d.record.punches?.map((p: string, i: number) => (
                                <span key={i} className="font-mono dashboard-table-punch-tag">
                                  {p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="dashboard-table-no-records">Sem registros</span>
                          )}
                        </td>
                        <td className="font-mono">{d.record?.worked || "--:--"}</td>
                        <td className={`font-mono ${d.record ? (d.record.isOvertime ? 'overtime-text' : 'missing-text') : ''}`}>
                          {d.record?.diff || "--:--"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            icon={<CalendarIcon size={20} color="var(--primary)" />}
            className="large"
          >
            <div className="details-grid dashboard-modal-grid">
              {isEditing ? (
                <div className="dashboard-modal-edit-column">
                  <div className="dashboard-modal-goal-banner">
                    <div>
                      <div className="dashboard-modal-goal-title">Meta deste Dia</div>
                      <div className="dashboard-modal-goal-desc">Alterar meta apenas para esta data</div>
                    </div>
                    <div className="dashboard-modal-goal-input-wrapper">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editGoal}
                        maxLength={5}
                        onChange={(e) => setEditGoal(formatTimeInput(e.target.value))}
                        className="dashboard-modal-goal-input"
                      />
                      <Clock size={14} color="white" className="dashboard-modal-goal-input-icon" />
                    </div>
                  </div>
                  <div className="dashboard-modal-punches-list">
                    {(() => {
                      const pairsToShow = Math.max(1, Math.ceil(editPunches.length / 2) + (editPunches.length > 0 && editPunches.length % 2 === 0 && editPunches[editPunches.length - 1] !== "" ? 1 : 0));

                      return Array.from({ length: pairsToShow }).map((_, i) => {
                        const sIdx = i * 2;
                        const eIdx = sIdx + 1;
                        const sVal = editPunches[sIdx];
                        const eVal = editPunches[eIdx];

                        let isInv = false;
                        let errorMsg = "";

                        const sMins = sVal?.length === 5 ? timeToMinutes(sVal) : -1;
                        const eMins = eVal?.length === 5 ? timeToMinutes(eVal) : -1;

                        if (sMins !== -1 && eMins !== -1 && eMins <= sMins) {
                          isInv = true; errorMsg = "Saída ≤ Entrada";
                        }
                        if (!isInv && i > 0 && sMins !== -1) {
                          const pExit = editPunches[sIdx - 1];
                          const pMins = pExit?.length === 5 ? timeToMinutes(pExit) : -1;
                          if (pMins !== -1 && sMins <= pMins) { isInv = true; errorMsg = "Menor que anterior"; }
                        }

                        return (
                          <div key={i} className={`dashboard-modal-punch-card ${isInv ? 'invalid' : ''}`}>
                            {isInv && (
                              <span className="dashboard-modal-error-badge">
                                {errorMsg}
                              </span>
                            )}
                            <div className="dashboard-modal-input-col">
                              <label className={`dashboard-modal-label ${isInv ? 'invalid' : ''}`}>Entrada</label>
                              <div className="dashboard-modal-input-row">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="HH:MM"
                                  value={sVal || ""}
                                  maxLength={5}
                                  onChange={e => updatePunch(sIdx, formatTimeInput(e.target.value))}
                                  className={isInv ? 'invalid' : ''}
                                />
                                {sVal && <button onClick={() => updatePunch(sIdx, "")} className="dashboard-modal-clear-btn">✕</button>}
                              </div>
                            </div>
                            <ArrowRight size={12} className="dashboard-modal-arrow" />
                            <div className="dashboard-modal-input-col">
                              <label className={`dashboard-modal-label ${isInv ? 'invalid' : ''}`}>Saída</label>
                              <div className="dashboard-modal-input-row">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="HH:MM"
                                  value={eVal || ""}
                                  maxLength={5}
                                  onChange={e => updatePunch(eIdx, formatTimeInput(e.target.value))}
                                  className={isInv ? 'invalid' : ''}
                                />
                                {eVal && <button onClick={() => updatePunch(eIdx, "")} className="dashboard-modal-clear-btn">✕</button>}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="dashboard-modal-observation-section" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="dashboard-modal-label">Observação</label>
                    <textarea
                      placeholder="Ex: Esqueceu de bater o ponto, consulta médica, viagem..."
                      value={editObservation}
                      onChange={e => setEditObservation(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '10px',
                        fontSize: '0.9rem',
                        minHeight: '80px',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div className="dashboard-modal-actions-grid" style={{ marginTop: '20px' }}>
                    <button className="btn-register" onClick={handleSaveEdit}>{fetcher.state !== "idle" ? <Loader2 size={16} className="animate-spin" /> : "Salvar"}</button>
                    <button className="btn-register btn-cancel-glass" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </div>
                </div>
              ) : selectedDayData ? (
                <>
                  <DayInfo
                    punches={selectedDayData.punches}
                    worked={selectedDayData.worked}
                    goal={selectedDayData.goal}
                    diff={selectedDayData.diff}
                    isOvertime={selectedDayData.isOvertime}
                    showGoal={true}
                    observation={selectedDayData.observation}
                  />
                  <div className="dashboard-modal-actions-grid-spaced">
                    <button className="btn-register btn-edit-glass" onClick={startEditing}><Edit3 size={16} /> Editar</button>
                    <button className="btn-register btn-delete-dashed" onClick={() => { if (confirm("Remover registro?")) { fetcher.submit({ _action: "delete", date: selectedDateStr }, { method: "post" }); setIsModalOpen(false); } }}><Trash2 size={16} /> Excluir</button>
                  </div>
                </>
              ) : (
                <div className="dashboard-modal-empty">
                  <p>Sem registros.</p>
                  <button className="btn-register btn-add-primary" onClick={startEditing}><Plus size={16} className="btn-icon-margin" /> Adicionar</button>
                </div>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

```

### EscalaView.tsx
```tsx
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Save, CheckCircle2, XCircle, User as UserIcon, Users, Timer, TrendingDown, TrendingUp, Layers } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { type Shift } from "../types";
import { Modal } from "../components/Modal";
import { CalendarGrid } from "../components/CalendarGrid";
import { MonthSelector } from "../components/MonthSelector";
import { AvatarGroup } from "../components/AvatarGroup";
import { Avatar } from "../components/Avatar";
import "../styles/calendar.css";
import "../styles/escala.css";

interface EscalaViewProps {
  user: any;
  employees: any[];
  initialShifts: Shift[];
  teamName: string | null;
  teams: any[];
  userTeams: any[];
  managerTeams: any[];
  isAdmin: boolean;
  activeTeamId: string | null;
  canEditActiveTeam: boolean;
}

export function EscalaView({
  user,
  employees,
  initialShifts,
  teamName,
  teams,
  userTeams,
  managerTeams,
  isAdmin,
  activeTeamId,
  canEditActiveTeam
}: EscalaViewProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const userFirstTeamId = user.teamId || (userTeams && userTeams.length > 0 ? userTeams[0].teamId : null) || "todos";
  const [selectedTeamId, setSelectedTeamId] = useState<string>(isAdmin ? userFirstTeamId : "todos");
  const [selectedUserId, setSelectedUserId] = useState<string>("todos");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [escala, setEscala] = useState<Shift[]>(initialShifts);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const filteredEmployees = useMemo(() => {
    if (selectedTeamId === "todos") return employees;
    return employees.filter(emp =>
      emp.teamId === selectedTeamId ||
      (emp.userTeams && emp.userTeams.some((ut: any) => ut.teamId === selectedTeamId))
    );
  }, [employees, selectedTeamId]);

  const handleDayClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    if (selectedUserId === "todos") {
      setIsModalOpen(true);
    }
  };

  const toggleEmployeeForDay = (empId: string) => {
    if (!isAdmin && !canEditActiveTeam) return;

    let newEscala;
    const exists = escala.find(s => s.userId === empId && s.date === selectedDateStr);
    if (exists) {
      newEscala = escala.filter(s => !(s.userId === empId && s.date === selectedDateStr));
    } else {
      const newShift: Shift = {
        userId: empId,
        date: selectedDateStr,
        startTime: "08:00",
        endTime: "17:00",
        type: 'trabalho'
      };
      newEscala = [...escala, newShift];
    }
    setEscala(newEscala);

    const userShifts = newEscala.filter(s => s.userId === empId);
    fetcher.submit(
      {
        action: "save",
        userId: empId,
        shifts: JSON.stringify(userShifts)
      },
      { method: "post" }
    );
  };

  const scheduledEmployeesOnSelectedDay = useMemo(() => {
    return filteredEmployees.filter(emp => escala.find(s => s.userId === emp.id && s.date === selectedDateStr));
  }, [escala, selectedDateStr, filteredEmployees]);

  return (
    <div className="page-shell">
      <div className="page-topbar">
        <div className="page-topbar-left">
          <h1 className="page-title">Escala Mensal</h1>
        </div>

        <div className="page-topbar-right">
          <MonthSelector currentDate={currentDate} onChangeMonth={changeMonth} />
        </div>
      </div>

      <div className="page-subbar">
        <div className="page-subbar-left">
          {!isAdmin && !canEditActiveTeam && activeTeamId && (
            <div className="view-mode-badge" style={{ marginRight: 16 }}>
              <XCircle size={12} /> Modo Visualização
            </div>
          )}
          {(isAdmin || managerTeams.length > 0) && (
            <div className="subbar-filter">
              <span className="subbar-filter-label">Equipe</span>
              {isAdmin ? (
                <select
                  value={selectedTeamId}
                  onChange={(e) => { setSelectedTeamId(e.target.value); setSelectedUserId("todos"); }}
                >
                  <option value="todos">Todas</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              ) : (
                <select
                  value={activeTeamId || managerTeams[0]?.teamId}
                  onChange={(e) => navigate(`/escala?teamFilter=${e.target.value}`)}
                >
                  {managerTeams.map((mt: any) => (
                    <option key={mt.teamId} value={mt.teamId}>{mt.teamName}</option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="subbar-filter">
            <span className="subbar-filter-label">Colaborador</span>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="todos">Todos</option>
              {filteredEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="page-subbar-right">
          {/* Vazio na escala para manter a altura consistente */}
        </div>
      </div>

      <div className="page-content">
        <div className="page-main">

          <CalendarGrid
            currentDate={currentDate}
            selectedDateStr={selectedDateStr}
            isModalOpen={isModalOpen}
            onDayClick={handleDayClick}
            renderDay={(d, isSelected) => {
              const scheduledUsers = filteredEmployees.filter(emp =>
                escala.find(s => s.userId === emp.id && s.date === d.dateStr) &&
                (selectedUserId === "todos" || emp.id === selectedUserId)
              );
              const isCursorEditable = selectedUserId === "todos";
              return (
                <div className={`calendar-day ${isSelected ? 'selected' : ''} ${!isCursorEditable ? 'default-cursor' : ''}`}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{d.day}</span>
                  </div>
                  {scheduledUsers.length > 0 ? (
                    selectedUserId === "todos" ? (
                      <AvatarGroup users={scheduledUsers} max={3} size={32} />
                    ) : (
                      <span className="calendar-day-bottom-text">08:00 - 17:00</span>
                    )
                  ) : (
                    <span className="calendar-day-bottom-text"></span>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}

        title={new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        icon={<CalendarIcon size={20} color="var(--primary)" />}
        className="large"
      >
        <div className="history-list">
          <p className="escala-modal-subtitle">
            {(isAdmin || canEditActiveTeam)
              ? "Clique em um colaborador para escalar/remover deste dia:"
              : "Colaboradores escalados para este dia:"}
          </p>
          {(isAdmin || canEditActiveTeam) ? (
            filteredEmployees.length > 0 ? (
              filteredEmployees.map(emp => {
                const isScheduled = escala.some(s => s.userId === emp.id && s.date === selectedDateStr);
                return (
                  <div
                    key={emp.id}
                    className={`escala-modal-employee-card ${isScheduled ? 'scheduled-card' : ''}`}
                    onClick={() => toggleEmployeeForDay(emp.id)}
                    style={{ cursor: 'pointer', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar
                        src={emp.avatarUrl}
                        name={emp.name}
                        size={44}
                        className="escala-modal-avatar"
                      />
                      <div className="escala-modal-employee-name">{emp.name}</div>
                    </div>
                    <div>
                      {isScheduled ? (
                        <CheckCircle2 size={20} color="var(--primary)" />
                      ) : (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--glass-border)' }} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="escala-modal-empty-box">
                <p>Nenhum colaborador na equipe.</p>
              </div>
            )
          ) : (
            scheduledEmployeesOnSelectedDay.length > 0 ? (
              scheduledEmployeesOnSelectedDay.map(emp => (
                <div key={emp.id} className="escala-modal-employee-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                      src={emp.avatarUrl}
                      name={emp.name}
                      size={44}
                      className="escala-modal-avatar"
                    />
                    <div className="escala-modal-employee-name">{emp.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="escala-modal-empty-box">
                <p>Ninguém escalado.</p>
              </div>
            )
          )}
        </div>
      </Modal>
    </div>
  );
}

```

### HomeView.tsx
```tsx
import { useState, useEffect, useMemo } from "react";
import {Clock, ArrowRight, Loader2, Settings} from "lucide-react";
import { useFetcher } from "react-router";
import { timeToMinutes, minutesToTime, minutesToHHMM, formatTimeInput } from "../utils/time";
import { calculatePunchMetrics } from "../domain/punchCalculator";
import "../styles/home.css";

interface HomeViewProps {
  user: any;
  initialPunches: string[];
  initialGoal: string;
  dateStr: string;
}

export function HomeView({ user, initialPunches, initialGoal, dateStr }: HomeViewProps) {
  const fetcher = useFetcher();
  const syncFetcher = useFetcher();
  
  const [punches, setPunches] = useState<string[]>(initialPunches);
  const [dailyGoal, setDailyGoal] = useState(initialGoal);
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Sincronização Silenciosa: Checa por mudanças no servidor a cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (fetcher.state === "idle" && syncFetcher.state === "idle" && document.visibilityState === "visible") {
        syncFetcher.load("/"); // Busca os dados da Home sem alarde
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [fetcher.state, syncFetcher]);

  // Atualiza os punches quando os dados vêm do syncFetcher (outras abas/dispositivos)
  useEffect(() => {
    const newData = syncFetcher.data as any;
    if (newData?.initialPunches) {
      setPunches(newData.initialPunches);
      setDailyGoal(newData.initialGoal);
    }
  }, [syncFetcher.data]);

  // Debounce para salvar: evita atropelar a digitação do usuário
  useEffect(() => {
    const isDifferent = JSON.stringify(punches) !== JSON.stringify(initialPunches) || dailyGoal !== initialGoal;
    if (isDifferent) {
      const timer = setTimeout(() => {
        savePunches(punches, dailyGoal);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [punches, dailyGoal]);

  // Detecta se o dia mudou e recarrega os dados
  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      if (today !== dateStr) {
        window.location.reload();
      }
    };
    const interval = setInterval(checkDate, 60000);
    window.addEventListener('focus', checkDate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDate);
    };
  }, [dateStr]);

  const currentResults = useMemo(() => {
    const metrics = calculatePunchMetrics(punches, dailyGoal);
    return {
      totalWorked: metrics.totalWorkedStr,
      overtime: metrics.diffStr,
      isOvertime: metrics.isOvertime,
      workMins: metrics.workMins,
      diffMins: metrics.diffMins,
      firstEntryMins: metrics.firstEntryMins,
      totalBreakMins: metrics.breakMins,
    };
  }, [punches, dailyGoal]);

  const savePunches = (newPunches: string[], goalValue: string) => {
    let cleanedPunches = [...newPunches];
    while (cleanedPunches.length > 0 && cleanedPunches[cleanedPunches.length - 1] === "") {
      cleanedPunches.pop();
    }

    const metrics = calculatePunchMetrics(cleanedPunches, goalValue);

    fetcher.submit(
      {
        date: dateStr,
        punches: JSON.stringify(cleanedPunches),
        goal: goalValue,
        workMins: metrics.workMins.toString(),
        diffMins: metrics.diffMins.toString(),
        isOvertime: metrics.isOvertime.toString()
      },
      { method: "post" }
    );
  };

  const updateAndSavePunches = (newPunches: string[]) => {
    setPunches(newPunches);
  };

  const updatePunch = (index: number, value: string) => {
    const newPunches = [...punches];
    newPunches[index] = value;
    setPunches(newPunches);
  };

  const punchesWithEmpty = useMemo(() => {
    const copy = [...punches];
    if (copy.length === 0 || copy[copy.length - 1] !== "") {
      copy.push("");
    }
    return copy;
  }, [punches]);

  return (
    <div className="container">
      <div className="home-dashboard-container">
        
        {/* HERO CARD - CLOCK & PUNCH ACTIONS */}
        <div className="home-hero-card">
          <div className="home-hero-title">
            [ CRONÔMETRO DE JORNADA ]
          </div>
          <div className="home-clock-text font-mono">
            {(() => {
              const [currentTime, setCurrentTime] = useState(new Date());
              useEffect(() => {
                const timer = setInterval(() => setCurrentTime(new Date()), 1000);
                return () => clearInterval(timer);
              }, []);
              const h = String(currentTime.getHours()).padStart(2, '0');
              const m = String(currentTime.getMinutes()).padStart(2, '0');
              const s = String(currentTime.getSeconds()).padStart(2, '0');
              return `${h}:${m}:${s}`;
            })()}
          </div>
          
          <div className="home-button-wrapper">
            {(() => {
              const filledPunches = punches.filter(p => p !== "");
              const isEntry = filledPunches.length % 2 === 0;
              return (
                <button 
                  className={`home-punch-btn ${!isEntry ? 'active' : ''}`}
                  onClick={() => {
                    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const current = [...punches];
                    const firstEmptyIdx = current.findIndex(p => p === "");
                    
                    if (firstEmptyIdx !== -1) {
                      current[firstEmptyIdx] = now;
                    } else {
                      current.push(now);
                    }
                    
                    updateAndSavePunches(current);
                  }}
                >
                  {fetcher.state !== "idle" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> SALVANDO...
                    </>
                  ) : (
                    <>
                      <Clock size={16} /> {isEntry ? "REGISTRAR ENTRADA" : "REGISTRAR INTERVALO / SAÍDA"}
                    </>
                  )}
                </button>
              );
            })()}
          </div>
        </div>

        {/* STATS GRID */}
        <div className="home-stats-grid">
          
          {/* STAT BOX 1: JORNADA DE HOJE */}
          <div className="home-stat-box">
            <div className="home-stat-header">JORNADA DE HOJE</div>
            <div className="home-stat-value font-mono">
              {currentResults.totalWorked || "00:00"}
            </div>
            
            <div className="home-stat-meta-row">
              <span className="home-stat-meta-label">Meta diária:</span>
              <div className="home-goal-input-wrapper">
                <input 
                  type="text"
                  inputMode="numeric"
                  value={dailyGoal}
                  maxLength={5}
                  onChange={(e) => setDailyGoal(formatTimeInput(e.target.value))}
                  className="home-goal-inline-input font-mono"
                  placeholder="08:00"
                  data-bwignore="true"
                />
                <Clock size={10} className="home-goal-inline-icon" />
              </div>
            </div>

            <div className="home-progress-bar-container">
              <div 
                className="home-progress-bar" 
                style={{ width: `${Math.min(100, (currentResults.workMins / (timeToMinutes(dailyGoal) || 480)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* STAT BOX 2: SALDO DO DIA */}
          <div className="home-stat-box">
            <div className="home-stat-header">SALDO DO DIA</div>
            <div className={`home-stat-value font-mono ${currentResults.isOvertime ? 'overtime' : 'missing'}`}>
              {currentResults.overtime || "00:00"}
            </div>
            
            <div className="home-stat-meta-row">
              <span className="home-stat-meta-label">
                {currentResults.isOvertime ? "Banco de Horas Positivo" : "Horas faltantes para jornada"}
              </span>
            </div>

            <div className="home-progress-bar-container">
              <div 
                className={`home-progress-bar ${currentResults.isOvertime ? 'success' : 'warning'}`} 
                style={{ 
                  width: `${currentResults.isOvertime 
                    ? 100 
                    : Math.min(100, (currentResults.workMins / (timeToMinutes(dailyGoal) || 480)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* TIMELINE DE BATIDAS - Ocupa as 2 colunas */}
          <div className="home-stat-box timeline-box">
            <div className="home-stat-header">BATIDAS REGISTRADAS HOJE</div>
            
            <div className="home-punch-timeline-container">
              <div className="home-punch-timeline">
                {punchesWithEmpty.map((p, idx) => {
                  const isEntry = idx % 2 === 0;
                  const isEmpty = p === "";
                  
                  let isInvalid = false;
                  let errorMessage = "";
                  
                  if (!isEmpty && p.length === 5) {
                    const currentMins = timeToMinutes(p);
                    if (idx > 0) {
                      const prevVal = punchesWithEmpty[idx - 1];
                      if (prevVal && prevVal.length === 5) {
                        const prevMins = timeToMinutes(prevVal);
                        if (currentMins <= prevMins) {
                          isInvalid = true;
                          errorMessage = isEntry ? "Menor que anterior" : "Saída ≤ Entrada";
                        }
                      }
                    }
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`home-punch-node ${isInvalid ? 'invalid' : ''} ${isEmpty ? 'empty' : ''}`}
                    >
                      <div className="home-node-circle-container">
                        <div className="home-node-line-left"></div>
                        <div className="home-node-circle"></div>
                        <div className="home-node-line-right"></div>
                      </div>
                      
                      <div className="home-node-content">
                        <div className="home-node-input-wrapper">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="HH:MM"
                            value={p}
                            maxLength={5}
                            onChange={e => updatePunch(idx, formatTimeInput(e.target.value))}
                            className={`home-node-input font-mono ${isInvalid ? 'invalid' : ''}`}
                            data-bwignore="true"
                          />
                          {!isEmpty && (
                            <button 
                              type="button"
                              onClick={() => {
                                const copy = [...punches];
                                copy.splice(idx, 1);
                                updateAndSavePunches(copy);
                              }} 
                              className="home-node-clear-btn"
                              title="Remover batida"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="home-node-label">
                          {isEmpty ? "Aguardando" : (isEntry ? "Entrada" : "Saída")}
                        </div>
                        {isInvalid && (
                          <span className="home-node-error-badge">
                            {errorMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Sugestão de Saída se houver batidas */}
            {currentResults.firstEntryMins !== -1 && (
              <div className="home-sugestao-saida-row font-mono">
                SUGESTÃO DE SAÍDA: {minutesToHHMM(currentResults.firstEntryMins + timeToMinutes(dailyGoal) + currentResults.totalBreakMins)}
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

```

### LoginView.tsx
```tsx
import { useState } from "react";
import { Form, useNavigation } from "react-router";
import {User, Lock, LogIn, UserPlus, Loader2, AlertCircle, Clock } from "lucide-react";

interface LoginViewProps {
  actionData: any;
}

export function LoginView({ actionData }: LoginViewProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Clock size={32} />
          </div>
          <h1>{isRegistering ? "Criar Conta" : "Entrar no Ponto"}</h1>
          <p>{isRegistering ? "Registre-se para começar a marcar seu ponto" : "Bem-vindo de volta! Acesse sua conta"}</p>
        </div>

        {actionData?.error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{actionData.error}</span>
          </div>
        )}

        <Form method="post" className="login-form">
          <input type="hidden" name="_action" value={isRegistering ? "register" : "login"} />

          {isRegistering && (
            <div className="input-field">
              <User size={18} />
              <input type="text" id="name-input" name="name" placeholder="Seu Nome Completo" autoComplete="name" required />
            </div>
          )}

          <div className="input-field">
            <User size={18} />
            <input type="text" id="username-input" name="username" placeholder="Nome de Usuário" autoComplete="username" required />
          </div>

          <div className="input-field">
            <Lock size={18} />
            <input type="password" id="password-input" name="password" placeholder="Sua Senha" autoComplete={isRegistering ? "new-password" : "current-password"} required />
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : isRegistering ? (
              <><UserPlus size={18} /> Criar Conta</>
            ) : (
              <><LogIn size={18} /> Entrar</>
            )}
          </button>
        </Form>

        <div className="login-footer">
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Crie agora"}
          </button>
        </div>
      </div>
    </div>
  );
}

```

### ManagementView.tsx
```tsx
import { useState, useRef, useEffect } from "react";
import { Users, Plus, Edit3, Layers, ShieldCheck, ChevronRight, UserPlus, Trash2, Lock, Key } from "lucide-react";
import { useFetcher } from "react-router";
import { Modal } from "../components/Modal";
import { Avatar } from "../components/Avatar";
import "../styles/management.css";

interface ManagementViewProps {
  teams: any[];
  users: any[];
}

export function ManagementView({ teams, users }: ManagementViewProps) {
  const fetcher = useFetcher();

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const currentUser = users.find(u => u.id === editingUserId);
  const teamFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setPasswordFeedback(null);
  }, [editingUserId]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        teamFormRef.current?.reset();
      }
      
      const action = fetcher.data?.action;
      if (action === "deleteUser" && fetcher.data?.success) {
        setEditingUserId(null);
      } else if (action === "changePassword") {
        if (fetcher.data?.success) {
          passwordFormRef.current?.reset();
          setPasswordFeedback({ success: true, message: fetcher.data?.message });
        } else if (fetcher.data?.error) {
          setPasswordFeedback({ success: false, error: fetcher.data?.error });
        }
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="page-shell">
      <div className="page-topbar">
        <div className="page-topbar-left">
          <h1 className="page-title">Gestão de Usuários</h1>
        </div>
        <div className="page-topbar-right">
          <button className="action-btn" onClick={() => setIsTeamModalOpen(true)}>
            <Plus size={16} /> Gerenciar Equipes
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="page-main">
          <div className="users-grid">
          {users.map(u => (
            <div key={u.id} className="user-grid-card clickable-card" onClick={() => setEditingUserId(u.id)}>
              <div className="user-grid-header">
                <Avatar src={u.avatarUrl} name={u.name} size={48} style={{ borderRadius: '50%' }} />
              </div>
              <div className="user-grid-info">
                <h3 className="user-grid-name">{u.name}</h3>
                <span className="user-grid-username">@{u.username}</span>
              </div>
              <div className="user-grid-badges">
                <span className={u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}>
                  {u.role === 'admin' ? 'Admin' : 'Usuário'}
                </span>
                {u.teamName && (
                  <span className="badge-team-primary">
                    {u.teamName}
                  </span>
                )}
                {(u.userTeams || []).map((ut: any) => (
                  <span key={ut.teamId} className={ut.role === 'manager' ? 'badge-team-manager' : 'badge-team-employee'}>
                    {ut.teamName}{ut.role === 'manager' ? ' · Ger.' : ''}
                  </span>
                ))}
                {!u.teamId && (!u.userTeams || u.userTeams.length === 0) && (
                  <span className="badge-team-empty">Sem equipe</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Gerenciar Equipes" icon={<Layers size={28} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="settings-section">
            <div className="settings-section-header">
              <h3 className="settings-section-title">Criar Nova Equipe</h3>
              <p className="settings-section-desc">Adicione novos departamentos ou times ao sistema.</p>
            </div>
            <fetcher.Form method="post" ref={teamFormRef}>
              <input type="hidden" name="_action" value="createTeam" />
              <div className="settings-card">
                <div className="settings-card-row">
                  <input type="text" name="name" required placeholder="Nome da equipe (ex: Financeiro)" className="settings-input" />
                  <button type="submit" className="settings-btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    {fetcher.state === "submitting" && fetcher.formData?.get("_action") === "createTeam" ? "Criando..." : "Criar Equipe"}
                  </button>
                </div>
              </div>
            </fetcher.Form>
          </div>

          <div className="settings-section">
            <div className="settings-section-header">
              <h3 className="settings-section-title">Equipes Atuais</h3>
              <p className="settings-section-desc">Gerencie as equipes existentes. A exclusão removerá os usuários destas equipes.</p>
            </div>
            <div className="settings-card">
              {teams.map(t => (
                <div key={t.id} className="settings-card-row">
                  <span className="team-list-name" style={{ fontWeight: 500 }}>{t.name}</span>
                  <fetcher.Form method="post" onSubmit={(e) => !confirm(`Tem certeza que deseja excluir a equipe "${t.name}" permanentemente?`) && e.preventDefault()} className="form-no-margin">
                    <input type="hidden" name="_action" value="deleteTeam" /><input type="hidden" name="teamId" value={t.id} />
                    <button type="submit" className="btn-icon-subtle" title="Excluir equipe"><Trash2 size={16} /></button>
                  </fetcher.Form>
                </div>
              ))}
              {teams.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  Nenhuma equipe cadastrada.
                </div>
              )}
            </div>
          </div>

        </div>
      </Modal>

      <Modal isOpen={!!editingUserId} onClose={() => setEditingUserId(null)} title="Editar Acesso" icon={<ShieldCheck size={28} />}>
        {currentUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Equipes e Cargos Section */}
            <div className="settings-section">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Equipes e Cargos</h3>
                <p className="settings-section-desc">Gerencie o nível de acesso e as equipes do usuário.</p>
              </div>
              <div className="settings-card">
                {currentUser.teamId && currentUser.teamName && (
                  <div className="settings-card-row" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <fetcher.Form method="post" className="form-no-margin" style={{ flex: 1 }}>
                        <input type="hidden" name="_action" value="updatePrimaryTeam" /><input type="hidden" name="userId" value={currentUser.id} />
                        <select name="teamId" defaultValue={currentUser.teamId} onChange={(e) => fetcher.submit(e.currentTarget.form)} className="settings-select" style={{ maxWidth: '200px' }}>
                          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </fetcher.Form>
                      <span className="user-team-primary-badge">Principal</span>
                    </div>
                    <fetcher.Form method="post" className="form-no-margin">
                      <input type="hidden" name="_action" value="removePrimaryTeam" /><input type="hidden" name="userId" value={currentUser.id} />
                      <button type="submit" className="btn-icon-subtle" title="Remover equipe principal"><Trash2 size={16} /></button>
                    </fetcher.Form>
                  </div>
                )}
                
                {(currentUser.userTeams || []).map((ut: any) => (
                  <div key={ut.teamId} className="settings-card-row">
                    <span className="team-list-name">{ut.teamName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <fetcher.Form method="post" className="form-no-margin">
                        <input type="hidden" name="_action" value="updateUserTeamRole" /><input type="hidden" name="userId" value={currentUser.id} /><input type="hidden" name="teamId" value={ut.teamId} />
                        <select name="role" defaultValue={ut.role} onChange={(e) => fetcher.submit(e.currentTarget.form)} className="settings-select">
                          <option value="employee">Funcionário</option><option value="manager">Gerente</option>
                        </select>
                      </fetcher.Form>
                      <fetcher.Form method="post" className="form-no-margin">
                        <input type="hidden" name="_action" value="removeUserTeam" /><input type="hidden" name="userId" value={currentUser.id} /><input type="hidden" name="teamId" value={ut.teamId} />
                        <button type="submit" className="btn-icon-subtle" title="Remover equipe"><Trash2 size={16} /></button>
                      </fetcher.Form>
                    </div>
                  </div>
                ))}
                
                {!currentUser.teamId && (currentUser.userTeams || []).length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Nenhuma equipe vinculada.
                  </div>
                )}

                <div className="settings-card-footer">
                  <fetcher.Form method="post" style={{ width: '100%', display: 'flex', gap: '8px' }}>
                    <input type="hidden" name="_action" value="addUserTeam" /><input type="hidden" name="userId" value={currentUser.id} />
                    <select name="teamId" className="settings-select" style={{ flex: 1 }}>
                      <option value="">+ Adicionar equipe...</option>
                      {teams.filter(t => t.id !== currentUser.teamId && !(currentUser.userTeams || []).some((ut: any) => ut.teamId === t.id)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select name="role" className="settings-select" style={{ width: '130px' }}><option value="employee">Funcionário</option><option value="manager">Gerente</option></select>
                    <button type="submit" className="settings-btn-primary" style={{ padding: '6px 12px' }}>Add</button>
                  </fetcher.Form>
                </div>
              </div>
            </div>

            {/* Segurança Section */}
            <div className="settings-section">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Segurança</h3>
                <p className="settings-section-desc">Defina uma nova senha para este acesso.</p>
              </div>
              <fetcher.Form method="post" ref={passwordFormRef}>
                <input type="hidden" name="_action" value="changePassword" /><input type="hidden" name="userId" value={currentUser.id} />
                <div className="settings-card">
                  <div className="settings-card-row">
                    <input type="password" id="newPassword" name="newPassword" placeholder="Nova senha (mín. 4 caracteres)" autoComplete="new-password" required className="settings-input" />
                    <button type="submit" className="settings-btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      {fetcher.state === "submitting" && fetcher.formData?.get("_action") === "changePassword" ? "Salvando..." : "Alterar Senha"}
                    </button>
                  </div>
                  {(passwordFeedback?.error || passwordFeedback?.success) && (
                    <div className="settings-card-row" style={{ paddingTop: '8px', paddingBottom: '8px', background: 'rgba(0,0,0,0.2)' }}>
                      {passwordFeedback?.error && <p className="password-feedback-error" style={{ margin: 0 }}>{passwordFeedback.error}</p>}
                      {passwordFeedback?.success && passwordFeedback?.message && <p className="password-feedback-success" style={{ margin: 0 }}>{passwordFeedback.message}</p>}
                    </div>
                  )}
                </div>
              </fetcher.Form>
            </div>

            {/* Danger Zone */}
            <div className="settings-section danger-zone">
              <div className="danger-zone-content">
                <div className="settings-section-header">
                  <h3 className="settings-section-title" style={{ color: '#ef4444' }}>Excluir Conta</h3>
                  <p className="settings-section-desc">Esta ação é irreversível e removerá todos os dados e o acesso deste usuário.</p>
                </div>
                <fetcher.Form method="post" onSubmit={(e) => !confirm("Excluir usuário permanentemente?") && e.preventDefault()}>
                  <input type="hidden" name="_action" value="deleteUser" /><input type="hidden" name="userId" value={currentUser.id} />
                  <button type="submit" className="danger-btn">
                    Excluir Usuário
                  </button>
                </fetcher.Form>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}

```

### ProfileView.tsx
```tsx
import { useState, useRef } from "react";
import { User as UserIcon, LogOut, Save, Clock, Camera, Loader2, Briefcase, Layers, ChevronRight, ShieldCheck } from "lucide-react";
import { useFetcher, Form } from "react-router";
import { Avatar } from "../components/Avatar";
import "../styles/profile.css";

interface ProfileViewProps {
  user: any;
  team: { name: string } | null;
}

export function ProfileView({ user, team }: ProfileViewProps) {
  const fetcher = useFetcher();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [goal, setGoal] = useState(user.goal || "08:00");
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 120;
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          }
          
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          
          setAvatarPreview(compressedBase64);
          fetcher.submit(
            { action: "updateAvatar", avatar: compressedBase64 },
            { method: "post" }
          );
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-shell">

      <div className="page-content">
        <div className="page-main">
          
          <div className="profile-container">
            {/* HERO SECTION */}
            <div className="profile-hero">
              <div className="profile-avatar-wrapper">
                <Avatar 
                  src={avatarPreview} 
                  name={user.name} 
                  size={100} 
                  style={{ borderRadius: '50%' }}
                />
                <button className="profile-camera-btn" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <input 
                type="text" 
                defaultValue={user.name}
                onBlur={(e) => {
                  if (e.target.value !== user.name) {
                    fetcher.submit({ action: "updateName", name: e.target.value }, { method: "post" });
                  }
                }}
                className="profile-name-input"
              />
              <span className="profile-username">@{user.username}</span>
              
              <div className={`profile-badge ${user.role === 'admin' ? 'admin' : ''}`}>
                {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
              </div>
            </div>

            {/* CONTENT GRID */}
            <div className="profile-content-grid">
              
              {/* EQUIPES */}
              <div className="profile-card">
                <h3 className="profile-card-title">
                  <ShieldCheck size={20} /> Equipes e Acessos
                </h3>
                <div className="team-list">
                  {team && (
                    <div className="team-item primary">
                      <div className="team-icon">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="team-info">
                        <span className="team-name">{team.name}</span>
                        <span className="team-role">Principal</span>
                      </div>
                    </div>
                  )}
                  {(user.userTeams || []).map((ut: any) => (
                    <div key={ut.teamId} className="team-item">
                      <div className="team-icon">
                        <Layers size={24} />
                      </div>
                      <div className="team-info">
                        <span className="team-name">{ut.teamName}</span>
                        <span className="team-role">{ut.role === 'manager' ? 'Gerente' : 'Membro'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADMIN */}
              {user.role === 'admin' && (
                <div className="profile-card admin-card">
                  <h3 className="profile-card-title">
                    <Briefcase size={20} /> Administração
                  </h3>
                  <p className="admin-desc">
                    Acesso restrito ao painel de gestão do sistema. Gerencie usuários, configurações e logs do Chronos.
                  </p>
                  <a href="/gestao" className="admin-btn">
                    Painel Gestão <ChevronRight size={18} />
                  </a>
                </div>
              )}

            </div>

            {/* DANGER ZONE */}
            <div className="profile-danger-zone">
              <Form action="/logout" method="post">
                <button className="btn-logout">
                  <LogOut size={16} /> Encerrar Sessão
                </button>
              </Form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

```

### SimuladorView.tsx
```tsx
import { useState, useMemo, useEffect } from "react";
import { Calculator, RefreshCcw, TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";
import { timeToMinutes, minutesToTime, minutesToHHMM, formatTimeInput } from "../utils/time";
import "../styles/simulador.css";

interface SimDay {
  id: string;
  name: string;
  start: string;
  end: string;
  break: string;
  goal: string;
}

interface SimuladorViewProps {
  userGoal: string;
  userId: string;
}

export function SimuladorView({ userGoal, userId }: SimuladorViewProps) {
  const initialDays: SimDay[] = [
    { id: "seg", name: "Segunda", start: "08:00", end: "18:00", break: "02:00", goal: "08:00" },
    { id: "ter", name: "Terça", start: "08:00", end: "18:00", break: "02:00", goal: "08:00" },
    { id: "qua", name: "Quarta", start: "08:00", end: "18:00", break: "02:00", goal: "08:00" },
    { id: "qui", name: "Quinta", start: "08:00", end: "18:00", break: "02:00", goal: "08:00" },
    { id: "sex", name: "Sexta", start: "08:00", end: "18:00", break: "02:00", goal: "08:00" },
    { id: "sab", name: "Sábado", start: "08:00", end: "12:00", break: "00:00", goal: "04:00" },
    { id: "dom", name: "Domingo", start: "00:00", end: "00:00", break: "00:00", goal: "00:00" },
  ];

  const [days, setDays] = useState<SimDay[]>(initialDays);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `ponto_simulador_dados_${userId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setDays(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados salvos do simulador", e);
      }
    } else {
      setDays(initialDays);
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(days));
    }
  }, [days, isLoaded, storageKey]);

  const handleReset = () => {
    localStorage.removeItem(storageKey);
    setDays(initialDays);
  };

  const updateField = (id: string, field: keyof SimDay, value: string) => {
    const formatted = formatTimeInput(value);
    setDays(prev => prev.map(d => d.id === id ? { ...d, [field]: formatted } : d));
  };

  const results = useMemo(() => {
    const daily = days.map(d => {
      const inputs = [d.start, d.end].filter(p => p.trim() !== "");
      const isComplete = inputs.length === 2;
      
      const s = timeToMinutes(d.start);
      const e = timeToMinutes(d.end);
      const b = timeToMinutes(d.break);
      const g = timeToMinutes(d.goal);
      const worked = (e > s) ? (e - s - b) : 0;
      const diff = isComplete ? (worked - g) : 0;
      return { ...d, worked, diff, isActive: inputs.length > 0 };
    });

    const totalDiff = daily.reduce((acc, d) => acc + d.diff, 0);
    const totalGoal = daily.filter(d => d.isActive).reduce((acc, d) => acc + timeToMinutes(d.goal), 0);
    const totalWorked = daily.reduce((acc, d) => acc + d.worked, 0);
    const hasNegative = totalDiff < 0;

    return { daily, totalDiff, totalGoal, totalWorked, hasNegative };
  }, [days]);

  const suggestion = useMemo(() => {
    if (results.totalDiff === 0) return null;
    const value = Math.abs(results.totalDiff);
    const targetDays = results.daily.filter(d => d.isActive && d.diff === 0 && d.worked > 0);
    if (targetDays.length === 0) return null;
    const perDay = Math.ceil(value / targetDays.length);
    const timeStr = minutesToTime(perDay);
    
    if (results.totalDiff < 0) {
      return `Recomendação: Trabalhe +${timeStr} nos ${targetDays.length} dias restantes.`;
    } else {
      return `Recomendação: Você pode sair ${timeStr} mais cedo nos próximos ${targetDays.length} dias.`;
    }
  }, [results]);

  return (
    <div className="container simulador-container">
      <div className="card simulador-card">
        <div className="header simulador-header">
          <div>
            <h1>Simulador</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={handleReset} title="Resetar"><RefreshCcw size={18} /></button>
          </div>
        </div>

        {suggestion && (
          <div className="suggestion-top-banner">
            <Lightbulb size={16} color="var(--primary)" />
            <span>{suggestion}</span>
          </div>
        )}

        <div className="sim-content">
          <div className="sim-thead-final">
            <span>Dia</span>
            <span>Meta</span>
            <span>Entrada</span>
            <span>Saída</span>
            <span>Almoço</span>
            <span>Saldo</span>
          </div>

          <div className="sim-rows-final">
            {results.daily.map((d) => (
              <div key={d.id} className={`sim-day-row-final ${d.isActive ? 'active' : ''}`}>
                <div className="day-header-mob">
                  <strong>{d.name}</strong>
                  <span className={`day-res-mob ${d.diff > 0 ? 'pos' : d.diff < 0 ? 'neg' : ''}`}>
                  {d.diff !== 0 ? `${d.diff > 0 ? '+' : '-'}${minutesToHHMM(Math.abs(d.diff))}` : '00:00'}
                  </span>
                </div>

                <div className="col-name desktop-only"><strong>{d.name}</strong></div>
                <div className="day-field goal"><label className="mob-label">Meta</label><input value={d.goal} onChange={e => updateField(d.id, 'goal', e.target.value)} maxLength={5} data-bwignore="true" /></div>
                <div className="day-field"><label className="mob-label">Entrada</label><input placeholder="--:--" value={d.start} onChange={e => updateField(d.id, 'start', e.target.value)} maxLength={5} data-bwignore="true" /></div>
                <div className="day-field"><label className="mob-label">Saída</label><input placeholder="--:--" value={d.end} onChange={e => updateField(d.id, 'end', e.target.value)} maxLength={5} data-bwignore="true" /></div>
                <div className="day-field"><label className="mob-label">Almoço</label><input placeholder="00:00" value={d.break} onChange={e => updateField(d.id, 'break', e.target.value)} maxLength={5} data-bwignore="true" /></div>
                <div className={`col-res-final desktop-only ${d.diff > 0 ? 'pos' : d.diff < 0 ? 'neg' : ''}`}>
                  {d.diff !== 0 ? `${d.diff > 0 ? '+' : '-'}${minutesToHHMM(Math.abs(d.diff))}` : '00:00'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sim-footer-compact-final">
          <div className="footer-panel-compact">
            <div className="balance-compact">
              <span className="balance-label">Saldo Semanal</span>
              <div className={`balance-value ${results.hasNegative ? 'neg' : results.totalDiff > 0 ? 'pos' : ''}`}>
                {results.totalDiff !== 0 && (results.hasNegative ? <TrendingDown size={20} /> : <TrendingUp size={20} />)}
                {results.totalDiff === 0 ? '00:00' : `${results.totalDiff > 0 ? '+' : '-'}${minutesToHHMM(Math.abs(results.totalDiff))}`}
              </div>
            </div>

            <div className="stats-compact">
              <div className="stat-item">Meta: <strong>{minutesToHHMM(results.totalGoal)}</strong></div>
              <div className="stat-item">Real: <strong>{minutesToHHMM(results.totalWorked)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

