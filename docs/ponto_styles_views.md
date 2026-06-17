# Análise de Estrutura: Estilos e Views do Projeto Ponto

Este documento contém a transcrição e explicação completa de toda a estrutura de estilos (CSS) e Views do projeto **Ponto**, detalhando a estética, as classes globais e o funcionamento dos componentes visuais ("Chronos Mono Blue").

## 1. Visão Geral da Estilização (app.css)

O arquivo `app.css` atua como o **Design System Base** do projeto Ponto. A interface utiliza um tema escuro moderno, baseado em tipografia limpa, elementos translúcidos (glassmorphism) e efeitos de brilho (glow).

### 1.1 Variáveis Globais (Root Tokens)
O tema, chamado de "Chronos Mono Blue", possui as seguintes cores e variáveis principais:
- **Cores Primárias**: `--primary: #0066ff;` (Azul vibrante), `--secondary: #0044cc;` (Azul escuro)
- **Backgrounds**: `--bg: #090b0e;` (Fundo geral muito escuro), `--card-bg: #0f1217;` (Fundo dos cards)
- **Efeitos e Bordas**: 
  - `--primary-glow: rgba(0, 102, 255, 0.12);`
  - `--glass-border: rgba(255, 255, 255, 0.08);`
- **Textos**: `--text: #f3f5f8;` (Branco/Gelo), `--text-muted: #8e99a7;` (Cinza claro)
- **Grid e Espaçamentos**: O sistema utiliza uma escala baseada em 8 pixels (`--space-1: 8px`, `--space-2: 16px`, etc).

### 1.2 Layout Base (Page Shell)
A aplicação adota um padrão de **Page Shell**:
- Fundo global com ruído (noise filter em base64) para dar textura, usando `::before` no body.
- Barra lateral oculta ou expansível (sidebar) usando posições fixas, navegação icônica e transições `cubic-bezier`.
- Cards com `backdrop-filter` (embora no mobile o blur seja removido por performance) e bordas sutis.

---

## 2. Views e Seus Respectivos Estilos

Abaixo está o detalhamento de cada pasta de views e como elas se comunicam com os estilos modulares.

### 2.1 Home / Dashboard Inicial (`home.css` e `HomeView.tsx`)
A página inicial utiliza um cartão herói (Hero Card) para destacar a principal funcionalidade.
- **Hero Clock Panel**: Mostra um relógio gigante `.home-clock-text` com `text-shadow` criando um efeito de brilho em azul: `text-shadow: 0 0 20px var(--primary-glow)`.
- **Botões interativos**: Os botões (ex: `.home-punch-btn`) utilizam transições rápidas (`0.2s cubic-bezier`) e mudam para um brilho intenso quando ativos.
- **Grids de Status**: Utiliza `.home-stats-grid` com tipografia monoespaçada (`JetBrains Mono`) para números de saldo ou horas.

### 2.2 Dashboard / Histórico (`dashboard.css` e `DashboardView.tsx`)
Esta seção é focada na exibição de dados e histórico de pontos.
- **Tabelas e Cards**: Usa `.dashboard-history-table` para listar itens, com efeitos de hover sutil (`rgba(255, 255, 255, 0.02)`).
- **Badges de Status**: Etiquetas pequenas (`.dashboard-status-badge`) para marcar dias como `overtime` (azul), `missing` (vermelho), `incomplete` (amarelo) ou `folga` (transparente).

### 2.3 Calendário e Agenda Semanal (`calendar.css`)
Os estilos focam muito na visualização em grid.
- **Calendário Main**: A malha do calendário `.calendar-day` ganha destaques pontuais e cores específicas quando interagida (`.calendar-day:hover`, `.selected`).
- **Linha do tempo diária**: Elementos como `.schedule-day-row` que ganham leve deslocamento (`transform: translateX(4px)`) ao passar o mouse.
- Avatares miniaturizados e empilhados com `z-index` flutuante para mostrar funcionários agendados.

### 2.4 Admin e Relatórios (`admin.css` e `AdminView.tsx`)
Painel dedicado ao gestor para relatórios de saldo consolidados.
- **Team Balance List**: Um grid `.team-balance-list` contendo os times e saldos das equipes, com avatares grandes (`.emp-avatar`) de 36x36px arredondados.
- Tags de Saldo: Cores vivas para saldo positivo (Verde `rgba(0, 208, 132, 0.12)`) e saldo devedor (Vermelho `rgba(255, 74, 90, 0.12)`).

### 2.5 Gestão de Equipe (`management.css` e `ManagementView.tsx`)
Interface voltada para administração de times.
- **Users Grid**: Sistema de grid flexível `.users-grid` para mostrar cartões modulares dos colaboradores.
- **Badges de Roles**: Diferentes classes (`.badge-role-admin`, `.badge-role-user`, `.badge-team-manager`) que estilizam o papel de cada colaborador utilizando backgrounds translúcidos e bordas sólidas coloridas para fácil identificação.

### 2.6 Perfil do Usuário (`profile.css` e `ProfileView.tsx`)
A página de perfil pessoal foca bastante no aspecto premium e individual.
- **Hero Header Premium**: O cabeçalho usa gradientes lineares transversais `linear-gradient(135deg, rgba(0, 85, 255, 0.2) 0%, rgba(0, 85, 255, 0.0) 100%)`.
- **Avatar e Foto**: Um container super arredondado e botão circular com ícone de câmera para alteração da foto, flutuando via `absolute`.

### 2.7 Escala Mensal (`escala.css` e `EscalaView.tsx`)
Organização da tabela de dias escalados.
- **Modais e Cards**: `.escala-modal-employee-card` para o colaborador, com interações que trazem sombra expandida (`box-shadow: 0 4px 20px rgba(...)`) indicando quando um empregado está ativamente escalado na data em questão.

### 2.8 Simulador de Banco de Horas (`simulador.css` e `SimuladorView.tsx`)
Layout mais funcional e "planilha-like" com foco em inputs numéricos.
- **Tabela Responsiva**: Classes `.sim-thead-final` escondidas no modo mobile, transformando-se em grids flexíveis `.sim-day-row-final` empilhados.
- **Inputs**: Campos numéricos vazados com borda translúcida que brilham ao focar `.day-field input:focus`.

---

## 3. Comportamento e Microinterações (UX)
O projeto Ponto brilha em pequenos detalhes:
1. **Glassmorphism Funcional**: Ao invés de borrar excessivamente o fundo, ele usa camadas translúcidas (`rgba(255,255,255, 0.05)`) sobrepostas, garantindo bom contraste.
2. **Fontes Específicas**: Uso massivo da `JetBrains Mono` em blocos numéricos (como relógio, saldo, datas), reforçando o aspecto "sistêmico" e "tecnológico", e tipografias Sans Serif para UI normal.
3. **Animações (Modais e Elementos)**: Modais (vide `app.css`) utilizam animações `modalIn` baseadas em translações (Y de 20px para 0) acopladas à curva `cubic-bezier(0.34, 1.56, 0.64, 1)`, gerando um leve efeito de rebote (bounce). O fundo sobrepõe um fade in padrão.
4. **Design Adaptativo**: A sidebar lateral no desktop vira um menu fixo na base (bottom bar) no mobile, reordenando o `page-shell`.

## Conclusão
A estrutura visual do projeto "Ponto" é altamente modular. O `app.css` fornece a espinha dorsal com os tokens de design globais, enquanto cada View correspondente (ex: `HomeView.tsx` usa `home.css`) acopla seus estilos contextuais, garantindo encapsulamento, facilidade de manutenção e consistência em tons azul neon e estética escura (Dark Mode).
