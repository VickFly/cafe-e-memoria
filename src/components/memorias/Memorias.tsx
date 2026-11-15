import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Expand, Film } from 'lucide-react'
import { dataDoTour, fotosTour, nomesParadas, urlFoto, type FotoTour, type ParadaFoto } from '../../data/memorias'
import { ChaveEpoca, Perfuracao, Projetor } from './Projetor'

const filtros: ('todas' | ParadaFoto)[] = ['todas', 'estacao-da-luz', 'rua-xv-de-novembro', 'largo-do-cafe', 'theatro-municipal', 'pelo-caminho']
const giro = (n: number) => ((n * 37) % 7) - 3 // de -3 a 3 graus, estável por foto

/**
 * Capítulo III: as fotos do tour como um laboratório de revelação.
 * Um rolo de filme com os destaques, a mesa de luz com todas as cópias (que "revelam" ao aparecer),
 * a alavanca 2026 ⇄ 1911 e o projetor em tela cheia, de onde dá para baixar ou criar um cartão-postal.
 */
export function Memorias() {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>('todas')
  const [sepia, setSepia] = useState(false)
  const [aberta, setAberta] = useState<{ lista: FotoTour[]; i: number } | null>(null)
  const mesa = useRef<HTMLUListElement>(null)

  const visiveis = useMemo(() => (filtro === 'todas' ? fotosTour : fotosTour.filter((f) => f.parada === filtro)), [filtro])
  const destaques = useMemo(() => fotosTour.filter((f) => f.destaque), [])
  const contagem = (f: (typeof filtros)[number]) => (f === 'todas' ? fotosTour.length : fotosTour.filter((x) => x.parada === f).length)

  // revelação: cada cópia ganha cor quando entra na tela
  useEffect(() => {
    const el = mesa.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('revelada')
          obs.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.35 },
    )
    el.querySelectorAll('.revelacao').forEach((img) => obs.observe(img))
    return () => obs.disconnect()
  }, [visiveis])

  return (
    <section id="memorias" aria-labelledby="titulo-memorias" className="relative overflow-hidden bg-[#1f1510] py-16 text-creme sm:py-20">
      <div className="gutter mx-auto max-w-6xl">
        <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ouro">
          <Camera className="h-4 w-4" aria-hidden="true" /> Capítulo III · Memórias do tour
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div className="min-w-0">
            <h2 id="titulo-memorias" className="text-[clamp(2.1rem,8vw,3.6rem)] font-bold leading-[1.02] text-creme">
              O dia em que a turma fez a viagem
            </h2>
            <p className="mt-4 max-w-[56ch] text-creme/80">
              {dataDoTour}. Da Estação da Luz ao Theatro Municipal, {fotosTour.length} fotogramas revelados aqui. Toque em
              qualquer foto para abrir o projetor, baixar a sua ou transformá-la em cartão-postal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <ChaveEpoca sepia={sepia} onSepia={setSepia} escuro />
          </div>
        </div>
      </div>

      {/* rolo de filme com os destaques */}
      <div className="mt-10 bg-[#0e0907] py-2 shadow-[inset_0_10px_20px_-12px_rgba(0,0,0,.8),inset_0_-10px_20px_-12px_rgba(0,0,0,.8)]">
        <Perfuracao />
        <ul
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[max(16px,calc((100vw-72rem)/2+16px))] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Rolo de filme com os destaques do tour"
        >
          {destaques.map((f, i) => (
            <li key={f.arquivo} className="w-[72%] max-w-[360px] shrink-0 snap-center sm:w-[340px]">
              <button type="button" onClick={() => setAberta({ lista: destaques, i })} className="group block w-full text-left" aria-label={`Abrir destaque ${i + 1}: ${nomesParadas[f.parada]}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-[#2a1d16]">
                  <img src={urlFoto(f, 'p')} alt="" loading={i < 3 ? 'eager' : 'lazy'} decoding="async" width={f.w} height={f.h} className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${sepia ? 'filtro-1911' : ''}`} />
                  {sepia && <div className="grao-filme pointer-events-none absolute inset-0" aria-hidden="true" />}
                </div>
                <span className="mt-1.5 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#d9a441]">
                  <span>▸ {String(i + 1).padStart(2, '0')}A</span>
                  <span className="truncate pl-2">Café &amp; Memória 400</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Perfuracao />
      </div>
      <p className="gutter mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-creme/60">
        <Film className="h-3.5 w-3.5" aria-hidden="true" /> Deslize o rolo para ver os destaques
      </p>

      {/* filtros por parada */}
      <div className="gutter mx-auto mt-10 max-w-6xl">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filtrar fotos por parada">
          {filtros.map((f) => {
            const n = contagem(f)
            if (!n) return null
            const sel = filtro === f
            return (
              <button
                key={f}
                type="button"
                aria-pressed={sel}
                onClick={() => setFiltro(f)}
                className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${sel ? 'border-ouro bg-ouro text-espresso' : 'border-creme/20 text-creme/85 hover:border-creme/50'}`}
              >
                {f === 'todas' ? 'Todas' : nomesParadas[f]}
                <span className={`tabular rounded-full px-1.5 text-xs ${sel ? 'bg-espresso/15' : 'bg-creme/10'}`}>{n}</span>
              </button>
            )
          })}
        </div>

        {/* mesa de luz: as cópias como fotos impressas, levemente tortas */}
        <ul ref={mesa} key={filtro} className="mt-6 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4" aria-label={`Fotos: ${filtro === 'todas' ? 'todas' : nomesParadas[filtro]}`}>
          {visiveis.map((f, i) => (
            <li key={f.arquivo} className="mb-3 break-inside-avoid animate-rise sm:mb-4" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
              <button
                type="button"
                onClick={() => setAberta({ lista: visiveis, i })}
                className="group block w-full rounded-[3px] bg-[#f6efe2] p-1.5 pb-2 text-left shadow-[0_14px_24px_-14px_rgba(0,0,0,.9)] transition [transform:rotate(var(--giro))] hover:[transform:translateY(-4px)] focus-visible:[transform:none] sm:p-2 sm:pb-2.5"
                style={{ '--giro': `${giro(f.n) * 0.5}deg` } as CSSProperties}
                aria-label={`Abrir fotograma ${f.n}: ${nomesParadas[f.parada]}`}
              >
                <div className="relative overflow-hidden bg-[#2a1d16]" style={{ aspectRatio: `${f.w} / ${f.h}` }}>
                  <img src={urlFoto(f, 'p')} alt="" loading="lazy" decoding="async" width={f.w} height={f.h} className={`revelacao h-full w-full object-cover ${sepia ? 'filtro-1911' : ''}`} />
                  {sepia && <div className="grao-filme pointer-events-none absolute inset-0" aria-hidden="true" />}
                  <span className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-creme opacity-0 transition group-hover:opacity-100" aria-hidden="true">
                    <Expand className="h-4 w-4" />
                  </span>
                </div>
                <span className="mt-1.5 flex items-baseline justify-between gap-2 px-0.5">
                  <span className="truncate font-display text-[0.86rem] italic text-cafe">{nomesParadas[f.parada]}</span>
                  <span className="tabular shrink-0 text-[0.66rem] font-semibold tracking-[0.12em] text-cafe/80">Nº {String(f.n).padStart(2, '0')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-[60ch] text-center text-sm text-creme/65">
          Aparece em alguma foto e prefere que ela não fique no site? Fale com a equipe do tour e ela será retirada.
        </p>
      </div>

      {aberta && (
        <Projetor
          fotos={aberta.lista}
          indice={aberta.i}
          sepia={sepia}
          onSepia={setSepia}
          onIr={(i) => setAberta((a) => (a ? { ...a, i } : a))}
          onFechar={() => setAberta(null)}
        />
      )}
    </section>
  )
}
