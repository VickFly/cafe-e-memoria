import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Flag, TrainFront, Lightbulb, MapPin, PenLine } from 'lucide-react'
import { paradas } from '../../data/historia'
import { ilustracaoPorTipo } from '../brand/Ilustracoes'
import { Foto } from '../brand/Foto'
import { LocomotivaTopo } from '../brand/Locomotiva'
import { MapaRota } from './MapaRota'
import { PainelParada } from './PainelParada'

type Props = { exploradas: Set<number>; onExplorar: (n: number) => void; onAvaliar: () => void }

export function Trilha({ exploradas, onExplorar, onAvaliar }: Props) {
  const [aberta, setAberta] = useState<number | null>(null)
  const total = paradas.length
  const feitas = exploradas.size
  const completa = feitas === total

  const abrir = useCallback(
    (n: number) => {
      setAberta(n)
      onExplorar(n)
    },
    [onExplorar],
  )
  const fechar = useCallback(() => setAberta(null), [])
  const paradaAberta = paradas.find((p) => p.numero === aberta)
  const { listaRef, tremRef, estacao } = useTremNaRolagem()

  return (
    <section id="trilha" aria-labelledby="titulo-trilha" className="relative bg-[#EDE2CF]/70 py-16 sm:py-20">
      <div className="gutter mx-auto max-w-6xl">
        <p className="eyebrow">Capítulo II · O percurso</p>
        <h2 id="titulo-trilha" className="mt-3 text-[clamp(2rem,7vw,3.2rem)] font-bold leading-[1.05]">
          Quatro paradas, uma mesma história
        </h2>
        <p className="mt-4 max-w-[60ch] text-tinta/85">
          Siga a ordem do tour. Toque em <strong className="font-semibold text-espresso">Explorar parada</strong> para ver
          fotos de ontem e de hoje, os destaques e uma curiosidade de cada lugar.
        </p>
      </div>

      {/* Indicador de progresso fixo enquanto o visitante percorre a trilha */}
      <div className="sticky z-30 mt-8" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="gutter border-y border-cafe/10 bg-papel py-3 sm:bg-papel/95 sm:backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <TrainFront className="h-5 w-5 shrink-0 text-caramelo-texto" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold text-espresso">{completa ? 'Trilha completa!' : 'Sua trilha'}</span>
                <span className="tabular text-cafe" aria-live="polite">{feitas} de {total} paradas exploradas</span>
              </div>
              <div className="mt-1.5 flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={feitas} aria-label="Progresso da trilha">
                {paradas.map((p) => (
                  <span key={p.numero} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${exploradas.has(p.numero) ? 'bg-oliva' : 'bg-cafe/15'}`} />
                ))}
              </div>
            </div>
            {completa && (
              <button type="button" onClick={onAvaliar} className="hidden shrink-0 rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-creme hover:bg-cafe min-[420px]:inline-flex">
                Avaliar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="gutter mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px]">
        <ol ref={listaRef} className="relative min-w-0">
          {/* Trilho do percurso: dois trilhos e dormentes */}
          <span aria-hidden="true" className="absolute bottom-8 left-[12px] top-8 w-[26px] bg-[repeating-linear-gradient(to_bottom,rgba(91,57,40,.55)_0_4px,transparent_4px_13px)]" />
          <span aria-hidden="true" className="absolute bottom-8 left-[16px] top-8 w-[3px] rounded bg-espresso/80" />
          <span aria-hidden="true" className="absolute bottom-8 left-[31px] top-8 w-[3px] rounded bg-espresso/80" />
          {/* Locomotiva: acompanha a rolagem e chega a cada estação */}
          <div ref={tremRef} aria-hidden="true" className="pointer-events-none absolute left-[3px] top-0 z-20 w-[44px] will-change-transform" style={{ transform: 'translate3d(0,40px,0)', backfaceVisibility: 'hidden' }}>
            <div className="relative transition-transform duration-300 ease-out" style={{ transformOrigin: '50% 50%' }}>
              <LocomotivaTopo className="h-[84px] w-[44px]" fumaca={false} />
              {/* fumaça em HTML: anima só transform/opacity, que o celular processa na GPU */}
              {[0, 0.6, 1.2].map((d, i) => (
                <span
                  key={i}
                  className="absolute h-3 w-3 animate-fumacaTopo rounded-full border border-cafe/30 bg-creme"
                  style={{ left: 16 + (i - 1) * 3, top: 63 - i * 6, animationDelay: `${d}s` }}
                />
              ))}
            </div>
          </div>
          {paradas.map((p, i) => {
            const Ilustracao = ilustracaoPorTipo[p.ilustracao]
            const feita = exploradas.has(p.numero)
            const chegou = estacao >= p.numero
            const ultima = p.numero === total
            const capa = p.fotos.historica ?? p.fotos.atual
            return (
              <li key={p.slug} className="relative pb-10 pl-16 last:pb-0" style={{ animationDelay: `${i * 80}ms` }}>
                <span
                  data-estacao={p.numero}
                  className={`absolute left-0 top-5 z-10 grid h-[50px] w-[50px] place-items-center rounded-full border-[3px] font-display text-xl font-bold text-creme shadow-md transition-colors duration-500 ${feita ? 'bg-oliva' : 'bg-espresso'} ${chegou ? 'border-ouro' : 'border-papel'} ${estacao === p.numero ? 'animate-brilho' : ''}`}
                  aria-hidden="true"
                >
                  {feita ? <Check className="h-6 w-6" /> : String(p.numero).padStart(2, '0')}
                </span>
                {estacao === p.numero && (
                  <p className="mb-2 inline-flex animate-rise items-center gap-1.5 rounded-full bg-espresso px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ouro" aria-hidden="true">
                    <TrainFront className="h-3.5 w-3.5" /> Chegando à estação
                  </p>
                )}
                <article className={`moldura animate-rise overflow-hidden rounded-2xl transition-shadow duration-500 ${estacao === p.numero ? 'ring-2 ring-ouro/60' : ''}`} aria-labelledby={`parada-${p.numero}`}>
                  <div className="grid min-w-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                    <div className="relative min-w-0 bg-papel/60 p-3">
                      {capa ? (
                        <Foto imagem={capa} proporcao="4 / 3" semLegenda />
                      ) : (
                        <div className="grid aspect-[4/3] max-w-full place-items-center rounded-[10px] bg-[#E7DCC8] ring-1 ring-cafe/20">
                          <Ilustracao className="w-3/4 text-cafe/80" title={`Ilustração: ${p.nome}`} />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col p-5">
                      <p className="eyebrow">Parada {String(p.numero).padStart(2, '0')}</p>
                      <h3 id={`parada-${p.numero}`} className="mt-1 text-2xl font-bold leading-tight">
                        {p.nome}
                        {p.subtitulo && <span className="block text-base font-medium italic text-cafe">{p.subtitulo}</span>}
                      </h3>
                      <p className="mt-2 flex items-start gap-1.5 text-[0.85rem] text-cafe">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {p.local}
                      </p>
                      <p className="mt-3 text-[0.95rem] text-tinta/85">{p.resumo}</p>
                      <p className="mt-4 flex gap-2 rounded-lg border-l-[3px] border-ouro bg-papel/70 p-3 text-[0.86rem] leading-snug text-tinta/85">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-caramelo-texto" aria-hidden="true" />
                        <span><span className="font-semibold text-espresso">Curiosidade: </span>{p.curiosidade}</span>
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button type="button" className={feita ? 'btn-secundario' : 'btn-primario'} onClick={() => abrir(p.numero)} aria-haspopup="dialog">
                          {feita ? 'Rever parada' : 'Explorar parada'}
                        </button>
                        {feita && (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-oliva">
                            <Check className="h-4 w-4" aria-hidden="true" /> Explorada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
                {ultima && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-caramelo/15 px-3 py-1 text-[0.78rem] font-semibold text-cafe">
                    <Flag className="h-3.5 w-3.5" aria-hidden="true" /> Última parada do percurso
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <MapaRota exploradas={exploradas} ativa={aberta ?? undefined} onSelecionar={abrir} />
        </div>
      </div>

      <div className="gutter mx-auto mt-14 max-w-3xl">
        <div className={`rounded-3xl p-6 text-center sm:p-8 ${completa ? 'bg-espresso text-creme' : 'moldura'}`}>
          {completa ? (
            <>
              <Flag className="mx-auto h-8 w-8 text-ouro" aria-hidden="true" />
              <p className="mt-3 font-display text-2xl font-bold text-creme">Você chegou ao fim da trilha!</p>
              <p className="mx-auto mt-2 max-w-[44ch] text-creme/85">Da Luz ao Theatro, você percorreu a história do café em São Paulo. Agora conte como foi.</p>
            </>
          ) : (
            <>
              <p className="font-display text-xl font-bold">Terminou o percurso?</p>
              <p className="mx-auto mt-2 max-w-[44ch] text-tinta/80">Você pode avaliar agora, mesmo sem abrir todas as paradas aqui no app.</p>
            </>
          )}
          <button type="button" onClick={onAvaliar} className={`btn mt-5 px-8 ${completa ? 'bg-creme text-espresso hover:bg-papel' : 'btn-primario'}`}>
            <PenLine className="h-4 w-4" aria-hidden="true" /> Avaliar a experiência
          </button>
        </div>
      </div>

      {paradaAberta && <PainelParada parada={paradaAberta} onFechar={fechar} onIr={abrir} />}
    </section>
  )
}

/**
 * Move a locomotiva pelo trilho conforme a rolagem.
 * Para ficar fluido no celular:
 *  - a rolagem só define um ALVO; um laço de requestAnimationFrame aproxima o trem do alvo
 *    com suavização exponencial, escondendo o ritmo irregular dos eventos de scroll;
 *  - as posições das estações ficam em cache (recalculadas só ao redimensionar);
 *  - o trem anda com translate3d numa camada própria, sem filtros caros;
 *  - o React só re-renderiza quando o trem muda de estação.
 */
function useTremNaRolagem() {
  const listaRef = useRef<HTMLOListElement>(null)
  const tremRef = useRef<HTMLDivElement>(null)
  const [estacao, setEstacao] = useState(0)

  useEffect(() => {
    const lista = listaRef.current
    const trem = tremRef.current
    if (!lista || !trem) return
    const icone = trem.firstElementChild as HTMLElement | null
    const reduz = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let centros: number[] = []
    let topoLista = 0
    let alvo = 0
    let atualY = -1
    let quadro = 0
    let tAnterior = 0
    let sentidoAtual = 1
    let estacaoAtual = -1

    const medir = () => {
      centros = Array.from(lista.querySelectorAll<HTMLElement>('[data-estacao]')).map(
        (el) => (el.parentElement?.offsetTop ?? 0) + el.offsetTop + el.offsetHeight / 2,
      )
      topoLista = lista.getBoundingClientRect().top + window.scrollY
    }

    const calcularAlvo = () => {
      if (!centros.length) return
      const y = window.innerHeight * 0.45 - (topoLista - window.scrollY)
      alvo = Math.min(Math.max(y, centros[0]), centros[centros.length - 1])
    }

    const desenhar = (y: number) => {
      trem.style.transform = `translate3d(0,${(y - 42).toFixed(1)}px,0)`
      let atual = 0
      for (let i = 0; i < centros.length; i++) if (y >= centros[i] - 24) atual = i + 1
      if (atual !== estacaoAtual) {
        estacaoAtual = atual
        setEstacao(atual)
      }
    }

    const passo = (t: number) => {
      const dt = tAnterior ? Math.min(t - tAnterior, 64) : 16
      tAnterior = t
      const dif = alvo - atualY
      if (Math.abs(dif) < 0.4 || reduz) {
        atualY = alvo
        desenhar(atualY)
        quadro = 0
        tAnterior = 0
        return
      }
      // suavização exponencial independente da taxa de quadros (~150 ms de "inércia")
      atualY += dif * (1 - Math.exp(-dt / 150))
      const sentido = dif > 0 ? 1 : -1
      if (sentido !== sentidoAtual && Math.abs(dif) > 6 && icone) {
        sentidoAtual = sentido
        icone.style.transform = sentido > 0 ? 'rotate(0deg)' : 'rotate(180deg)'
      }
      desenhar(atualY)
      quadro = requestAnimationFrame(passo)
    }

    const aoRolar = () => {
      calcularAlvo()
      if (!quadro) quadro = requestAnimationFrame(passo)
    }
    const aoRedimensionar = () => {
      medir()
      aoRolar()
    }

    medir()
    calcularAlvo()
    atualY = alvo
    desenhar(atualY)

    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRedimensionar)
    const obs = new ResizeObserver(aoRedimensionar)
    obs.observe(lista)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRedimensionar)
      obs.disconnect()
    }
  }, [])

  return { listaRef, tremRef, estacao }
}
