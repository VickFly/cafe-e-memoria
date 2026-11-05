import { criteriosGuias, perguntasConteudo, rotulosNota, type Avaliacao } from '../data/avaliacao'

const media = (ns: number[]) => (ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0)

export function resumir(lista: Avaliacao[]) {
  const total = lista.length
  const geral = media(lista.map((a) => a.notaGeral))
  const distribuicao = rotulosNota.map((_, i) => lista.filter((a) => a.notaGeral === i + 1).length)
  const criterios = criteriosGuias
    .map((c) => ({ ...c, media: media(lista.map((a) => a.notasGuias?.[c.id]).filter((n): n is number => typeof n === 'number')) }))
    .sort((a, b) => b.media - a.media)
  const conteudo = perguntasConteudo.map((p) => {
    const cont = { sim: 0, parcialmente: 0, nao: 0 }
    lista.forEach((a) => { const v = a.conteudo?.[p.id]; if (v) cont[v]++ })
    return { ...p, ...cont }
  })
  const promotores = lista.filter((a) => a.recomendacao >= 9).length
  const detratores = lista.filter((a) => a.recomendacao <= 6).length
  const nps = total ? Math.round(((promotores - detratores) / total) * 100) : 0
  return { total, geral, distribuicao, criterios, conteudo, nps, promotores, detratores, mediaRecomendacao: media(lista.map((a) => a.recomendacao)) }
}

const esc = (v: unknown) => {
  const s = String(v ?? '')
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const rot = { sim: 'Sim', parcialmente: 'Parcialmente', nao: 'Não' } as const

/** CSV com ponto e vírgula e BOM UTF-8 (abre direto no Excel em português). */
export function gerarCSV(lista: Avaliacao[]) {
  const cab = [
    'Enviado em', 'Nome', 'E-mail', 'Guias', 'Nota geral',
    ...criteriosGuias.map((c) => `Guias: ${c.label}`),
    ...perguntasConteudo.map((p) => p.label),
    'Recomendação (0-10)', 'Parte mais marcante', 'Sugestão', 'Gostaria de ter aprendido',
  ]
  const linhas = lista.map((a) => [
    new Date(a.enviadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    a.nome, a.email, a.guias.join(', '), a.notaGeral,
    ...criteriosGuias.map((c) => a.notasGuias?.[c.id] ?? ''),
    ...perguntasConteudo.map((p) => (a.conteudo?.[p.id] ? rot[a.conteudo[p.id]] : '')),
    a.recomendacao, a.marcante, a.sugestao, a.aprender,
  ])
  return '﻿' + [cab, ...linhas].map((l) => l.map(esc).join(';')).join('\r\n')
}

export function baixarCSV(lista: Avaliacao[]) {
  const blob = new Blob([gerarCSV(lista)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `avaliacoes-cafe-e-memoria-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
