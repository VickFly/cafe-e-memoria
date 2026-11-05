import { useCallback, useEffect, useState } from 'react'
import { PenLine } from 'lucide-react'
import { Inicio } from './components/tour/Inicio'
import { Introducao } from './components/tour/Introducao'
import { Trilha } from './components/tour/Trilha'
import { Formulario } from './components/form/Formulario'
import { Agradecimento } from './components/recipe/Agradecimento'
import { Painel } from './components/admin/Painel'
import { Rodape } from './components/brand/Rodape'
import { Grao } from './components/brand/Ilustracoes'
import { novoRascunho, type Avaliacao, type Rascunho } from './data/avaliacao'
import { gravarLocal, lerLocal } from './lib/storage'

type Tela = 'tour' | 'form' | 'fim'
type Progresso = { tela: Tela; etapa: number; exploradas: number[]; enviado?: { id: string; nome: string } }

const CHAVE_PROGRESSO = 'cafe-memoria:progresso'
const CHAVE_RASCUNHO = 'cafe-memoria:rascunho'
const ROTA_PAINEL = '#painel'

export default function App() {
  const [progresso, setProgresso] = useState<Progresso>(() => {
    const p = lerLocal<Progresso>(CHAVE_PROGRESSO, { tela: 'tour', etapa: 0, exploradas: [] })
    // Quem já enviou e recarrega a página volta para a tela da receita, não para o formulário.
    if (p.tela === 'fim' && !p.enviado) p.tela = 'tour'
    return p
  })
  const [rascunho, setRascunhoState] = useState<Rascunho>(() => ({ ...novoRascunho(), ...lerLocal<Partial<Rascunho>>(CHAVE_RASCUNHO, {}) }))
  const [painel, setPainel] = useState(() => location.hash === ROTA_PAINEL)

  useEffect(() => { gravarLocal(CHAVE_PROGRESSO, progresso) }, [progresso])
  useEffect(() => {
    const t = setTimeout(() => gravarLocal(CHAVE_RASCUNHO, rascunho), 250)
    return () => clearTimeout(t)
  }, [rascunho])
  useEffect(() => {
    const onHash = () => setPainel(location.hash === ROTA_PAINEL)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const setRascunho = useCallback((f: (r: Rascunho) => Rascunho) => setRascunhoState(f), [])
  const ir = useCallback((tela: Tela, extra: Partial<Progresso> = {}) => {
    setProgresso((p) => ({ ...p, ...extra, tela }))
    if (tela !== 'form') window.scrollTo({ top: 0 })
  }, [])

  const explorar = useCallback((n: number) => {
    setProgresso((p) => (p.exploradas.includes(n) ? p : { ...p, exploradas: [...p.exploradas, n] }))
  }, [])

  const voltarTrilha = useCallback(() => {
    setProgresso((p) => ({ ...p, tela: 'tour' }))
    requestAnimationFrame(() => document.getElementById('trilha')?.scrollIntoView({ block: 'start' }))
  }, [])

  const enviado = (a: Avaliacao) => {
    const limpo = novoRascunho()
    setRascunhoState(limpo)
    gravarLocal(CHAVE_RASCUNHO, limpo)
    ir('fim', { enviado: { id: a.id, nome: a.nome }, etapa: 0 })
  }

  const fecharPainel = () => {
    history.replaceState(null, '', location.pathname + location.search)
    setPainel(false)
  }

  if (painel) return <Painel onSair={fecharPainel} />

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-creme">
        Pular para o conteúdo
      </a>
      <BarraTopo tela={progresso.tela} onInicio={() => ir('tour')} onAvaliar={() => ir(progresso.enviado ? 'fim' : 'form')} jaEnviou={Boolean(progresso.enviado)} />
      <main id="conteudo">
        {progresso.tela === 'tour' && (
          <>
            <Inicio onComecar={() => document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' })} />
            <Introducao />
            <Trilha exploradas={new Set(progresso.exploradas)} onExplorar={explorar} onAvaliar={() => ir(progresso.enviado ? 'fim' : 'form')} />
          </>
        )}
        {progresso.tela === 'form' && (
          <Formulario
            rascunho={rascunho}
            setRascunho={setRascunho}
            etapa={progresso.etapa}
            setEtapa={(n) => setProgresso((p) => ({ ...p, etapa: n }))}
            onVoltarTrilha={voltarTrilha}
            onEnviado={enviado}
          />
        )}
        {progresso.tela === 'fim' && (
          <Agradecimento
            nome={progresso.enviado?.nome ?? ''}
            onVoltarTrilha={voltarTrilha}
            onNovaAvaliacao={() => ir('form', { enviado: undefined, etapa: 0 })}
          />
        )}
      </main>
      {progresso.tela !== 'form' && <Rodape />}
    </>
  )
}

function BarraTopo({ tela, onInicio, onAvaliar, jaEnviou }: { tela: Tela; onInicio: () => void; onAvaliar: () => void; jaEnviou: boolean }) {
  return (
    <div className="gutter border-b border-cafe/10 bg-papel/80 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <button type="button" onClick={onInicio} className="flex min-h-[44px] items-center gap-2 font-display text-lg font-bold text-espresso" aria-label="Café & Memória, voltar ao início">
          <Grao className="h-5 w-4 text-caramelo" />
          Café <span className="italic text-caramelo">&amp;</span> Memória
        </button>
        {tela === 'tour' && (
          <button type="button" onClick={onAvaliar} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-cafe/30 px-4 text-sm font-semibold text-cafe hover:border-cafe hover:bg-creme">
            <PenLine className="h-4 w-4" aria-hidden="true" /> {jaEnviou ? 'Sua receita' : 'Avaliar'}
          </button>
        )}
      </div>
    </div>
  )
}
