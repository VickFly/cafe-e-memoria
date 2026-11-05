import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Imagem } from '../../data/images'
import { Selo } from './Ilustracoes'

type Props = {
  imagem: Imagem
  className?: string
  /** Proporção do quadro, ex.: '4 / 3'. */
  proporcao?: string
  prioridade?: boolean
  semLegenda?: boolean
}

/** Fotografia com moldura de documento antigo. Se a imagem falhar, mostra uma moldura ilustrada com o crédito. */
export function Foto({ imagem, className = '', proporcao = '4 / 3', prioridade, semLegenda }: Props) {
  const [estado, setEstado] = useState<'carregando' | 'ok' | 'erro'>('carregando')
  // tenta primeiro a cópia do próprio site; se faltar, usa o Commons; se falhar de novo, mostra a moldura
  const [usarReserva, setUsarReserva] = useState(false)

  return (
    <figure className={`min-w-0 ${className}`}>
      <div
        className="relative w-full max-w-full overflow-hidden rounded-[10px] bg-[#E7DCC8] ring-1 ring-cafe/20"
        style={{ aspectRatio: proporcao }}
      >
        {estado !== 'erro' && (
          <img
            src={usarReserva ? imagem.reserva : imagem.src}
            alt={imagem.legenda}
            loading={prioridade ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setEstado('ok')}
            onError={() => (usarReserva ? setEstado('erro') : setUsarReserva(true))}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              imagem.tipo === 'historica' ? 'sepia' : ''
            } ${estado === 'ok' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {estado === 'carregando' && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#EADFCB] to-[#DDCDB2]" aria-hidden="true" />
        )}
        {estado === 'erro' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-cafe">
            <Selo className="h-16 w-16 text-ouro" />
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <ImageOff className="h-4 w-4" aria-hidden="true" /> Imagem indisponível agora
            </span>
            <a href={imagem.pagina} target="_blank" rel="noreferrer" className="text-xs underline underline-offset-2">
              Ver no Wikimedia Commons
            </a>
          </div>
        )}
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-espresso/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-creme">
          {imagem.tipo === 'historica' ? 'Acervo histórico' : 'Hoje'}
        </span>
      </div>
      {!semLegenda && (
        <figcaption className="mt-2 text-[0.78rem] leading-snug text-cafe/80">
          <span className="font-medium text-cafe">{imagem.legenda}.</span>{' '}
          <a href={imagem.pagina} target="_blank" rel="noreferrer" className="underline decoration-cafe/30 underline-offset-2 hover:decoration-cafe">
            {imagem.credito}
          </a>
        </figcaption>
      )}
    </figure>
  )
}
