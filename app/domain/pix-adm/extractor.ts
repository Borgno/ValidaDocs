export function extractPixAdmData(text: string): string {
  // Regexes para capturar as informações solicitadas
  const dateMatch = text.match(/Realizado em:\s*(\d{2}\/\d{2}\/\d{4})/i);
  const nameMatch = text.match(/Nome do destinat[aá]rio:\s*(.+)/i);
  const valueMatch = text.match(/Valor:\s*R\$\s*([\d,\.]+)/i);

  let dateStr = "Data_Nao_Encontrada";
  if (dateMatch) {
    // Substitui as barras por hífens
    dateStr = dateMatch[1].replace(/\//g, "-");
  }

  let nameStr = "Nome_Nao_Encontrado";
  if (nameMatch) {
    // Remove espaços extras no final e limpa caracteres inválidos para nome de arquivo
    nameStr = nameMatch[1].trim().replace(/[<>:"/\\|?*]+/g, ""); 
  }

  let valueStr = "Valor_Nao_Encontrado";
  if (valueMatch) {
    valueStr = valueMatch[1].trim();
  }

  // Fallback para caso o arquivo venha sem nenhuma dessas informações e falhe
  if (!dateMatch && !nameMatch && !valueMatch) {
    return `PIX_ADM_NaoIdentificado_${Date.now()}.pdf`;
  }

  // Padrão solicitado: [DATA] - [NOME] - [VALOR].pdf
  return `${dateStr} - ${nameStr} - ${valueStr}.pdf`;
}
