import { useEffect, useState } from 'react'
import { Check, Copy, HardDrive, Lock, RotateCcw, Unlock } from 'lucide-react'
import { modo } from '../../lib/storage'
import { receita, receitaComoTexto } from '../../data/receita'
import { CopoGelado, Grao, Ramo, Xicara } from '../brand/Ilustracoes'

export function Agradecimento({ nome, onVoltarTrilha, onNovaAvaliacao }: { nome: string; onVoltarTrilha: () => void; onNovaAvaliacao: () => void }) {
  const [revelada, setRevelada] = useState(false)
  const [copiado, setCopiado] = useState<'ok' | 'manual' | null>(null)
  const primeiroNome = nome.trim().split(/\s+/)[0]

  useEffect(() => {
    window.scrollTo({ top: 0 })
    const reduz = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => setRevelada(true), reduz ? 0 : 2400)
    return () => clearTimeout(t)
  }, [])

  const copiar = async () => {
    const texto = receitaComoTexto()
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado('ok')
    } catch {
      const area = document.getElementById('receita-texto') as HTMLTextAreaElement | null
      if (area) {
        area.hidden = false
        area.select()
      }
      setCopiado('manual')
    }
    setTimeout(() => setCopiado((c) => (c === 'ok' ? null : c)), 2500)
  }

  return (
    <section className="gutter pb-20 pt-10" aria-labelledby="titulo-obrigado">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative mx-auto h-40 w-44">
          <Xicara className="absolute inset-0 h-full w-full" animar cheia={1} title="Xícara de café sendo preenchida" />
          {[18, 46, 74].map((x, i) => (
            <Grao key={x} className="absolute top-0 h-4 w-3 animate-fall text-cafe" style={{ left: `${x}%`, animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>
        <p className="eyebrow mt-6">Avaliação {modo === 'local' ? 'salva' : 'enviada'}{primeiroNome ? `, ${primeiroNome}` : ''}</p>
        <h1 id="titulo-obrigado" className="mt-3 text-[clamp(2.1rem,8vw,3.4rem)] font-bold leading-[1.05]">
          Obrigado por fazer parte dessa história!
        </h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-lg text-tinta/85">
          Sua participação ajuda a preservar, compartilhar e valorizar a história do café e da cidade de São Paulo.
        </p>
        {modo === 'local' && (
          <p className="mx-auto mt-5 inline-flex max-w-[52ch] items-start gap-2 rounded-xl border border-dashed border-caramelo/60 bg-caramelo/10 px-4 py-3 text-left text-sm text-cafe">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Modo local: a avaliação foi salva apenas neste aparelho, sem envio para um banco de dados.
          </p>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        {!revelada ? (
          <div className="moldura mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl p-8 text-center" aria-live="polite">
            <Lock className="h-7 w-7 text-caramelo-texto" aria-hidden="true" />
            <p className="font-display text-xl font-bold">Preparando uma surpresa…</p>
            <button type="button" className="btn-texto text-sm" onClick={() => setRevelada(true)}>Mostrar agora</button>
          </div>
        ) : (
          <article className="moldura moldura-dupla animate-rise overflow-hidden rounded-3xl" aria-labelledby="titulo-receita">
            <div className="flex items-center justify-center gap-2 bg-espresso px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-ouro">
              <Unlock className="h-4 w-4" aria-hidden="true" /> Receita desbloqueada!
            </div>
            <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative grid min-w-0 place-items-center bg-[#EADBC4] p-8">
                <Ramo className="absolute left-3 top-3 w-28 text-oliva/50" />
                <CopoGelado className="h-60 w-auto drop-shadow-[0_18px_20px_rgba(50,29,22,.25)]" title="Ilustração de um copo de café gelado cremoso" />
              </div>
              <div className="min-w-0 p-6 text-left sm:p-8">
                <h2 id="titulo-receita" className="text-[clamp(1.8rem,6vw,2.4rem)] font-bold leading-tight">{receita.titulo}</h2>
                <p className="mt-2 text-cafe/85">{receita.descricao}</p>
                <p className="mt-2 text-sm font-medium text-oliva">{receita.rendimento} · {receita.tempo}</p>

                <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-cafe">Ingredientes</h3>
                <ul className="mt-3 grid gap-2">
                  {receita.ingredientes.map((ing) => (
                    <li key={ing.item} className="flex items-baseline gap-3 rounded-lg bg-papel/70 px-3 py-2">
                      <Grao className="h-3 w-2.5 shrink-0 translate-y-0.5 text-caramelo-texto" />
                      <span className="tabular min-w-[5.5rem] font-semibold text-espresso">{ing.qtd}</span>
                      <span className="min-w-0 text-tinta/90">{ing.item}{ing.opcional && <em className="text-cafe/80"> (opcional)</em>}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-cafe">Modo de preparo</h3>
                <ol className="mt-3 space-y-3">
                  {receita.passos.map((p, i) => (
                    <li key={p} className="flex gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-espresso font-display font-bold text-creme">{i + 1}</span>
                      <span className="pt-1 text-tinta/90">{p}</span>
                    </li>
                  ))}
                </ol>

                <button type="button" className="btn-primario mt-7 w-full sm:w-auto" onClick={copiar}>
                  {copiado === 'ok' ? <><Check className="h-4 w-4" aria-hidden="true" /> Receita copiada!</> : <><Copy className="h-4 w-4" aria-hidden="true" /> Copiar receita</>}
                </button>
                <p className="sr-only" aria-live="polite">{copiado === 'ok' ? 'Receita copiada para a área de transferência.' : ''}</p>
                {copiado === 'manual' && <p className="mt-2 text-sm text-cafe">Não deu para copiar automaticamente. O texto foi selecionado abaixo: use Copiar no seu aparelho.</p>}
                <textarea id="receita-texto" hidden readOnly className="campo mt-3 h-40 text-sm" defaultValue={receitaComoTexto()} aria-label="Texto da receita para copiar" />
              </div>
            </div>
          </article>
        )}

        <p className="mx-auto mt-12 max-w-[30ch] text-center font-display text-2xl italic leading-snug text-espresso">
          “Uma boa história merece ser compartilhada. Um bom café também!”
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-secundario" onClick={onVoltarTrilha}>Rever a trilha</button>
          <button type="button" className="btn-texto text-sm" onClick={onNovaAvaliacao}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Nova avaliação neste aparelho
          </button>
        </div>
      </div>
    </section>
  )
}
