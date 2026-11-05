import { ArrowDown, CalendarDays, Clock, GraduationCap, MapPin } from 'lucide-react'
import { guiasTexto, tourConfig } from '../../config/tour'
import { imagens } from '../../data/images'
import { Foto } from '../brand/Foto'
import { Grao, Ramo, Selo } from '../brand/Ilustracoes'
import { TremChegando } from '../brand/Locomotiva'

export function Inicio({ onComecar }: { onComecar: () => void }) {
  const info = [
    { icone: CalendarDays, rotulo: 'Data', valor: tourConfig.data },
    { icone: Clock, rotulo: 'Horário', valor: tourConfig.horario },
    { icone: MapPin, rotulo: 'Encontro', valor: tourConfig.pontoEncontro },
    { icone: GraduationCap, rotulo: 'Instituição', valor: tourConfig.instituicao },
  ]

  return (
    <header className="gutter relative overflow-hidden pb-14 pt-8 sm:pt-12">
      <Ramo className="pointer-events-none absolute -right-10 top-4 w-56 rotate-[-8deg] text-oliva/60 sm:w-80" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative min-w-0 animate-rise">
          <p className="eyebrow flex items-center gap-2">
            <Grao className="h-3.5 w-3.5 text-caramelo" /> Tour guiado · Centro Histórico
          </p>
          <h1 className="mt-4 font-display text-[clamp(3rem,13vw,6.2rem)] font-extrabold leading-[0.92] tracking-[-0.02em]">
            Café
            <span className="mx-2 inline-block font-medium italic text-caramelo">&amp;</span>
            <br />
            Memória
          </h1>
          <p className="mt-5 max-w-[34ch] font-display text-xl italic leading-snug text-cafe sm:text-2xl">
            Uma viagem pela história do café e pelas transformações que moldaram São Paulo.
          </p>
          <p className="mt-5 max-w-[56ch] text-[1.02rem] text-tinta/85">
            Entre 1867 e 1922, o dinheiro do café trouxe trilhos, imigrantes, bancos e teatros para uma cidade que ainda era
            pequena. Vamos percorrer <strong className="font-semibold text-espresso">quatro pontos históricos</strong> que
            contam essa transformação, do primeiro apito do trem ao palco do modernismo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button type="button" className="btn-primario px-8 text-[0.95rem] tracking-[0.12em]" onClick={onComecar}>
              COMEÇAR EXPERIÊNCIA <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm text-cafe/80">4 paradas · cerca de 2 horas</span>
          </div>
        </div>

        <div className="relative min-w-0 animate-rise [animation-delay:120ms]">
          <div className="moldura moldura-dupla rotate-[0.6deg] rounded-2xl p-3 sm:p-4">
            <Foto imagem={imagens.panorama} proporcao="5 / 4" prioridade />
          </div>
          <Selo className="absolute -right-2 -top-8 h-24 w-24 rotate-[12deg] text-caramelo/80 sm:h-28 sm:w-28" />
        </div>
      </div>

      <div className="-mx-[max(16px,env(safe-area-inset-left,0px))] mt-10 sm:mt-6">
        <TremChegando />
      </div>

      <div className="mx-auto mt-8 max-w-6xl">
        <dl className="moldura grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-cafe/10 lg:grid-cols-4">
          {info.map(({ icone: Icone, rotulo, valor }) => (
            <div key={rotulo} className="flex min-w-0 items-start gap-3 bg-creme p-4 sm:p-5">
              <Icone className="mt-0.5 h-5 w-5 shrink-0 text-caramelo" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cafe/70">{rotulo}</dt>
                <dd className="font-medium leading-snug text-espresso">{valor}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="mt-8 rounded-2xl border border-dashed border-ouro/70 p-5 sm:p-6">
          <p className="eyebrow">Seus guias nesta viagem</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1" aria-label={`Guias: ${guiasTexto()}`}>
            {tourConfig.guias.map((g) => (
              <li key={g} className="font-display text-[1.65rem] italic leading-snug text-espresso">{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
