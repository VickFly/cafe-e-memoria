/**
 * Imagens do Wikimedia Commons, carregadas pelo endpoint Special:FilePath,
 * que entrega uma miniatura já redimensionada (carregamento otimizado).
 * Se alguma não carregar, o componente <Foto> mostra uma moldura ilustrada
 * com o crédito, sem quebrar o layout.
 *
 * Fotografias de Guilherme Gaensly (acervo do Museu Paulista da USP) são do
 * início do século XX e estão em domínio público. As fotos atuais têm
 * licenças Creative Commons — confira o autor e a licença em cada página do
 * Commons antes de imprimir ou publicar o trabalho fora do app.
 */
export type Imagem = {
  src: string
  pagina: string
  legenda: string
  credito: string
  tipo: 'historica' | 'atual'
}

const commons = (arquivo: string, largura = 960) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=${largura}`

const pagina = (arquivo: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo.replace(/ /g, '_'))}`

const img = (
  arquivo: string,
  legenda: string,
  credito: string,
  tipo: Imagem['tipo'],
  largura?: number,
): Imagem => ({ src: commons(arquivo, largura), pagina: pagina(arquivo), legenda, credito, tipo })

export const imagens = {
  panorama: img(
    'Guilherme Gaensly - Panorama de São Paulo II, Acervo do Museu Paulista da USP.jpg',
    'Panorama de São Paulo no início do século XX',
    'Guilherme Gaensly · Acervo do Museu Paulista da USP · Wikimedia Commons (domínio público)',
    'historica',
    1400,
  ),
  colheita: img(
    'Guilherme Gaensly - São Paulo - Colheita de Café, Acervo do Museu Paulista da USP 2.jpg',
    'Colheita de café no interior paulista',
    'Guilherme Gaensly · Acervo do Museu Paulista da USP · Wikimedia Commons (domínio público)',
    'historica',
  ),
  luzHistorica: img(
    'Guilherme Gaensly - São Paulo, Estação da Luz, Acervo do Museu Paulista da USP (cropped).jpg',
    'Estação da Luz no início do século XX',
    'Guilherme Gaensly · Acervo do Museu Paulista da USP · Wikimedia Commons (domínio público)',
    'historica',
  ),
  luzAtual: img(
    'Luz Station, Sao Paulo.jpg',
    'Estação da Luz hoje',
    'Wikimedia Commons · ver autor e licença na página do arquivo',
    'atual',
  ),
  ruaXvHistorica: img(
    'Guilherme Gaensly - Rua 15 de Novembro I, Acervo do Museu Paulista da USP 2.jpg',
    'Rua XV de Novembro no início do século XX',
    'Guilherme Gaensly · Acervo do Museu Paulista da USP · Wikimedia Commons (domínio público)',
    'historica',
  ),
  ruaXv1920: img(
    'Rua XV de Novembro, São Paulo - 1920.jpg',
    'Rua XV de Novembro por volta de 1920',
    'Wikimedia Commons · ver autor e licença na página do arquivo',
    'historica',
  ),
  patioAtual: img(
    'Pátio do Colégio in São Paulo.jpg',
    'Pátio do Colégio hoje, a poucos passos da Rua Anchieta',
    'Wikimedia Commons · ver autor e licença na página do arquivo',
    'atual',
  ),
  theatroInauguracao: img(
    'O Estado de S. Paulo, 12 de setembro de de 1911, pág. 3 - Inauguração do Theatro Municipal de São Paulo.jpg',
    'O Estado de S. Paulo noticia a inauguração do Theatro, 12/09/1911',
    'O Estado de S. Paulo, 1911 · Wikimedia Commons (domínio público)',
    'historica',
  ),
  theatroAtual: img(
    'Teatro Municipal de São Paulo, SP.jpg',
    'Fachada do Theatro Municipal hoje',
    'Wikimedia Commons · ver autor e licença na página do arquivo',
    'atual',
  ),
} satisfies Record<string, Imagem>

/** Categoria do Commons com fotos do Largo do Café (não encontramos uma foto histórica verificada). */
export const largoDoCafeCommons = 'https://commons.wikimedia.org/wiki/Category:Largo_do_Caf%C3%A9'
