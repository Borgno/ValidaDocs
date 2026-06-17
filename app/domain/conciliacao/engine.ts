import Fuse from "fuse.js";

// SRP: Tipagem rigorosa para isolar a estrutura.
export interface ExcelRow {
  Nome: string;
  Valor_Pago: number;
  CTE: string;
}

export interface ConciliacaoResult {
  success: boolean;
  newFileName: string;
  extractedName?: string;
  extractedValue?: number;
  matchedCte?: string;
  errorMessage?: string;
}

// Palavras de ruído comuns na nomenclatura empresarial brasileira
const STOP_WORDS = ["LTDA", "LTD", "ME", "SA", "S/A", "CIA", "DE", "DA", "DO", "E",
  "TRANSPORTE", "TRANSPORTES", "LOGISTICA", "LOG", "EXPRESS", "EXPRESSO"];

function sanitizarNome(nome: string): string {
  return String(nome)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\/\\:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizarParaBusca(nome: string): string {
  return String(nome)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.includes(w))
    .join(" ")
    .trim();
}

/**
 * Função Pura: Recebe o texto de UMA única página do PDF e as linhas mapeadas do Excel.
 * Motor de conciliação usando Fuse.js (fuzzy search) como motor de matching nominal,
 * com pré-filtro por valor financeiro exato para máxima precisão.
 */
export function processConciliacaoLogic(
  pdfText: string,
  excelData: ExcelRow[]
): ConciliacaoResult {
  const nameRegex = /Nome Destinat\u00e1rio:\s*(.+)/i;
  const valueRegex = /Valor Total \(R\$\):\s*([\d\.,]+)/i;

  const nameMatch = pdfText.match(nameRegex);
  const valueMatch = pdfText.match(valueRegex);

  if (!nameMatch || !valueMatch) {
    return {
      success: false,
      newFileName: "Erro de Leitura.pdf",
      errorMessage: "Padrão de Nome ou Valor não encontrado na página.",
    };
  }

  const extractedName = nameMatch[1].trim();
  const rawValue = valueMatch[1].replace(/\./g, "").replace(",", ".");
  const extractedValue = parseFloat(rawValue);

  // --- ESTÁGIO 1: Filtro de precisão por valor financeiro ---
  // O valor monetário quebrado funciona como chave primária, eliminando 99% da planilha
  const candidatosPorValor = excelData.filter(row => {
    const valorXLS = row.Valor_Pago;
    return (
      !isNaN(extractedValue) &&
      !isNaN(valorXLS) &&
      Math.abs(extractedValue - valorXLS) < 0.01
    );
  });

  if (candidatosPorValor.length === 0) {
    return {
      success: false,
      newFileName: `Nao encontrado - ${sanitizarNome(extractedName)}.pdf`,
      extractedName,
      extractedValue,
      errorMessage: "Nenhum registro com o Valor exato foi encontrado no Excel.",
    };
  }

  // Caso único: aceita diretamente sem precisar de fuzzy
  if (candidatosPorValor.length === 1) {
    const candidato = candidatosPorValor[0];
    const cte = candidato.CTE ? String(candidato.CTE).trim().replace("/", "-") : "SEM_CTE";
    return {
      success: true,
      newFileName: `comprovante pag CTE ${sanitizarNome(cte)}.pdf`,
      extractedName,
      extractedValue,
      matchedCte: cte,
    };
  }

  // --- ESTÁGIO 2: Fuzzy matching nominal com Fuse.js ---
  // Normaliza os candidatos removendo stop words para maximizar a precisão
  const candidatosNormalizados = candidatosPorValor.map(row => ({
    ...row,
    _nomeNormalizado: normalizarParaBusca(row.Nome),
  }));

  const fuse = new Fuse(candidatosNormalizados, {
    keys: ["_nomeNormalizado"],
    // threshold: 0 = match perfeito, 1 = qualquer coisa.
    // 0.4 é suficiente para cobrir variações de Nome Fantasia vs Razão Social
    threshold: 0.4,
    // ignoreLocation garante que o match não dependa de onde a palavra aparece na string
    ignoreLocation: true,
    // minMatchCharLength exige que pelo menos 3 chars da query façam match
    minMatchCharLength: 3,
    // includeScore para podermos inspecionar a confiança
    includeScore: true,
  });

  const queryNormalizada = normalizarParaBusca(extractedName);
  const resultados = fuse.search(queryNormalizada);

  if (resultados.length > 0) {
    // O Fuse.js retorna o score invertido: 0 = perfeito, 1 = péssimo
    const melhor = resultados[0];
    const candidato = melhor.item;
    const cte = candidato.CTE ? String(candidato.CTE).trim().replace("/", "-") : "SEM_CTE";

    return {
      success: true,
      newFileName: `comprovante pag CTE ${sanitizarNome(cte)}.pdf`,
      extractedName,
      extractedValue,
      matchedCte: cte,
    };
  }

  return {
    success: false,
    newFileName: `Nao encontrado - ${sanitizarNome(extractedName)}.pdf`,
    extractedName,
    extractedValue,
    errorMessage: `O valor bate, mas Fuse.js não encontrou similaridade nominal suficiente (query: "${queryNormalizada}").`,
  };
}
