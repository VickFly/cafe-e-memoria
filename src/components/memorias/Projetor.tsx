import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Download, Loader2, Mail, Share2, X } from 'lucide-react'
import { nomesParadas, urlFoto, type FotoTour } from '../../data/memorias'
import { desenharPostal } from './postal'

type Props = {
  fotos: FotoTour[]
  indice: number
  sepia: boolean
  onSepia: (v: boolean) => void
  onIr: (i: number) => void
  onFechar: () => void
}

/**
 * Projetor de slides: a foto em tela cheia, com faixas de filme em cima e embaixo.
 * Deslize para os lados (ou use as setas do teclado), baixe a foto ou transforme-a em cartão-postal.
 */
export function Projetor({ fotos, indice, sepia, onSepia, onIr, onFechar }: Props) {
  const foto = fotos[indice]
  const ref = useRef<HTMLDivElement>(null)
  const arraste = useRef<{ x0: number; dx: number } | null>(null)
  const [deslocamento, setDeslocamento] = useState(0)
  const [carregada, setCarregada] = useState(false)
  const [postal, setPostal] = useState(false)

  const ir = useCallback((d: number) => onIr((indice + d + fotos.length) % fotos.length), [indice, fotos.length, onIr])

  useEffect(() => setCarregada(false), [foto])

  // pré-carrega as vizinhas para a troca ser instantânea
  useEffect(() => {
    ;[-1, 1].forEach((d) => {
      const v = fotos[(indice + d + fotos.length) % fotos.length]
      const i = new Image()
      i.src = urlFoto(v, 'g')
    })
  }, [indice, fotos])

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('[data-foco]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (postal) return
      if (e.key === 'Escape') onFechar()
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      anterior?.focus()
    }
  }, [onFechar, ir, postal])

  const inicio = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    arraste.current = { x0: e.clientX, dx: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (!arraste.current) return
    arraste.current.dx = e.clientX - arraste.current.x0
    setDeslocamento(arraste.current.dx)
  }
  const fim = () => {
    const a = arraste.current
    arraste.current = null
    setDeslocamento(0)
    if (!a) return
    if (a.dx < -60) ir(1)
    else if (a.dx > 60) ir(-1)
  }

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={`Fotograma ${foto.n}, foto ${indice + 1} de ${fotos.length}`} className="fixed inset-0 z-[60] flex flex-col bg-[#120b08] text-creme" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <Perfuracao />
      <div className="gutter flex items-center justify-between gap-3 py-2.5">
        <div className="min-w-0">
          <p className="tabular text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ouro">
            Fotograma {String(foto.n).padStart(2, '0')} · {indice + 1} de {fotos.length}
          </p>
          <p className="truncate font-display text-lg italic text-creme/90">{nomesParadas[foto.parada]}</p>
        </div>
        <button type="button" data-foco onClick={onFechar} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-creme/25 hover:bg-creme/10" aria-label="Fechar o projetor">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y select-none items-center justify-center overflow-hidden"
        onPointerDown={inicio}
        onPointerMove={mover}
        onPointerUp={fim}
        onPointerCancel={fim}
      >
        {!carregada && <Loader2 className="absolute h-8 w-8 animate-spin text-ouro/70" aria-label="Carregando foto" />}
        <img
          key={foto.arquivo}
          src={urlFoto(foto, 'g')}
          alt={`Foto do tour: ${nomesParadas[foto.parada]}`}
          draggable={false}
          onLoad={() => setCarregada(true)}
          className={`max-h-full max-w-full object-contain transition-[opacity,filter] duration-500 ${carregada ? 'opacity-100' : 'opacity-0'} ${sepia ? 'filtro-1911' : ''}`}
          style={{ transform: `translateX(${deslocamento}px)`, transition: deslocamento ? 'none' : undefined }}
        />
        {sepia && <div className="grao-filme pointer-events-none absolute inset-0" aria-hidden="true" />}
        <button type="button" onClick={() => ir(-1)} className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60 sm:grid" aria-label="Foto anterior">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => ir(1)} className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60 sm:grid" aria-label="Próxima foto">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="gutter flex flex-wrap items-center justify-center gap-2 py-3">
        <ChaveEpoca sepia={sepia} onSepia={onSepia} escuro />
        <a href={urlFoto(foto, 'g')} download={`cafe-e-memoria-${String(foto.n).padStart(2, '0')}.webp`} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-creme/25 px-4 text-sm font-semibold hover:bg-creme/10">
          <Download className="h-4 w-4" aria-hidden="true" /> Baixar
        </a>
        <button type="button" onClick={() => setPostal(true)} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ouro px-4 text-sm font-semibold text-espresso hover:bg-[#c9ab74]">
          <Mail className="h-4 w-4" aria-hidden="true" /> Virar cartão-postal
        </button>
      </div>
      <p className="pb-1 text-center text-xs text-creme/60 sm:hidden">Deslize para o lado para ver as outras fotos</p>
      <Perfuracao />

      {postal && <Postal foto={foto} sepiaInicial={sepia} onFechar={() => setPostal(false)} />}
    </div>
  )
}

