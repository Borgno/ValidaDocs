/**
 * Extrai o nome do arquivo a partir da string crua do PDF.
 * SRP: Responsável unicamente pela transformação de string para um nome de arquivo válido.
 */
export function extractFatName(rawText: string): string {
  if (!rawText) {
    throw new Error("Payload de texto do PDF está vazio.");
  }
  
  const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
  
  if (lines.length < 2) {
    throw new Error("Formato inválido: Impossível realizar a leitura da segunda linha (índice 1).");
  }

  const rawName = lines[1];
  
  // Sanitização base para evitar Injection paths e espaços incorretos via Storage
  const sanitized = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim();
  
  return `${sanitized}.pdf`;
}
