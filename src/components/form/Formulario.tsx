import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, HardDrive, Loader2, Lock, Send } from 'lucide-react'
import { guiasTexto, tourConfig } from '../../config/tour'
import {
  criteriosGuias, emailValido, LIMITE_MARCANTE, LIMITE_OPCIONAL, perguntasConteudo,
  type Avaliacao, type Rascunho,
} from '../../data/avaliacao'
import { enviarAvaliacao, modo } from '../../lib/storage'
import { Grao, Ramo } from '../brand/Ilustracoes'
import { AvaliacaoGraos, CampoTexto, EscalaNPS, EscolhaSPN, MensagemErro } from './Controles'

const etapas = ['Você', 'Experiência', 'Guias', 'Conteúdo', 'Comentários'] as const

type Props = {
  rascunho: Rascunho
  setRascunho: (f: (r: Rascunho) => Rascunho) => void
  etapa: number
  setEtapa: (n: number) => void
  onVoltarTrilha: () => void
  onEnviado: (a: Avaliacao) => void
}

type Erros = Record<string, string>

function validar(etapa: number, r: Rascunho): Erros {
  const e: Erros = {}
  if (etapa === 0) {
    if (r.nome.trim().length < 2) e.nome = 'Digite seu nome completo para identificarmos a avaliação.'
    if (!emailValido(r.email.trim())) e.email = 'Este e-mail parece incompleto. Confira ou deixe o campo em branco.'
  }
  if (etapa === 1 && !r.notaGeral) e.notaGeral = 'Escolha de 1 a 5 grãos para avaliar o tour.'
  if (etapa === 2) criteriosGuias.forEach((c) => { if (!r.notasGuias[c.id]) e[`g-${c.id}`] = 'Escolha uma nota de 1 a 5 grãos.' })
  if (etapa === 3) {
    perguntasConteudo.forEach((p) => { if (!r.conteudo[p.id]) e[`c-${p.id}`] = 'Escolha uma das opções.' })
    if (r.recomendacao === null) e.recomendacao = 'Escolha uma nota de 0 a 10.'
  }
  if (etapa === 4 && r.marcante.trim().length < 3) e.marcante = 'Conte em poucas palavras o que mais marcou você.'
  return e
}

