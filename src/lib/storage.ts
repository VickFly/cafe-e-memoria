import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Avaliacao } from '../data/avaliacao'

/**
 * Armazenamento das avaliações.
 *  - Modo SUPABASE: ativado quando VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY existem.
 *    Participantes só podem INSERIR; leitura exige login (ver supabase/schema.sql).
 *  - Modo LOCAL: sem credenciais, as avaliações ficam no localStorage DESTE aparelho.
 *    A interface informa isso claramente; nada é "enviado" para lugar nenhum.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null
export const modo: 'supabase' | 'local' = supabase ? 'supabase' : 'local'

const TABELA = 'avaliacoes'
const CHAVE_LOCAL = 'cafe-memoria:avaliacoes'

type Linha = {
  id: string
  nome: string
  email: string | null
  guias: string[]
  nota_geral: number
  notas_guias: Avaliacao['notasGuias']
  conteudo: Avaliacao['conteudo']
  recomendacao: number
  marcante: string
  sugestao: string | null
  aprender: string | null
  enviado_em: string
}

const paraLinha = (a: Avaliacao): Linha => ({
  id: a.id,
  nome: a.nome.trim(),
  email: a.email.trim() || null,
  guias: a.guias,
  nota_geral: a.notaGeral,
  notas_guias: a.notasGuias,
  conteudo: a.conteudo,
  recomendacao: a.recomendacao,
  marcante: a.marcante.trim(),
  sugestao: a.sugestao.trim() || null,
  aprender: a.aprender.trim() || null,
  enviado_em: a.enviadoEm,
})

const deLinha = (l: Linha): Avaliacao => ({
  id: l.id,
  nome: l.nome,
  email: l.email ?? '',
  guias: l.guias ?? [],
  notaGeral: l.nota_geral,
  notasGuias: l.notas_guias,
  conteudo: l.conteudo,
  recomendacao: l.recomendacao,
  marcante: l.marcante,
  sugestao: l.sugestao ?? '',
  aprender: l.aprender ?? '',
  enviadoEm: l.enviado_em,
})

export const lerLocal = <T,>(chave: string, padrao: T): T => {
  try {
    const v = localStorage.getItem(chave)
    return v ? (JSON.parse(v) as T) : padrao
  } catch {
    return padrao
  }
}

export const gravarLocal = (chave: string, valor: unknown) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export const removerLocal = (chave: string) => {
  try {
    localStorage.removeItem(chave)
  } catch {
    /* ignora */
  }
}

/** Envia uma avaliação. O id gerado no aparelho impede duplicatas (chave primária). */
export async function enviarAvaliacao(a: Avaliacao): Promise<void> {
  if (supabase) {
    // Sem .select(): o participante não tem permissão de leitura, só de inserção.
    const { error } = await supabase.from(TABELA).insert(paraLinha(a))
    if (error && error.code !== '23505') {
      throw new Error('Não foi possível enviar agora. Verifique sua conexão e tente novamente.')
    }
    return // 23505 = já existe: o envio anterior chegou, tratamos como sucesso.
  }
  const lista = lerLocal<Linha[]>(CHAVE_LOCAL, [])
  if (lista.some((l) => l.id === a.id)) return
  if (!gravarLocal(CHAVE_LOCAL, [...lista, paraLinha(a)])) {
    throw new Error('Este navegador não permitiu salvar a avaliação (modo privado ou armazenamento cheio).')
  }
}

/** Lista as avaliações. No modo Supabase exige usuário autenticado (RLS). */
export async function listarAvaliacoes(): Promise<Avaliacao[]> {
  if (supabase) {
    const { data, error } = await supabase.from(TABELA).select('*').order('enviado_em', { ascending: false })
    if (error) throw new Error('Não foi possível carregar as avaliações. Confira se você está logado com um usuário autorizado.')
    return (data as Linha[]).map(deLinha)
  }
  return lerLocal<Linha[]>(CHAVE_LOCAL, []).map(deLinha).reverse()
}
