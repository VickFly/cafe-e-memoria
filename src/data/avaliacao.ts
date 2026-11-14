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

/** Etapa "Você e os lugares" */
export const perguntaRelacao = 'Como você se relaciona com os espaços visitados?'
export const perguntaPercepcao = 'A sua percepção desses lugares mudou após a visita?'

export type RelacaoEspacos = 'cotidiano' | 'conhecia' | 'primeira'

export const opcoesRelacao: { valor: RelacaoEspacos; label: string; detalhe: string }[] = [
  { valor: 'cotidiano', label: 'Fazem parte do meu dia a dia', detalhe: 'Passo, trabalho ou estudo por ali' },
  { valor: 'conhecia', label: 'Já conhecia, mas frequento pouco', detalhe: 'Vou de vez em quando' },
  { valor: 'primeira', label: 'Foi a minha primeira vez', detalhe: 'Conheci esses lugares no tour' },
]

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
  relacao: RelacaoEspacos | null
  percepcao: RespostaSPN | null
  marcante: string
  sugestao: string
  aprender: string
}

export type Avaliacao = Omit<Rascunho, 'notaGeral' | 'recomendacao' | 'notasGuias' | 'conteudo' | 'relacao' | 'percepcao'> & {
  notaGeral: number
  recomendacao: number
  /** Opcionais: avaliações enviadas antes destas perguntas existirem não têm esses campos. */
  relacao?: RelacaoEspacos
  percepcao?: RespostaSPN
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
  relacao: null,
  percepcao: null,
  marcante: '',
  sugestao: '',
  aprender: '',
})

export const emailValido = (e: string) => e === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