export function Formulario({ rascunho: r, setRascunho, etapa, setEtapa, onVoltarTrilha, onEnviado }: Props) {
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [falha, setFalha] = useState<string | null>(null)
  const travaEnvio = useRef(false)
  const topo = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Rascunho>(k: K, v: Rascunho[K]) => {
    setRascunho((atual) => ({ ...atual, [k]: v }))
    setErros((e) => {
      const { [k as string]: _omit, ...resto } = e
      return resto
    })
  }

  useEffect(() => {
    topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    topo.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
  }, [etapa])

  const focarPrimeiroErro = (e: Erros) => {
    const chave = Object.keys(e)[0]
    if (!chave) return
    requestAnimationFrame(() => {
      const alvo = document.getElementById(`campo-${chave}`)
      alvo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      alvo?.querySelector<HTMLElement>('input, textarea, [role=radio][tabindex="0"]')?.focus({ preventScroll: true })
      if (alvo?.matches('input, textarea')) alvo.focus({ preventScroll: true })
    })
  }

  const avancar = () => {
    const e = validar(etapa, r)
    setErros(e)
    if (Object.keys(e).length) return focarPrimeiroErro(e)
    setEtapa(etapa + 1)
  }

  const voltar = () => (etapa === 0 ? onVoltarTrilha() : setEtapa(etapa - 1))

  const enviar = async () => {
    for (let i = 0; i <= 4; i++) {
      const e = validar(i, r)
      if (Object.keys(e).length) {
        setErros(e)
        if (i !== etapa) setEtapa(i)
        else focarPrimeiroErro(e)
        return
      }
    }
    if (travaEnvio.current) return
    travaEnvio.current = true
    setEnviando(true)
    setFalha(null)
    const avaliacao: Avaliacao = {
      ...r,
      notaGeral: r.notaGeral!,
      recomendacao: r.recomendacao!,
      notasGuias: r.notasGuias as Avaliacao['notasGuias'],
      conteudo: r.conteudo as Avaliacao['conteudo'],
      guias: [...tourConfig.guias],
      enviadoEm: new Date().toISOString(),
    }
    try {
      await enviarAvaliacao(avaliacao)
      onEnviado(avaliacao)
    } catch (err) {
      setFalha(err instanceof Error ? err.message : 'Não foi possível enviar agora. Tente novamente.')
      travaEnvio.current = false
      setEnviando(false)
    }
  }

  const progresso = ((etapa + 1) / etapas.length) * 100

  return (
    <section aria-labelledby="titulo-etapa" className="gutter min-h-[100dvh] pb-16 pt-6">
      <div ref={topo} className="mx-auto max-w-2xl scroll-mt-4">
        <div className="flex items-center justify-between gap-3">
          <button type="button" className="btn-texto text-sm" onClick={onVoltarTrilha}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Trilha
          </button>
          <span className="eyebrow tabular">Etapa {etapa + 1} de {etapas.length}</span>
        </div>

        <div className="mt-4" aria-hidden="true">
          <div className="h-2 overflow-hidden rounded-full bg-cafe/10">
            <div className="h-full rounded-full bg-gradient-to-r from-caramelo to-cafe transition-[width] duration-500 ease-out" style={{ width: `${progresso}%` }} />
          </div>
          <ol className="mt-3 hidden grid-cols-5 gap-1 text-center text-[0.72rem] font-semibold uppercase tracking-wider min-[440px]:grid">
            {etapas.map((nome, i) => (
              <li key={nome} className={`flex items-center justify-center gap-1 ${i < etapa ? 'text-oliva' : i === etapa ? 'text-espresso' : 'text-cafe/40'}`}>
                {i < etapa && <Check className="h-3 w-3" />} {nome}
              </li>
            ))}
          </ol>
        </div>

        <div key={etapa} className="moldura mt-6 animate-rise rounded-3xl p-5 sm:p-8">
          {etapa === 0 && (
            <div className="space-y-6">
              <Cabecalho titulo="Antes de avaliar, queremos conhecer você!" texto="Só precisamos do seu nome para identificar a avaliação." />
              <div id="campo-nome-wrap">
                <label htmlFor="campo-nome" className="font-medium text-espresso">
                  Nome completo <span className="text-caramelo" aria-hidden="true">*</span>
                </label>
                <input
                  id="campo-nome"
                  className="campo mt-2"
                  value={r.nome}
                  autoComplete="name"
                  maxLength={120}
                  onChange={(e) => set('nome', e.target.value)}
                  aria-required="true"
                  aria-invalid={erros.nome ? true : undefined}
                  aria-describedby={erros.nome ? 'erro-nome' : undefined}
                  placeholder="Ex.: Maria da Silva"
                />
                {erros.nome && <MensagemErro id="erro-nome" texto={erros.nome} />}
              </div>
              <div>
                <label htmlFor="campo-email" className="flex items-baseline justify-between gap-3 font-medium text-espresso">
                  <span>E-mail</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-cafe/50">Opcional</span>
                </label>
                <p id="ajuda-email" className="mt-1 text-sm text-cafe/75">Deixe só se quiser receber da equipe o resultado do trabalho.</p>
                <input
                  id="campo-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="campo mt-2"
                  value={r.email}
                  maxLength={160}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={erros.email ? true : undefined}
                  aria-describedby={`ajuda-email${erros.email ? ' erro-email' : ''}`}
                  placeholder="voce@exemplo.com"
                />
                {erros.email && <MensagemErro id="erro-email" texto={erros.email} />}
              </div>
              <p className="flex gap-2.5 rounded-xl bg-papel p-3.5 text-[0.84rem] leading-snug text-cafe">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Suas informações serão usadas exclusivamente para organizar e analisar o feedback deste trabalho acadêmico.
              </p>
            </div>
          )}

          {etapa === 1 && (
            <div className="space-y-4 text-center">
              <Cabecalho titulo="Como você avalia a experiência do tour?" texto="De 1 a 5 grãos de café." centro />
              <div id="campo-notaGeral" className="pt-2">
                <AvaliacaoGraos grande rotulo="Como você avalia a experiência do tour?" valor={r.notaGeral} onChange={(v) => set('notaGeral', v)} erro={erros.notaGeral} />
              </div>
              <Ramo className="mx-auto mt-4 w-40 text-oliva/50" />
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-6">
              <Cabecalho titulo="Como foi a condução do nosso tour?" texto={`Avalie a equipe de guias: ${guiasTexto()}.`} />
              <ul className="flex flex-wrap gap-2" aria-label="Guias">
                {tourConfig.guias.map((g) => (
                  <li key={g} className="rounded-full border border-cafe/20 bg-papel px-3.5 py-1.5 font-display text-[0.95rem] italic text-espresso">{g}</li>
                ))}
              </ul>
              <div className="divide-y divide-cafe/10">
                {criteriosGuias.map((c) => (
                  <div key={c.id} id={`campo-g-${c.id}`} className="py-4 first:pt-0 last:pb-0">
                    <AvaliacaoGraos
                      rotulo={c.label}
                      valor={r.notasGuias[c.id] ?? null}
                      onChange={(v) => {
                        setRascunho((a) => ({ ...a, notasGuias: { ...a.notasGuias, [c.id]: v } }))
                        setErros(({ [`g-${c.id}`]: _o, ...resto }) => resto)
                      }}
                      erro={erros[`g-${c.id}`]}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-7">
              <Cabecalho titulo="E o conteúdo?" texto="Quatro perguntas rápidas sobre o que você viu e ouviu." />
              {perguntasConteudo.map((p) => (
                <div key={p.id} id={`campo-c-${p.id}`}>
                  <EscolhaSPN
                    rotulo={p.label}
                    valor={r.conteudo[p.id]}
                    onChange={(v) => {
                      setRascunho((a) => ({ ...a, conteudo: { ...a.conteudo, [p.id]: v } }))
                      setErros(({ [`c-${p.id}`]: _o, ...resto }) => resto)
                    }}
                    erro={erros[`c-${p.id}`]}
                  />
                </div>
              ))}
              <div id="campo-recomendacao">
                <EscalaNPS rotulo="De 0 a 10, quanto você recomendaria este tour para outras pessoas?" valor={r.recomendacao} onChange={(v) => set('recomendacao', v)} erro={erros.recomendacao} />
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="space-y-7">
              <Cabecalho titulo="Queremos saber o que mais marcou você!" texto="Sua resposta ajuda a melhorar as próximas edições." />
              <div id="campo-marcante">
                <CampoTexto
                  id="texto-marcante"
                  rotulo="Qual foi a parte mais interessante ou marcante do tour para você? Conte para nós!"
                  valor={r.marcante}
                  onChange={(v) => set('marcante', v)}
                  limite={LIMITE_MARCANTE}
                  obrigatorio
                  linhas={6}
                  erro={erros.marcante}
                  placeholder="Pode ser uma parada, uma história, uma foto, um detalhe…"
                />
              </div>
              <CampoTexto id="texto-sugestao" rotulo="Tem alguma sugestão para melhorarmos essa experiência?" valor={r.sugestao} onChange={(v) => set('sugestao', v)} limite={LIMITE_OPCIONAL} linhas={3} />
              <CampoTexto id="texto-aprender" rotulo="Existe algo que você gostaria de ter aprendido ou conhecido durante o percurso?" valor={r.aprender} onChange={(v) => set('aprender', v)} limite={LIMITE_OPCIONAL} linhas={3} />
              {modo === 'local' && (
                <p className="flex gap-2.5 rounded-xl border border-dashed border-caramelo/60 bg-caramelo/10 p-3.5 text-[0.84rem] leading-snug text-cafe">
                  <HardDrive className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span><strong className="font-semibold">Modo local:</strong> nenhum banco de dados está conectado. Sua avaliação ficará salva apenas neste aparelho.</span>
                </p>
              )}
              {falha && <MensagemErro texto={falha} />}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-cafe/10 pt-6 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <button type="button" className="btn-secundario" onClick={voltar} disabled={enviando}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {etapa === 0 ? 'Voltar à trilha' : 'Voltar'}
            </button>
            {etapa < 4 ? (
              <button type="button" className="btn-primario" onClick={avancar}>
                Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="btn-primario" onClick={enviar} disabled={enviando} aria-busy={enviando}>
                {enviando ? (
                  <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando…</>
                ) : falha ? (
                  <><Send className="h-4 w-4" aria-hidden="true" /> Tentar novamente</>
                ) : (
                  <><Send className="h-4 w-4" aria-hidden="true" /> {modo === 'local' ? 'Salvar avaliação' : 'Enviar avaliação'}</>
                )}
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-cafe/60">
          <Grao className="h-3 w-3" /> Suas respostas ficam guardadas neste aparelho até o envio.
        </p>
      </div>
    </section>
  )
}

function Cabecalho({ titulo, texto, centro }: { titulo: string; texto: string; centro?: boolean }) {
  return (
    <div className={centro ? 'text-center' : ''}>
      <h2 id="titulo-etapa" tabIndex={-1} className="text-[clamp(1.6rem,6vw,2.2rem)] font-bold leading-tight outline-none">{titulo}</h2>
      <p className="mt-2 text-cafe/80">{texto}</p>
    </div>
  )
}
