import { useRef, useState, type ReactNode } from 'react'
import { Building2, ChevronLeft, ChevronRight, Coffee, Landmark, Ship, Sprout, TrainFront, Users } from 'lucide-react'
import { linhaDoTempo, temasIntro } from '../../data/historia'
import { imagens } from '../../data/images'
import { Foto } from '../brand/Foto'
import { Grao } from '../brand/Ilustracoes'

const iconesTemas = [Landmark, Sprout, TrainFront, Users, Building2, Coffee]

/** Recuo à esquerda que alinha o primeiro cartão com o texto, deixando o carrossel sangrar até a borda. */
const RECUO = 'pl-[max(16px,calc((100vw-72rem)/2+16px))] pr-4'

export function Introducao() {
  return (
    <section id="historia" aria-labelledby="titulo-historia" className="overflow-hidden py-16 sm:py-20">
      <div className="gutter mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow">Capítulo I · O ouro verde</p>
            <h2 id="titulo-historia" className="mt-3 text-[clamp(2rem,7vw,3.2rem)] font-bold leading-[1.05]">
              Como um grão mudou o mapa de uma cidade
            </h2>
            <p className="mt-5 max-w-[60ch] text-tinta/85">
              Em 1872, São Paulo era só a nona cidade do país. O café plantado no interior precisava chegar ao porto, e o
              caminho passava pela capital. Com ele vieram ferrovias, bancos, imigrantes e uma elite disposta a refazer a
              cidade à imagem da Europa.
            </p>
          </div>
          <div className="min-w-0">
            <div className="moldura rotate-[-0.8deg] rounded-2xl p-3">
              <Foto imagem={imagens.colheita} proporcao="4 / 3" />
            </div>
          </div>
        </div>
      </div>

      {/* Seis marcas do café: cartões deslizáveis */}
      <Carrossel
        titulo="Seis marcas do café na cidade"
        icone={<Coffee className="h-5 w-5 text-caramelo-texto" aria-hidden="true" />}
        total={temasIntro.length}
        rotuloItem={(i) => temasIntro[i].titulo}
        className="mt-14"
      >
        {temasIntro.map((t, i) => {
          const Icone = iconesTemas[i]
          return (
            <li key={t.titulo} className="w-[78%] max-w-[290px] shrink-0 snap-start sm:w-[290px]">
              <article className="moldura moldura-dupla relative flex h-full min-h-[214px] flex-col justify-between overflow-hidden rounded-2xl p-5">
                <span aria-hidden="true" className="absolute right-5 top-3 font-display text-5xl font-bold text-ouro/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-espresso text-ouro">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="mt-8">
                  <h4 className="font-display text-2xl font-bold text-espresso">{t.titulo}</h4>
                  <p className="mt-1 text-[0.94rem] leading-snug text-tinta/85">{t.texto}</p>
                </div>
              </article>
            </li>
          )
        })}
      </Carrossel>

      <blockquote className="gutter relative mx-auto mt-16 max-w-3xl text-center">
        <Grao className="mx-auto mb-5 h-6 w-6 text-caramelo-texto" />
        <p className="font-display text-[clamp(1.5rem,5.4vw,2.4rem)] italic leading-tight text-espresso">
          “O café não transformou apenas a economia brasileira. Ele ajudou a construir a cidade que conhecemos hoje.”
        </p>
      </blockquote>

      {/* Linha do tempo desenhada como uma ferrovia: cada ano é uma parada sobre o trilho */}
      <Carrossel
        titulo="Linha do tempo"
        icone={<Ship className="h-5 w-5 text-caramelo-texto" aria-hidden="true" />}
        total={linhaDoTempo.length}
        rotuloItem={(i) => linhaDoTempo[i].ano}
        className="mt-16"
        lista="ol"
        gap="gap-0"
      >
        {linhaDoTempo.map((m, i) => {
          const primeiro = i === 0
          const ultimo = i === linhaDoTempo.length - 1
          return (
            <li key={m.ano} className="relative w-[210px] shrink-0 snap-start pr-6 pt-11">
              <span aria-hidden="true" className={`absolute top-[15px] h-[3px] bg-espresso ${primeiro ? 'left-[10px]' : 'left-0'} ${ultimo ? 'right-[190px]' : 'right-0'}`} />
              <span aria-hidden="true" className={`absolute top-[9px] h-[15px] bg-[repeating-linear-gradient(90deg,rgba(91,57,40,.45)_0_5px,transparent_5px_15px)] ${primeiro ? 'left-[10px]' : 'left-0'} ${ultimo ? 'right-[190px]' : 'right-0'}`} />
              <span aria-hidden="true" className="absolute left-0 top-[6px] h-[21px] w-[21px] rounded-full border-[3px] border-espresso bg-ouro" />
              <p className="tabular font-display text-[2.2rem] font-bold leading-none text-caramelo-texto">{m.ano}</p>
              <p className="mt-2 font-semibold leading-snug text-espresso">{m.titulo}</p>
              <p className="mt-1 text-[0.9rem] leading-snug text-tinta/80">{m.texto}</p>
            </li>
          )
        })}
      </Carrossel>
    </section>
  )
}

