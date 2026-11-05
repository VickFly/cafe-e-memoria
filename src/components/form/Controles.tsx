import { useId, useRef, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'
import { opcoesSPN, rotulosNota, type RespostaSPN } from '../../data/avaliacao'
import { Grao } from '../brand/Ilustracoes'

/** Navegação por setas dentro de um grupo de rádios (padrão ARIA). */
function useSetas(total: number, atual: number, escolher: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const prox = ((atual < 0 ? (delta > 0 ? -1 : 0) : atual) + delta + total) % total
    escolher(prox)
    refs.current[prox]?.focus()
  }
  return { refs, onKeyDown }
}

type GraosProps = {
  rotulo: string
  valor: number | null
  onChange: (v: number) => void
  erro?: string
  grande?: boolean
  id?: string
}

/** Avaliação de 1 a 5 com grãos de café no lugar de estrelas. */
export function AvaliacaoGraos({ rotulo, valor, onChange, erro, grande, id }: GraosProps) {
  const autoId = useId()
  const base = id ?? autoId
  const { refs, onKeyDown } = useSetas(5, (valor ?? 0) - 1, (i) => onChange(i + 1))

  return (
    <div className="min-w-0" id={base}>
      <p id={`${base}-rotulo`} className={grande ? 'sr-only' : 'font-medium leading-snug text-espresso'}>
        {rotulo}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${base}-rotulo`}
        aria-describedby={erro ? `${base}-erro` : `${base}-estado`}
        aria-invalid={erro ? true : undefined}
        onKeyDown={onKeyDown}
        className={`mt-2 flex items-center ${grande ? 'justify-center gap-1 sm:gap-3' : 'gap-0.5'}`}
      >
        {rotulosNota.map((r, i) => {
          const n = i + 1
          const ativo = valor !== null && n <= valor
          const selecionado = valor === n
          return (
            <button
              key={r}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={selecionado}
              aria-label={`${n} ${n === 1 ? 'grão' : 'grãos'}: ${r}`}
              tabIndex={selecionado || (valor === null && i === 0) ? 0 : -1}
              onClick={() => onChange(n)}
              className={`group grid place-items-center rounded-full transition ${grande ? 'h-14 w-14 sm:h-16 sm:w-16' : 'h-11 w-11'} hover:bg-caramelo/10`}
            >
              <Grao
                key={selecionado ? `on-${n}` : `off-${n}`}
                cheio={ativo}
                className={`${grande ? 'h-10 w-8 sm:h-12 sm:w-10' : 'h-7 w-6'} transition-colors duration-300 ${
                  ativo ? 'text-cafe' : 'text-cafe/35 group-hover:text-caramelo-texto'
                } ${selecionado ? 'animate-pop' : ''}`}
              />
            </button>
          )
        })}
      </div>
      <p
        id={`${base}-estado`}
        aria-live="polite"
        className={`${grande ? 'mt-3 text-center font-display text-2xl italic' : 'mt-0.5 text-sm'} min-h-[1.5em] ${valor ? 'text-caramelo-texto' : 'text-cafe/80'}`}
      >
        {valor ? (
          <>
            {grande ? '' : `${valor}/5 · `}
            {rotulosNota[valor - 1]}
          </>
        ) : grande ? 'Toque nos grãos para avaliar' : 'Sem nota'}
      </p>
      {erro && <MensagemErro id={`${base}-erro`} texto={erro} />}
    </div>
  )
}

export function EscolhaSPN({ rotulo, valor, onChange, erro, id }: { rotulo: string; valor?: RespostaSPN; onChange: (v: RespostaSPN) => void; erro?: string; id?: string }) {
  const autoId = useId()
  const base = id ?? autoId
  const atual = opcoesSPN.findIndex((o) => o.valor === valor)
  const { refs, onKeyDown } = useSetas(3, atual, (i) => onChange(opcoesSPN[i].valor))
  return (
    <div className="min-w-0" id={base}>
      <p id={`${base}-rotulo`} className="font-medium leading-snug text-espresso">{rotulo}</p>
      <div role="radiogroup" aria-labelledby={`${base}-rotulo`} aria-invalid={erro ? true : undefined} onKeyDown={onKeyDown} className="mt-3 grid grid-cols-3 gap-2">
        {opcoesSPN.map((o, i) => {
          const sel = valor === o.valor
          return (
            <button
              key={o.valor}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={sel}
              tabIndex={sel || (atual < 0 && i === 0) ? 0 : -1}
              onClick={() => onChange(o.valor)}
              className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border px-2 text-[0.92rem] font-semibold transition ${
                sel ? 'border-espresso bg-espresso text-creme' : 'border-cafe/25 bg-creme text-cafe hover:border-cafe'
              }`}
            >
              {sel && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {o.label}
            </button>
          )
        })}
      </div>
      {erro && <MensagemErro texto={erro} />}
    </div>
  )
}