/** Faixa de perfurações de um rolo de filme 35 mm. */
export function Perfuracao({ claro = false }: { claro?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="h-4 w-full shrink-0"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0 8px, ${claro ? 'rgba(250,247,239,.85)' : 'rgba(250,247,239,.16)'} 8px 20px, transparent 20px 28px)`,
        backgroundSize: '28px 8px',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: '0 50%',
      }}
    />
  )
}

/** Alavanca 2026 ⇄ 1911: aplica o filtro de foto antiga (sépia, grão e vinheta). */
export function ChaveEpoca({ sepia, onSepia, escuro = false }: { sepia: boolean; onSepia: (v: boolean) => void; escuro?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={sepia}
      onClick={() => onSepia(!sepia)}
      className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-2 pr-4 text-sm font-semibold transition ${escuro ? 'border-creme/25 hover:bg-creme/10' : 'border-cafe/25 bg-creme text-espresso hover:border-cafe'}`}
    >
      <span className={`relative h-7 w-[52px] rounded-full transition ${sepia ? 'bg-caramelo' : escuro ? 'bg-creme/20' : 'bg-cafe/20'}`} aria-hidden="true">
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-creme shadow transition-all ${sepia ? 'left-[28px]' : 'left-1'}`} />
      </span>
      <span>
        Ver como em <span className="tabular">1911</span>
      </span>
    </button>
  )
}

function Postal({ foto, sepiaInicial, onFechar }: { foto: FotoTour; sepiaInicial: boolean; onFechar: () => void }) {
  const [sepia, setSepia] = useState(sepiaInicial)
  const [url, setUrl] = useState<string | null>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ativo = true
    let criada: string | null = null
    setUrl(null)
    setErro(null)
    desenharPostal(foto, sepia)
      .then(
        (c) =>
          new Promise<void>((ok) =>
            c.toBlob(
              (b) => {
                if (!ativo || !b) return ok()
                criada = URL.createObjectURL(b)
                setUrl(criada)
                setArquivo(new File([b], `postal-cafe-e-memoria-${String(foto.n).padStart(2, '0')}.jpg`, { type: 'image/jpeg' }))
                ok()
              },
              'image/jpeg',
              0.9,
            ),
          ),
      )
      .catch(() => ativo && setErro('Não foi possível montar o cartão-postal agora. Tente de novo.'))
    return () => {
      ativo = false
      if (criada) URL.revokeObjectURL(criada)
    }
  }, [foto, sepia])

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[data-foco]')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onFechar])

  const podeCompartilhar = Boolean(arquivo && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [arquivo] }))
  const compartilhar = async () => {
    if (!arquivo) return
    try {
      await navigator.share({ files: [arquivo], title: 'Café & Memória', text: 'Lembrança do tour pela história do café em São Paulo' })
    } catch {
      /* a pessoa cancelou */
    }
  }

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="titulo-postal" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-papel text-tinta shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-cafe/10 px-5 py-3">
          <h2 id="titulo-postal" className="font-display text-xl font-bold text-espresso">Seu cartão-postal</h2>
          <button type="button" data-foco onClick={onFechar} className="grid h-11 w-11 place-items-center rounded-full border border-cafe/20 text-cafe hover:bg-creme" aria-label="Fechar cartão-postal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-auto bg-[#E9DDC8] p-4">
          {erro ? (
            <p className="text-sm text-cafe">{erro}</p>
          ) : url ? (
            <img src={url} alt="Cartão-postal com a foto do tour, selo de café e carimbo de 14 de novembro de 2026" className="max-h-[60vh] w-auto max-w-full rotate-[-1deg] rounded-sm shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]" />
          ) : (
            <p className="flex items-center gap-2 text-sm text-cafe">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Revelando o cartão-postal…
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 px-5 py-4">
          <ChaveEpoca sepia={sepia} onSepia={setSepia} />
          {url && (
            <a href={url} download={arquivo?.name} className="btn-primario min-h-[44px] px-5 text-sm">
              <Download className="h-4 w-4" aria-hidden="true" /> Baixar postal
            </a>
          )}
          {podeCompartilhar && (
            <button type="button" onClick={compartilhar} className="btn-secundario min-h-[44px] px-5 text-sm">
              <Share2 className="h-4 w-4" aria-hidden="true" /> Compartilhar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
