# CLAUDE.md — Café & Memória

App web (SPA) que acompanha um tour guiado presencial pelo Centro Histórico de São Paulo, sobre a história do café na cidade. Trabalho acadêmico da USP; tour em 7/11/2026, 13h–15h, saindo da Estação da Luz. Os participantes abrem o link no celular (via QR Code), percorrem a trilha de 4 paradas, avaliam o tour e desbloqueiam uma receita.

**Idioma:** todo texto de interface, comentários e mensagens de commit em **português do Brasil**.

## Stack e comandos

React 18 · TypeScript (strict) · Vite 5 · Tailwind CSS 3 · lucide-react · @supabase/supabase-js. Sem router e sem lib de animação: animações em CSS (keyframes no `tailwind.config.js`) e `requestAnimationFrame`.

```bash
npm run dev          # desenvolvimento (http://localhost:5173)
npm run dev -- --host  # testar no celular pela rede local
npm run build        # tsc -b + vite build → dist/  (rodar SEMPRE antes de commitar)
npm run typecheck    # só checagem de tipos
```

Deploy: Vercel, publicado automaticamente a cada `git push` na `main`. Variáveis na Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Onde fica cada coisa

| Quero mudar… | Arquivo |
|---|---|
| Guias, data, horário, ponto de encontro | `src/config/tour.ts` (fonte única — nunca escrever nomes de guias em componentes) |
| Textos das 4 paradas, linha do tempo, temas da introdução, fontes | `src/data/historia.ts` |
| Imagens e créditos | `src/data/images.ts` |
| Perguntas, critérios, escalas e tipos do formulário | `src/data/avaliacao.ts` |
| Receita final | `src/data/receita.ts` |
| Salvar/listar avaliações (Supabase ou localStorage) | `src/lib/storage.ts` |
| Médias, NPS, CSV do painel | `src/lib/relatorio.ts` |
| Esquema do banco e regras de acesso (RLS) | `supabase/schema.sql` |

Componentes em `src/components/`:
- `tour/` — `Inicio` (tela inicial), `Introducao` (linha do tempo), `Trilha` (trilho + locomotiva guiada pela rolagem, cartões, barra de progresso), `PainelParada` (modal com fotos ontem/hoje), `MapaRota` (esquema SVG com trenzinho).
- `form/` — `Formulario` (5 etapas + validação + envio), `Controles` (grãos de café 1–5, Sim/Parcialmente/Não, NPS 0–10, textarea com contador).
- `recipe/Agradecimento` — tela final + receita desbloqueada + copiar.
- `admin/Painel` — rota `#painel`: login, resumo, comentários, exportar CSV.
- `brand/` — `Ilustracoes` (SVGs lineares), `Locomotiva` (locomotiva lateral, vista de cima e `TremChegando`), `Foto` (imagem com moldura e fallback), `Rodape`.

`App.tsx` controla as telas (`tour` → `form` → `fim`) e salva progresso/rascunho no localStorage (`cafe-memoria:progresso`, `cafe-memoria:rascunho`). Navegação entre etapas preserva respostas.

## Regras de conteúdo (importante — é um trabalho acadêmico)

- **Não inventar fatos, datas, imagens ou relações entre edifícios.** Toda informação histórica nova precisa de fonte; adicione-a em `fontes` em `historia.ts`.
- Manter a **ordem das paradas**: 1 Estação da Luz → 2 Rua XV de Novembro / Rua Anchieta → 3 Largo do Café e antiga Bolsa → 4 Theatro Municipal.
- Rua XV de Novembro e Rua Anchieta são **vias distintas** (cada uma com seus antigos nomes). Largo do Café, Palácio do Café e Bolsa de Valores **não são o mesmo lugar**.
- Pontos ainda não confirmados em fonte: Bolsa no Palácio do Café em **1934**; nome Rua Anchieta oficializado em **1897**. Não reforçar sem fonte.
- O mapa é **esquemático, sem escala**: posições em `esquema` (0–100) só indicam a sequência, não são coordenadas.
- Imagens: só Wikimedia Commons ou acervos com licença adequada, via `Special:FilePath` (helper `img()` em `images.ts`), sempre com legenda e crédito. Fotos históricas recebem filtro sépia automaticamente (`tipo: 'historica'`).

## Regras técnicas

- **Mobile-first.** Testar em ~390px de largura; nunca pode haver rolagem horizontal. Alvos de toque ≥ 44px.
- **Desempenho da locomotiva (`useTremNaRolagem` em `Trilha.tsx`):** a rolagem só define o alvo e um laço de rAF suaviza o movimento. Ao mexer: animar apenas `transform`/`opacity`; não usar filtros CSS (`drop-shadow`, `blur`) em elementos que se movem; não ler layout a cada quadro (posições ficam em cache); não chamar `setState` por quadro.
- **Acessibilidade:** rótulos em todos os campos, grupos de nota com `role="radiogroup"` e setas do teclado, erros em texto (não só cor), foco visível, respeitar `prefers-reduced-motion` (já tratado globalmente em `index.css`).
- **Identidade visual:** usar as cores do Tailwind (`espresso`, `cafe`, `caramelo`, `papel`, `creme`, `oliva`, `ouro`, `tinta`) e as classes utilitárias de `index.css` (`gutter`, `eyebrow`, `btn-primario`, `btn-secundario`, `btn-texto`, `moldura`, `moldura-dupla`, `campo`). Títulos em Playfair Display (`font-display`), texto em Inter. Tema claro único (papel antigo).
- Ao mudar o formato de uma avaliação (`Avaliacao` em `avaliacao.ts`), atualizar juntos: `storage.ts` (`paraLinha`/`deLinha`), `relatorio.ts` (resumo e CSV), `Painel.tsx` e `supabase/schema.sql`.

## Armazenamento e segurança

- **Modo Supabase** quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` existem; senão **modo local** (localStorage), e a interface avisa. Nunca simular envio para um banco inexistente.
- RLS: participante anônimo só **insere**; apenas usuários autenticados (equipe) **leem**. Cadastro público desativado no Supabase.
- O `id` da avaliação é gerado no aparelho: evita envios duplicados (erro `23505` é tratado como sucesso).
- **Nunca** commitar `.env`. **Nunca** usar a chave `secret`/`service_role` no front-end — tudo com prefixo `VITE_` vai para o navegador.
- `VITE_ADMIN_PASSCODE` só vale no modo local e não é proteção real.

## Antes de commitar

1. `npm run build` sem erros.
2. Conferir no navegador em largura de celular: trilha (locomotiva, modal, progresso), formulário (validação, voltar etapa preserva respostas), envio, receita e `#painel`.
3. Commit em português, mensagem curta descrevendo a mudança.

`npm run build:preview` gera um HTML único (`dist-single/`) usado só para prévias; não faz parte do deploy.
