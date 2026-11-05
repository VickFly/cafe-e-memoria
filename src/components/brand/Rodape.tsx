import { tourConfig } from '../../config/tour'
import { fontes } from '../../data/historia'
import { imagens } from '../../data/images'
import { modo } from '../../lib/storage'
import { Selo } from './Ilustracoes'

export function Rodape() {
  return (
    <footer className="gutter mt-6 bg-espresso pb-10 pt-12 text-creme/85">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.2fr_1.2fr]">
        <div className="min-w-0">
          <Selo className="h-20 w-20 text-ouro" />
          <p className="mt-4 font-display text-2xl font-bold text-creme">{tourConfig.nome}</p>
          <p className="text-sm">{tourConfig.slogan}</p>
          <p className="mt-3 text-sm">{tourConfig.instituicao} · {tourConfig.data}</p>
        </div>
        <div className="min-w-0">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ouro">Fontes consultadas</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {fontes.map((f) => (
              <li key={f.url}><a className="underline decoration-creme/25 underline-offset-2 hover:decoration-creme" href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ouro">Créditos das imagens</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {Object.values(imagens).map((i) => (
              <li key={i.src}><a className="underline decoration-creme/25 underline-offset-2 hover:decoration-creme" href={i.pagina} target="_blank" rel="noreferrer">{i.legenda}</a> — {i.credito}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-creme/60">Ilustrações vetoriais criadas para este projeto.</p>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-creme/10 pt-5 text-xs text-creme/55">
        <span>Projeto acadêmico sem fins comerciais.{modo === 'local' ? ' Armazenamento: modo local (apenas neste aparelho).' : ''}</span>
        <a href="#painel" className="underline underline-offset-2 hover:text-creme">Área da equipe</a>
      </div>
    </footer>
  )
}
