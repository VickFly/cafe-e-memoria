import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, Download, HardDrive, Loader2, LogOut, MessageSquareQuote, RefreshCw, Search, Users } from 'lucide-react'
import { rotulosNota, type Avaliacao } from '../../data/avaliacao'
import { tourConfig } from '../../config/tour'
import { listarAvaliacoes, modo, supabase } from '../../lib/storage'
import { baixarCSV, resumir } from '../../lib/relatorio'
import { Grao } from '../brand/Ilustracoes'
import { MensagemErro } from '../form/Controles'

const SENHA_LOCAL = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined) || 'cafe1911'

export function Painel({ onSair }: { onSair: () => void }) {
  const [autenticado, setAutenticado] = useState(false)
  const [verificando, setVerificando] = useState(modo === 'supabase')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setAutenticado(Boolean(data.session))
      setVerificando(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setAutenticado(Boolean(s)))
    return () => data.subscription.unsubscribe()
  }, [])

  const sair = async () => {
    if (supabase) await supabase.auth.signOut()
    setAutenticado(false)
  }

  return (
    <main className="gutter min-h-[100dvh] pb-16 pt-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn-texto text-sm" onClick={onSair}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar ao tour
          </button>
          {autenticado && (
            <button type="button" className="btn-texto text-sm" onClick={sair}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
            </button>
          )}
        </div>
        <p className="eyebrow mt-6">Área da equipe</p>
        <h1 className="mt-2 text-[clamp(2rem,7vw,3rem)] font-bold leading-tight">Painel de avaliações</h1>
        {modo === 'local' && (
          <p className="mt-4 flex max-w-2xl gap-2.5 rounded-xl border border-dashed border-caramelo/60 bg-caramelo/10 p-3.5 text-sm text-cafe">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span><strong>Modo local.</strong> Este painel mostra apenas as avaliações salvas neste navegador. Para reunir as respostas de todos os participantes, conecte o Supabase (veja o README).</span>
          </p>
        )}
        {verificando ? (
          <Loader2 className="mt-10 h-6 w-6 animate-spin text-cafe" aria-label="Carregando" />
        ) : autenticado ? (
          <Dados />
        ) : (
          <Login onEntrar={() => setAutenticado(true)} />
        )}
      </div>
    </main>
  )
}