type CarrosselProps = {
  titulo: string
  icone: ReactNode
  total: number
  rotuloItem: (i: number) => string
  children: ReactNode
  className?: string
  lista?: 'ul' | 'ol'
  gap?: string
}

/**
 * Carrossel com encaixe: no celular desliza com o dedo; no desktop tem setas.
 * Os pontos mostram onde a pessoa está e levam direto a qualquer item.
 */
function Carrossel({ titulo, icone, total, rotuloItem, children, className = '', lista = 'ul', gap = 'gap-3' }: CarrosselProps) {
  const trilho = useRef<HTMLOListElement & HTMLUListElement>(null)
  const [ativo, setAtivo] = useState(0)
  const [noFim, setNoFim] = useState(false)
  // item escolhido pelos pontos/setas: no fim do trilho vários ficam visíveis, e o escolhido continua marcado
  const escolhido = useRef<number | null>(null)

  const aoRolar = () => {
    const el = trilho.current
    if (!el) return
    const itens = Array.from(el.children) as HTMLElement[]
    const base = itens[0]?.offsetLeft ?? 0
    let i = 0
    itens.forEach((it, k) => {
      if (it.offsetLeft - base <= el.scrollLeft + 8) i = k
    })
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    setNoFim(fim)
    setAtivo(fim ? escolhido.current ?? total - 1 : i)
  }
  const ir = (i: number) => {
    const el = trilho.current
    const k = Math.max(0, Math.min(total - 1, i))
    escolhido.current = k
    setAtivo(k)
    const alvo = el?.children[k] as HTMLElement | undefined
    if (el && alvo) el.scrollTo({ left: alvo.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: 'smooth' })
  }

  const Lista = lista
  return (
    <div className={className}>
      <div className="gutter mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {icone}
          <h3 className="text-2xl font-bold">{titulo}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm text-cafe sm:hidden">Deslize</span>
          <button type="button" onClick={() => ir(ativo - 1)} disabled={ativo === 0} aria-label={`${titulo}: anterior`} className="hidden h-11 w-11 place-items-center rounded-full border border-cafe/30 text-cafe transition hover:border-cafe hover:bg-creme disabled:opacity-35 sm:grid">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => ir(ativo + 1)} disabled={noFim} aria-label={`${titulo}: próximo`} className="hidden h-11 w-11 place-items-center rounded-full border border-cafe/30 text-cafe transition hover:border-cafe hover:bg-creme disabled:opacity-35 sm:grid">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <Lista
        ref={trilho}
        onScroll={aoRolar}
        onPointerDown={() => (escolhido.current = null)}
        onWheel={() => (escolhido.current = null)}
        aria-label={titulo}
        className={`mt-5 flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${gap} ${RECUO}`}
      >
        {children}
      </Lista>
      <div className="mt-2 flex justify-center" role="tablist" aria-label={`${titulo}: escolher item`}>
        {Array.from({ length: total }, (_, i) => (
          <button key={i} type="button" role="tab" aria-selected={ativo === i} aria-label={`${i + 1} de ${total}: ${rotuloItem(i)}`} onClick={() => ir(i)} className="grid h-8 w-6 place-items-center">
            <span className={`block h-1.5 rounded-full transition-all duration-300 ${ativo === i ? 'w-5 bg-espresso' : 'w-1.5 bg-cafe/30'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
