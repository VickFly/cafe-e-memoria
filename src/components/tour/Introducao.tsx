import { Building2, Coffee, Landmark, Ship, Sprout, TrainFront, Users } from 'lucide-react'
import { linhaDoTempo, temasIntro } from '../../data/historia'
import { imagens } from '../../data/images'
import { Foto } from '../brand/Foto'
import { Grao } from '../brand/Ilustracoes'

const iconesTemas = [Landmark, Sprout, TrainFront, Users, Building2, Coffee]

export function Introducao() {
  return (
    <section id="historia" aria-labelledby="titulo-historia" className="gutter py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
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
            <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {temasIntro.map((t, i) => {
                const Icone = iconesTemas[i]
                return (
                  <div key={t.titulo} className="flex min-w-0 gap-3 rounded-xl border border-cafe/15 bg-creme/70 p-4">
                    <Icone className="mt-0.5 h-5 w-5 shrink-0 text-oliva" aria-hidden="true" />
                    <div className="min-w-0">
                      <h3 className="font-sans text-[0.95rem] font-semibold text-espresso">{t.titulo}</h3>
                      <p className="text-[0.88rem] leading-snug text-tinta/80">{t.texto}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="min-w-0 lg:pt-10">
            <div className="moldura rotate-[-0.8deg] rounded-2xl p-3">
              <Foto imagem={imagens.colheita} proporcao="4 / 3" />
            </div>
          </div>
        </div>

        <blockquote className="relative mx-auto mt-16 max-w-3xl px-2 text-center">
          <Grao className="mx-auto mb-5 h-6 w-6 text-caramelo" />
          <p className="font-display text-[clamp(1.5rem,5.4vw,2.4rem)] italic leading-tight text-espresso">
            “O café não transformou apenas a economia brasileira. Ele ajudou a construir a cidade que conhecemos hoje.”
          </p>
        </blockquote>

        <div className="mt-16">
          <div className="flex items-center gap-3">
            <Ship className="h-5 w-5 text-caramelo" aria-hidden="true" />
            <h3 className="text-2xl font-bold">Linha do tempo</h3>
          </div>
          <ol className="relative mt-8 grid gap-0 border-l-2 border-dashed border-ouro/70 pl-6 sm:grid-cols-4 sm:gap-y-10 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:pt-8">
            {linhaDoTempo.map((m) => (
              <li key={m.ano} className="relative min-w-0 pb-7 sm:pb-0 sm:pr-6">
                <span
                  className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-caramelo bg-papel sm:-top-[41px] sm:left-0"
                  aria-hidden="true"
                />
                <p className="font-display text-3xl font-bold text-caramelo tabular">{m.ano}</p>
                <p className="mt-1 font-semibold text-espresso">{m.titulo}</p>
                <p className="text-[0.9rem] leading-snug text-tinta/80">{m.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
