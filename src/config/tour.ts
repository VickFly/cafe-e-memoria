/**
 * CONFIGURAÇÃO CENTRAL DO TOUR
 * ------------------------------------------------------------
 * Edite APENAS este arquivo para trocar os nomes dos guias,
 * data, horário ou ponto de encontro. Todos os componentes
 * (tela inicial, avaliação dos guias, painel e CSV) leem daqui.
 */
export const tourConfig = {
  nome: 'Café & Memória',
  slogan: 'Uma viagem pela história do café em São Paulo.',
  instituicao: 'Universidade de São Paulo (USP)',
  data: '7 de novembro de 2026',
  dataISO: '2026-11-07',
  horario: '13h às 15h',
  pontoEncontro: 'Estação da Luz',

  /** Troque pelos nomes reais dos guias. */
  guias: ['Lilian', 'Renata', 'Sara', 'Amanda', 'Lavinia', 'João', 'Aline'],
} as const

export const guiasTexto = (guias: readonly string[] = tourConfig.guias) =>
  guias.length <= 1
    ? guias.join('')
    : `${guias.slice(0, -1).join(', ')} e ${guias[guias.length - 1]}`
