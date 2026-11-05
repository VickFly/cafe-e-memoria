# Café & Memória

Tour interativo pela história do café em São Paulo — trilha com 4 paradas, avaliação com grãos de café, receita desbloqueável e painel da equipe.

React 18 · TypeScript · Tailwind CSS · Lucide · Supabase (opcional) · Vite

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ para publicar
```

## Trocar os nomes dos guias

Edite **apenas** `src/config/tour.ts` → `guias: ['Nome do Guia 1', 'Nome do Guia 2']`.
Tela inicial, avaliação, painel e CSV usam essa lista.

## Armazenamento das avaliações

| Modo | Quando | Onde ficam as respostas |
|---|---|---|
| **Supabase** | `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` definidos | Banco compartilhado; painel mostra todas |
| **Local** | Sem variáveis | Só no navegador de cada participante; o app avisa na tela |

Para o evento, use o **modo Supabase** — no modo local cada celular guarda só a própria resposta.

### Configurar o Supabase (≈10 min, plano gratuito)

1. Crie um projeto em <https://supabase.com>.
2. **SQL Editor** → cole e execute `supabase/schema.sql`.
   - Participantes (anônimos) só conseguem **inserir**; ninguém sem login lê os dados.
3. **Authentication → Users → Add user**: crie o(s) usuário(s) da equipe.
   Em **Authentication → Providers → Email**, desative "Allow new users to sign up".
4. **Settings → API**: copie a *Project URL* e a *anon public key*.
5. Copie `.env.example` para `.env` e preencha (ou cadastre as variáveis na Vercel/Netlify).

## Publicar (Vercel ou Netlify)

- Build command: `npm run build` · Output: `dist`
- Variáveis: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Gere um QR Code do link para os participantes.

## Painel da equipe

Acesse `seu-site/#painel` (link discreto "Área da equipe" no rodapé).
Mostra participantes, nota média, NPS, critérios dos guias do melhor ao pior, respostas de conteúdo, comentários com busca e **Exportar CSV** (separador `;`, abre direto no Excel).

- Modo Supabase: login com usuário do Supabase Auth.
- Modo local: senha `VITE_ADMIN_PASSCODE` (padrão `cafe1911`) — só para testes, não é proteção real.

## Estrutura

```
src/
  config/tour.ts            ← guias, data, horário (configuração central)
  data/historia.ts          ← textos das 4 paradas, linha do tempo, fontes
  data/images.ts            ← imagens do Wikimedia Commons + créditos
  data/avaliacao.ts         ← perguntas, escalas, tipos
  data/receita.ts           ← receita final
  lib/storage.ts            ← Supabase / localStorage
  lib/relatorio.ts          ← médias, NPS, CSV
  components/tour/          ← Início, Introdução, Trilha, Painel da parada, Mapa
  components/form/          ← Formulário em etapas, grãos, escalas
  components/recipe/        ← Agradecimento + receita
  components/admin/         ← Painel da equipe
  components/brand/         ← Ilustrações SVG, Foto com fallback, Rodapé
supabase/schema.sql
```

## Imagens

Carregadas do Wikimedia Commons (`Special:FilePath`, já redimensionadas). Fotos de Guilherme Gaensly (Museu Paulista/USP) são de domínio público; as fotos atuais são Creative Commons — confira autor e licença na página de cada arquivo (links no rodapé do app) antes de usar em material impresso. Se uma imagem não carregar, aparece uma moldura com link para o Commons.

## Funcionalidades

- Progresso do formulário salvo no aparelho (recarregar não perde respostas); voltar etapas preserva tudo.
- Envio único: id gerado no aparelho + chave primária no banco; botão bloqueado durante o envio.
- Acessibilidade: rótulos, navegação por teclado (setas nos grupos de notas), foco visível, erros em texto, `prefers-reduced-motion`.
