import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ChevronLeft, ChevronRight, ExternalLink, Lightbulb, MapPin, X } from 'lucide-react'
import type { Parada } from '../../data/historia'
import { paradas } from '../../data/historia'
import { Foto } from '../brand/Foto'
import { ilustracaoPorTipo } from '../brand/Ilustracoes'

type Props = { parada: Parada; onFechar: () => void; onIr: (n: number) => void }

/** Painel de detalhes da parada: folha inferior no celular, janela central no desktop. */
export function PainelParada({ parada, onFechar, onIr }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [aba, setAba] = useState<'historica' | 'atual'>(parada.fotos.historica ? 'historica' : 'atual')
  const Ilustracao = ilustracaoPorTipo[parada.ilustracao]
  const temComparacao = Boolean(parada.fotos.historica && parada.fotos.atual)
  const fotoAtiva = aba === 'historica' ? parada.fotos.historica : parada.fotos.atual

  useEffect(() => {
    setAba(parada.fotos.historica ? 'historica' : 'atual')
    ref.current?.querySelector<HTMLElement>('[data-foco-inicial]')?.focus()
    ref.current?.scrollTo({ top: 0 })
  }, [parada])

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
      if (e.key === 'Tab' && ref.current) {
        const focaveis = ref.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!focaveis.length) return
        const primeiro = focaveis[0]
        const ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) (e.preventDefault(), ultimo.focus())
        else if (!e.shiftKey && document.activeElement === ultimo) (e.preventDefault(), primeiro.focus())
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      anterior?.focus()
    }
  }, [onFechar])

  const anterior = paradas.find((p) => p.numero === parada.numero - 1)
  const proxima = paradas.find((p) => p.numero === parada.numero + 1)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <button type="button" aria-label="Fechar detalhes" tabIndex={-1} className="absolute inset-0 bg-tinta/55 backdrop-blur-[2px]" onClick={onFechar} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="painel-titulo"
        className="relative max-h-[92vh] w-full max-w-3xl animate-rise overflow-y-auto overscroll-contain rounded-t-3xl bg-creme shadow-2xl sm:rounded-3xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-cafe/10 bg-creme/95 py-3 backdrop-blur gutter">
          <span className="eyebrow">Parada {String(parada.numero).padStart(2, '0')} de 04</span>
          <button type="button" data-foco-inicial onClick={onFechar} className="grid h-11 w-11 place-items-center rounded-full border border-cafe/20 text-cafe hover:bg-papel" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="gutter pb-8 pt-5">
          <div className="flex items-start gap-4">
            <Ilustracao className="hidden h-16 w-28 shrink-0 text-caramelo min-[480px]:block" />
            <div className="min-w-0">
              <h2 id="painel-titulo" className="text-[clamp(1.8rem,6vw,2.6rem)] font-bold leading-tight">
                {parada.nome}
                {parada.subtitulo && <span className="block text-[0.55em] font-medium italic text-cafe">{parada.subtitulo}</span>}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-cafe">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> {parada.local}
              </p>
            </div>
          </div>

          {fotoAtiva ? (
            <div className="mt-6">
              {temComparacao && (
                <div role="tablist" aria-label="Comparar fotografias" className="mb-3 inline-flex rounded-full border border-cafe/25 bg-papel p-1">
                  {(['historica', 'atual'] as const).map((t) => (
                    <button
                      key={t}
                      role="tab"
                      type="button"
                      aria-selected={aba === t}
                      onClick={() => setAba(t)}
                      className={`min-h-[40px] rounded-full px-5 text-sm font-semibold transition ${aba === t ? 'bg-espresso text-creme' : 'text-cafe hover:text-espresso'}`}
                    >
                      {t === 'historica' ? 'Ontem' : 'Hoje'}
                    </button>
                  ))}
                </div>
              )}
              <Foto key={fotoAtiva.src} imagem={fotoAtiva} proporcao="16 / 10" />
            </div>
          ) : (
            parada.semFotoNota && (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ouro bg-papel/70 p-6 text-center">
                <Ilustracao className="h-24 w-44 text-cafe/70" />
                <p className="max-w-[46ch] text-sm text-cafe">{parada.semFotoNota.texto}</p>
                <a href={parada.semFotoNota.link} target="_blank" rel="noreferrer" className="btn-texto text-sm">
                  Abrir no Wikimedia Commons <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            )
          )}

          <div className="mt-7 space-y-4 text-[1.02rem] leading-relaxed text-tinta/90">
            {parada.contexto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {fotoAtiva && parada.semFotoNota && (
            <p className="mt-3 text-[0.82rem] text-cafe/80">
              {parada.semFotoNota.texto}{' '}
              <a href={parada.semFotoNota.link} target="_blank" rel="noreferrer" className="underline underline-offset-2">Abrir no Commons</a>
            </p>
          )}

          {parada.atencao && (
            <p className="mt-6 flex gap-3 rounded-xl bg-oliva/10 p-4 text-[0.92rem] text-tinta/90">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-oliva" aria-hidden="true" />
              <span><strong className="font-semibold text-espresso">Para não confundir: </strong>{parada.atencao}</span>
            </p>
          )}

          <h3 className="mt-8 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-cafe">Destaques</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {parada.destaques.map((d) => (
              <li key={d} className="flex gap-2.5 text-[0.95rem]">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-caramelo" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>

          <aside className="mt-8 rounded-2xl bg-espresso p-5 text-creme">
            <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ouro">
              <Lightbulb className="h-4 w-4" aria-hidden="true" /> Curiosidade
            </p>
            <p className="mt-2 font-display text-lg italic leading-snug">{parada.curiosidade}</p>
          </aside>

          {parada.fotos.extra && (
            <div className="mt-8">
              <Foto imagem={parada.fotos.extra} proporcao="16 / 10" />
            </div>
          )}

          <nav aria-label="Navegar entre paradas" className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-cafe/10 pt-5">
            {anterior ? (
              <button type="button" className="btn-secundario" onClick={() => onIr(anterior.numero)}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {anterior.nome}
              </button>
            ) : <span />}
            {proxima ? (
              <button type="button" className="btn-primario" onClick={() => onIr(proxima.numero)}>
                Próxima: {proxima.nome} <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="btn-primario" onClick={onFechar}>
                Concluir a trilha <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