function Login({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const entrar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    if (supabase) {
      setCarregando(true)
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
      setCarregando(false)
      if (error) return setErro('E-mail ou senha incorretos. Use um usuário criado no Supabase Auth.')
      return onEntrar()
    }
    if (senha === SENHA_LOCAL) onEntrar()
    else setErro('Senha incorreta.')
  }

  return (
    <form onSubmit={entrar} className="moldura mt-8 max-w-md space-y-4 rounded-3xl p-6" noValidate>
      <p className="text-sm text-cafe/80">
        {modo === 'supabase' ? 'Entre com o usuário da equipe cadastrado no Supabase.' : 'Digite a senha do painel definida em VITE_ADMIN_PASSCODE.'}
      </p>
      {modo === 'supabase' && (
        <div>
          <label htmlFor="admin-email" className="font-medium text-espresso">E-mail</label>
          <input id="admin-email" type="email" autoComplete="username" className="campo mt-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      )}
      <div>
        <label htmlFor="admin-senha" className="font-medium text-espresso">Senha</label>
        <input id="admin-senha" type="password" autoComplete="current-password" className="campo mt-2" value={senha} onChange={(e) => setSenha(e.target.value)} required />
      </div>
      {erro && <MensagemErro texto={erro} />}
      <button type="submit" className="btn-primario w-full" disabled={carregando}>
        {carregando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Entrar
      </button>
    </form>
  )
}

function Dados() {
  const [lista, setLista] = useState<Avaliacao[] | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const carregar = useCallback(async () => {
    setErro(null)
    try {
      setLista(await listarAvaliacoes())
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar.')
    }
  }, [])
  useEffect(() => { carregar() }, [carregar])

  const r = useMemo(() => resumir(lista ?? []), [lista])
  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return (lista ?? []).filter((a) => !q || [a.nome, a.marcante, a.sugestao, a.aprender].some((t) => t.toLowerCase().includes(q)))
  }, [lista, busca])

  if (erro) return <div className="mt-8"><MensagemErro texto={erro} /><button className="btn-secundario mt-4" onClick={carregar}>Tentar novamente</button></div>
  if (!lista) return <Loader2 className="mt-10 h-6 w-6 animate-spin text-cafe" aria-label="Carregando avaliações" />

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primario" onClick={() => baixarCSV(lista)} disabled={!lista.length}>
          <Download className="h-4 w-4" aria-hidden="true" /> Exportar CSV
        </button>
        <button type="button" className="btn-secundario" onClick={carregar}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Atualizar
        </button>
      </div>

      {!lista.length ? (
        <div className="moldura rounded-3xl p-8 text-center">
          <Grao className="mx-auto h-8 w-6 text-caramelo" />
          <p className="mt-3 font-display text-xl font-bold">Nenhuma avaliação ainda</p>
          <p className="mt-1 text-cafe/80">Elas aparecem aqui assim que os participantes enviarem o formulário.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Numero rotulo="Participantes" valor={String(r.total)} icone={<Users className="h-4 w-4" />} />
            <Numero rotulo="Nota média do tour" valor={r.geral.toFixed(1).replace('.', ',')} extra="de 5 grãos" />
            <Numero rotulo="NPS" valor={String(r.nps)} extra={`${r.promotores} promotores · ${r.detratores} detratores`} />
            <Numero rotulo="Recomendação média" valor={r.mediaRecomendacao.toFixed(1).replace('.', ',')} extra="de 10" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="moldura min-w-0 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Condução dos guias</h2>
              <p className="text-sm text-cafe/70">Do mais bem avaliado ao menos · {tourConfig.guias.join(', ')}</p>
              <ul className="mt-4 space-y-3">
                {r.criterios.map((c, i) => (
                  <li key={c.id}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="min-w-0 font-medium text-espresso">{i === 0 && '★ '}{c.label}</span>
                      <span className="tabular shrink-0 font-semibold text-cafe">{c.media.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-cafe/10"><div className="h-full rounded-full bg-oliva" style={{ width: `${(c.media / 5) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="moldura min-w-0 rounded-2xl p-5">
              <h2 className="text-xl font-bold">Distribuição da nota geral</h2>
              <ul className="mt-4 space-y-2.5">
                {r.distribuicao.map((n, i) => (
                  <li key={i} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="text-cafe">{i + 1} · {rotulosNota[i]}</span>
                    <div className="h-3 rounded-full bg-cafe/10"><div className="h-full rounded-full bg-caramelo" style={{ width: `${r.total ? (n / r.total) * 100 : 0}%` }} /></div>
                    <span className="tabular text-right font-semibold text-espresso">{n}</span>
                  </li>
                ))}
              </ul>
              <h2 className="mt-6 text-xl font-bold">Conteúdo</h2>
              <ul className="mt-3 space-y-3">
                {r.conteudo.map((c) => (
                  <li key={c.id} className="text-sm">
                    <p className="text-espresso">{c.label}</p>
                    <p className="tabular mt-0.5 text-cafe">Sim {c.sim} · Parcialmente {c.parcialmente} · Não {c.nao}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="flex items-center gap-2 text-2xl font-bold"><MessageSquareQuote className="h-6 w-6 text-caramelo" aria-hidden="true" /> Comentários</h2>
              <label className="relative w-full max-w-xs">
                <span className="sr-only">Buscar nos comentários</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cafe/50" aria-hidden="true" />
                <input className="campo pl-9" placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
              </label>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {filtradas.map((a) => (
                <li key={a.id} className="moldura min-w-0 rounded-2xl p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-espresso">{a.nome}</span>
                    <span className="tabular text-xs text-cafe/70">{new Date(a.enviadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-caramelo" aria-label={`Nota ${a.notaGeral} de 5`}>
                    {Array.from({ length: 5 }, (_, i) => <Grao key={i} cheio={i < a.notaGeral} className="h-4 w-3" />)}
                    <span className="ml-1">· recomendação {a.recomendacao}/10</span>
                  </p>
                  <p className="mt-3 break-words text-[0.95rem] text-tinta/90">“{a.marcante}”</p>
                  {a.sugestao && <p className="mt-2 break-words text-sm text-cafe"><strong>Sugestão:</strong> {a.sugestao}</p>}
                  {a.aprender && <p className="mt-1 break-words text-sm text-cafe"><strong>Gostaria de aprender:</strong> {a.aprender}</p>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function Numero({ rotulo, valor, extra, icone }: { rotulo: string; valor: string; extra?: string; icone?: React.ReactNode }) {
  return (
    <div className="moldura min-w-0 rounded-2xl p-4">
      <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cafe/70">{icone}{rotulo}</p>
      <p className="tabular mt-1 font-display text-4xl font-bold text-espresso">{valor}</p>
      {extra && <p className="text-xs text-cafe/70">{extra}</p>}
    </div>
  )
}
