import type { CSSProperties } from 'react'
import { Check, Stamp, X } from 'lucide-react'
import type { Quiz } from '../../data/jornada'
import { Carimbo } from '../brand/Carimbo'

type Props = {
  quiz: Quiz
  numero: number
  nome: string
  ano: string
  tinta: string
  /** Índice já respondido (carimbo conquistado), ou undefined. */
  resposta?: number
  onResponder: (i: number) => void
}

const vibrar = (p: number | number[]) => {
  try {
    navigator.vibrate?.(p)
  } catch {
    /* sem suporte */
  }
}

/**
 * Desafio da parada: uma pergunta sobre o que acabou de ser contado.
 * Acertando ou não, a pessoa ganha o carimbo da parada (o objetivo é fixar a história, não punir).
 */
export function Desafio({ quiz, numero, nome, ano, tinta, resposta, onResponder }: Props) {
  const respondida = resposta !== undefined
  const acertou = resposta === quiz.correta
  const letra = 'ABC'

  const responder = (i: number) => {
    if (respondida) return
    vibrar(i === quiz.correta ? [10, 30, 60] : [40])
    onResponder(i)
  }

  return (
    <section aria-labelledby={`desafio-${numero}`} className="mt-8 overflow-hidden rounded-2xl border-2 border-dashed border-ouro/80 bg-papel/70 p-5">
      <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-caramelo-texto">
        <Stamp className="h-4 w-4" aria-hidden="true" /> Desafio da parada · vale um carimbo
      </p>
      <h3 id={`desafio-${numero}`} className="mt-2 text-[1.3rem] font-bold leading-snug">{quiz.pergunta}</h3>
      <div className="mt-4 grid gap-2" role="group" aria-label="Opções de resposta">
        {quiz.opcoes.map((o, i) => {
          const certa = i === quiz.correta
          const escolhida = i === resposta
          let estilo = 'border-cafe/25 bg-creme text-espresso hover:border-cafe'
          if (respondida && certa) estilo = 'border-oliva bg-oliva text-creme'
          else if (respondida && escolhida) estilo = 'border-[#9a3b26] bg-[#9a3b26]/10 text-[#7a2e1d]'
          else if (respondida) estilo = 'border-cafe/15 bg-creme/60 text-cafe/80'
          return (
            <button
              key={o}
              type="button"
              onClick={() => responder(i)}
              disabled={respondida}
              aria-pressed={escolhida}
              className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left font-medium transition disabled:cursor-default ${estilo}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${respondida && certa ? 'bg-creme/20' : 'bg-espresso/10'}`} aria-hidden="true">
                {respondida && certa ? <Check className="h-4 w-4" /> : respondida && escolhida ? <X className="h-4 w-4" /> : letra[i]}
              </span>
              <span className="min-w-0 flex-1">{o}</span>
              {respondida && certa && <span className="sr-only">(resposta certa)</span>}
              {respondida && escolhida && !certa && <span className="sr-only">(sua resposta)</span>}
            </button>
          )
        })}
      </div>

      {respondida && (
        <div className="mt-5 grid items-center gap-4 min-[420px]:grid-cols-[1fr_auto]" aria-live="polite">
          <div className="min-w-0">
            <p className={`font-display text-lg font-bold ${acertou ? 'text-oliva' : 'text-caramelo-texto'}`}>
              {acertou ? 'Isso mesmo!' : 'Quase! A resposta certa está em verde.'}
            </p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-tinta/85">{quiz.explicacao}</p>
            <p className="mt-3 text-sm font-semibold text-espresso">Carimbo conquistado! Ele aparece no fim da trilha.</p>
          </div>
          <div className="mx-auto w-[116px] animate-carimbar" style={{ ['--giro' as string]: `${-9 + numero * 4}deg` } as CSSProperties}>
            <Carimbo nome={nome} ano={ano} numero={numero} tinta={tinta} className="h-auto w-full" />
          </div>
        </div>
      )}
    </section>
  )
}