export function EscalaNPS({ rotulo, valor, onChange, erro, id }: { rotulo: string; valor: number | null; onChange: (v: number) => void; erro?: string; id?: string }) {
  const autoId = useId()
  const base = id ?? autoId
  const { refs, onKeyDown } = useSetas(11, valor ?? -1, onChange)
  return (
    <div className="min-w-0" id={base}>
      <p id={`${base}-rotulo`} className="font-medium leading-snug text-espresso">{rotulo}</p>
      <div role="radiogroup" aria-labelledby={`${base}-rotulo`} aria-invalid={erro ? true : undefined} onKeyDown={onKeyDown} className="mt-3 grid grid-cols-6 gap-1.5 min-[480px]:grid-cols-11">
        {Array.from({ length: 11 }, (_, n) => {
          const sel = valor === n
          const cor = n <= 6 ? 'bg-[#9a3b26]' : n <= 8 ? 'bg-caramelo' : 'bg-oliva'
          return (
            <button
              key={n}
              ref={(el) => (refs.current[n] = el)}
              type="button"
              role="radio"
              aria-checked={sel}
              aria-label={`Nota ${n}`}
              tabIndex={sel || (valor === null && n === 0) ? 0 : -1}
              onClick={() => onChange(n)}
              className={`tabular min-h-[46px] rounded-lg border text-[0.95rem] font-semibold transition ${
                sel ? `${cor} border-transparent text-creme ring-2 ring-espresso ring-offset-2 ring-offset-creme` : 'border-cafe/25 bg-creme text-cafe hover:border-cafe'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-cafe/80">
        <span>0 · Não recomendaria</span>
        <span>10 · Recomendaria muito</span>
      </div>
      {erro && <MensagemErro texto={erro} />}
    </div>
  )
}

export function MensagemErro({ texto, id }: { texto: string; id?: string }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#9a3b26]">
      <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded-full bg-[#9a3b26] text-[10px] font-bold text-creme">!</span>
      {texto}
    </p>
  )
}

export function CampoTexto({
  id, rotulo, valor, onChange, limite, obrigatorio, erro, placeholder, linhas = 4, ajuda,
}: {
  id: string; rotulo: string; valor: string; onChange: (v: string) => void; limite: number; obrigatorio?: boolean
  erro?: string; placeholder?: string; linhas?: number; ajuda?: string
}) {
  const restante = limite - valor.length
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-medium leading-snug text-espresso">
        <span>{rotulo}</span>
        <span className={`shrink-0 text-xs font-semibold uppercase tracking-wider ${obrigatorio ? 'text-caramelo-texto' : 'text-cafe/80'}`}>
          {obrigatorio ? 'Obrigatório' : 'Opcional'}
        </span>
      </label>
      {ajuda && <p className="mt-1 text-sm text-cafe/80">{ajuda}</p>}
      <textarea
        id={id}
        rows={linhas}
        value={valor}
        maxLength={limite}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={`${id}-contador${erro ? ` ${id}-erro` : ''}`}
        className="campo mt-2 resize-y leading-relaxed"
      />
      <div className="mt-1 flex justify-between gap-2">
        <span>{erro && <MensagemErro id={`${id}-erro`} texto={erro} />}</span>
        <span id={`${id}-contador`} className={`tabular shrink-0 text-xs ${restante < 50 ? 'text-caramelo-texto' : 'text-cafe/80'}`} aria-live={restante < 50 ? 'polite' : 'off'}>
          {valor.length}/{limite}
        </span>
      </div>
    </div>
  )
}
