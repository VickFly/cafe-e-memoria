/** Perguntas e escalas do formulário. Ajuste textos aqui sem mexer nos componentes. */

export const rotulosNota = ['Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'] as const

export const criteriosGuias = [
  { id: 'clareza', label: 'Clareza das explicações' },
  { id: 'dominio', label: 'Domínio do conteúdo histórico' },
  { id: 'comunicacao', label: 'Comunicação e interação com o grupo' },
  { id: 'organizacao', label: 'Organização do percurso' },
  { id: 'interesse', label: 'Capacidade de despertar interesse pelo tema' },
] as const

export type CriterioGuiaId = (typeof criteriosGuias)[number]['id']

export const perguntasConteudo = [
  { id: 'compreensao', label: 'O conteúdo ajudou você a compreender a importância histórica do café para São Paulo?' },
  { id: 'interesse', label: 'As informações sobre os pontos visitados foram interessantes?' },
  { id: 'tempo', label: 'O tempo dedicado a cada parada foi adequado?' },
] as const

export type PerguntaConteudoId = (typeof perguntasConteudo)[number]['id']
export type RespostaSPN = 'sim' | 'parcialmente' | 'nao'

export const opcoesSPN: { valor: RespostaSPN; label: string }[] = [
  { valor: 'sim', label: 'Sim' },
  { valor: 'parcialmente', label: 'Parcialmente' },
  { valor: 'nao', label: 'Não' },
]

/**
 * Etapa "Você e os lugares": duas perguntas abertas (dissertativas).
 * As dicas sugerem caminhos sem induzir a resposta.
 */
export const perguntaRelacao = 'Como você se relaciona com os espaços visitados?'
export const ajudaRelacao = 'Você mora, trabalha ou estuda por perto? Já passava por esses lugares ou foi a primeira vez? Que lembranças eles trazem?'
export const perguntaPercepcao = 'A sua percepção desses lugares mudou após a visita?'
export const ajudaPercepcao = 'Algum desses espaços passou a ter outro significado para você? Conte o que mudou, ou por que continuou igual.'
export const LIMITE_LUGARES = 800
export const MINIMO_LUGARES = 3

export const LIMITE_MARCANTE = 1000
export const LIMITE_OPCIONAL = 600

export type Rascunho = {
  id: string
  nome: string
  email: string
  notaGeral: number | null
  notasGuias: Partial<Record<CriterioGuiaId, number>>
  conteudo: Partial<Record<PerguntaConteudoId, RespostaSPN>>
  recomendacao: number | null
  relacao: string
  percepcao: string
  marcante: string
  sugestao: string
  aprender: string
}

export type Avaliacao = Omit<Rascunho, 'notaGeral' | 'recomendacao' | 'notasGuias' | 'conteudo' | 'relacao' | 'percepcao'> & {
  notaGeral: number
  recomendacao: number
  /** Vazios em avaliações enviadas antes destas perguntas existirem. */
  relacao: string
  percepcao: string
  notasGuias: Record<CriterioGuiaId, number>
  conteudo: Record<PerguntaConteudoId, RespostaSPN>
  guias: string[]
  enviadoEm: string
}

export const novoRascunho = (): Rascunho => ({
  id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  nome: '',
  email: '',
  notaGeral: null,
  notasGuias: {},
  conteudo: {},
  recomendacao: null,
  relacao: '',
  percepcao: '',
  marcante: '',
  sugestao: '',
  aprender: '',
})

export const emailValido = (e: string) => e === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
