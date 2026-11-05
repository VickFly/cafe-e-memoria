import commons from './imagens-commons.json'

/**
 * Imagens do Wikimedia Commons.
 *  - `src`: cópia servida pelo próprio site (public/img/<chave>.jpg), baixada no build por
 *    scripts/baixar-imagens.mjs. É rápida e não depende do Commons no dia do tour.
 *  - `reserva`: o mesmo arquivo direto do Commons (Special:FilePath, já redimensionado),
 *    usado automaticamente se a cópia local não existir.
 *
 * Autores e licenças conferidos nas páginas do Commons em 05/11/2026.
 * Para trocar uma foto: edite src/data/imagens-commons.json e a entrada correspondente abaixo.
 */
export type Imagem = {
  src: string
  reserva: string
  pagina: string
  legenda: string
  credito: string
  tipo: 'historica' | 'atual'
}

type Chave = keyof typeof commons

const img = (chave: Chave, legenda: string, credito: string, tipo: Imagem['tipo']): Imagem => {
  const { arquivo, largura } = commons[chave]
  return {
    src: `/img/${chave}.jpg`,
    reserva: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=${largura}`,
    pagina: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replace(/ /g, '_'))}`,
    legenda,
    credito,
    tipo,
  }
}

const GAENSLY = 'Guilherme Gaensly · Acervo do Museu Paulista da USP · Wikimedia Commons (domínio público)'

export const imagens = {
  panorama: img('panorama', 'Panorama de São Paulo no início do século XX', GAENSLY, 'historica'),
  colheita: img('colheita', 'Colheita de café no interior paulista', GAENSLY, 'historica'),
  luzHistorica: img('luzHistorica', 'Estação da Luz no início do século XX', GAENSLY, 'historica'),
  luzAtual: img('luzAtual', 'Estação da Luz hoje', 'Foto: Wilfredor · Wikimedia Commons (CC0)', 'atual'),
  ruaXvHistorica: img('ruaXvHistorica', 'Rua XV de Novembro no início do século XX', GAENSLY, 'historica'),
  ruaXv1920: img('ruaXv1920', 'Rua XV de Novembro por volta de 1920', 'Guilherme Gaensly · Wikimedia Commons (domínio público)', 'historica'),
  patioAtual: img('patioAtual', 'Pátio do Colégio hoje, a poucos passos da Rua Anchieta', 'Foto: Wilfredor · Wikimedia Commons (CC0)', 'atual'),
  largoAtual: img('largoAtual', 'Largo do Café em 2022', 'Foto: Eilif Myrhe · Wikimedia Commons (CC BY-SA 4.0)', 'atual'),
  theatroInauguracao: img(
    'theatroInauguracao',
    'O Estado de S. Paulo noticia a inauguração do Theatro, 12/09/1911',
    'O Estado de S. Paulo, 1911 · Wikimedia Commons (domínio público)',
    'historica',
  ),
  theatroAtual: img('theatroAtual', 'Fachada do Theatro Municipal hoje', 'Foto: Lucas Oriolo Rodrigues · Wikimedia Commons (CC BY-SA 4.0)', 'atual'),
} satisfies Record<string, Imagem>

/** Categoria do Commons com fotos do Largo do Café. */
export const largoDoCafeCommons = 'https://commons.wikimedia.org/wiki/Category:Largo_do_Caf%C3%A9'
