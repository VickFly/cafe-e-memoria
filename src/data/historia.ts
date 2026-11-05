import { imagens, largoDoCafeCommons, type Imagem } from './images'

export type Parada = {
  numero: number
  slug: string
  nome: string
  subtitulo?: string
  local: string
  resumo: string
  contexto: string[]
  destaques: string[]
  curiosidade: string
  atencao?: string
  fotos: { historica?: Imagem; atual?: Imagem; extra?: Imagem }
  semFotoNota?: { texto: string; link: string }
  ilustracao: 'trem' | 'rua' | 'saca' | 'theatro'
  /** Posição no esquema ilustrativo (0–100). Não são coordenadas reais. */
  esquema: { x: number; y: number }
}

export const paradas: Parada[] = [
  {
    numero: 1,
    slug: 'estacao-da-luz',
    nome: 'Estação da Luz',
    local: 'Praça da Luz, Centro de São Paulo',
    resumo:
      'Por estes trilhos o café do interior seguia até o Porto de Santos, e por eles chegavam milhares de imigrantes.',
    contexto: [
      'A Estação da Luz está ligada diretamente à expansão da economia cafeeira. A primeira estação foi inaugurada em 1867, como parte da São Paulo Railway, a primeira ferrovia da província.',
      'O edifício atual entrou em operação em 1901. Projeto e boa parte dos materiais, incluindo a estrutura metálica, vieram da Grã-Bretanha.',
      'A ligação Santos–Jundiaí levava o café produzido no interior paulista até o Porto de Santos e ajudou no deslocamento de imigrantes para as lavouras e para a capital.',
    ],
    destaques: [
      'Primeiro edifício inaugurado em 1867',
      'Estação atual em operação desde 1901',
      'Influência da arquitetura ferroviária inglesa',
      'Transporte de café e circulação de imigrantes',
      'A ferrovia como motor do crescimento da cidade',
    ],
    curiosidade:
      'A estação se tornou um dos grandes símbolos da modernização de São Paulo durante o auge da economia cafeeira.',
    fotos: { historica: imagens.luzHistorica, atual: imagens.luzAtual },
    ilustracao: 'trem',
    esquema: { x: 50, y: 12 },
  },
  {
    numero: 2,
    slug: 'rua-xv-e-rua-anchieta',
    nome: 'Rua XV de Novembro',
    subtitulo: 'e Rua Anchieta, junto ao Pátio do Colégio',
    local: 'Núcleo histórico, próximo ao Pátio do Colégio',
    resumo:
      'Duas ruas vizinhas, com histórias próprias, no trecho mais antigo da cidade. Aqui o dinheiro do café virou lojas, bancos e bondes.',
    contexto: [
      'Esta região integra o núcleo mais antigo de São Paulo, nascido em torno do Pátio do Colégio, onde a cidade foi fundada em 25 de janeiro de 1554.',
      'Rua XV de Novembro: teve outros nomes ao longo do tempo, como Rua do Rosário e Rua da Imperatriz. Recebeu o nome atual depois da Proclamação da República, em 1889.',
      'Rua Anchieta: é outra via, curta, que liga a região ao Pátio do Colégio. Antes foi chamada de Travessa do Palácio, e o nome atual foi oficializado em 1897.',
      'As duas ficam a poucos passos uma da outra, por isso são visitadas na mesma parada.',
    ],
    destaques: [
      'A formação histórica do centro de São Paulo',
      'Vizinhança do Pátio do Colégio, marco da fundação em 1554',
      'A transformação das ruas e dos espaços comerciais',
      'Bancos, lojas e casas comerciais no crescimento da capital',
      'O desenvolvimento urbano financiado pela riqueza do café',
    ],
    curiosidade:
      'A Rua XV de Novembro foi uma das vias comerciais mais importantes da cidade. No início do século XX reunia cafés, lojas, joalherias e bondes elétricos.',
    atencao: 'São duas vias distintas: a Rua XV de Novembro e a Rua Anchieta. Cada uma tem seus antigos nomes.',
    fotos: { historica: imagens.ruaXvHistorica, atual: imagens.patioAtual, extra: imagens.ruaXv1920 },
    ilustracao: 'rua',
    esquema: { x: 72, y: 46 },
  },
  {
    numero: 3,
    slug: 'largo-do-cafe',
    nome: 'Largo do Café',
    subtitulo: 'e a antiga Bolsa de Valores',
    local: 'Entre as ruas São Bento, Álvares Penteado e do Comércio',
    resumo:
      'Onde o grão vindo do interior era negociado. Corretores, comissários e exportadores faziam do largo uma bolsa a céu aberto.',
    contexto: [
      'O Largo do Café foi um dos espaços mais representativos da comercialização do café em São Paulo, entre o fim do século XIX e o começo do século XX.',
      'Ali se reuniam comerciantes, corretores, comissários e representantes de exportadores. Os lotes chegavam do interior, eram negociados e depois seguiam para o porto.',
      'Era um lugar de circulação de informações, negócios e decisões econômicas, uma espécie de bolsa informal.',
      'A história da Bolsa de Valores é institucional e passou por outros endereços: a Bolsa Livre foi fundada em 23 de agosto de 1890, a Bolsa de Fundos Públicos em 1895 e, em 1935, surgiu o nome Bolsa Oficial de Valores de São Paulo. Bovespa, BM&FBovespa e, desde 2017, B3 são etapas posteriores.',
    ],
    destaques: [
      'Comercialização do café do interior paulista',
      'Negociações e atividades dos corretores',
      'Relação entre o comércio do café e o mercado financeiro',
      'Desenvolvimento das instituições financeiras paulistanas',
      'Bolsa Livre, de 1890, embrião da atual B3',
    ],
    curiosidade:
      'Em 1934 a Bolsa de Valores de São Paulo instalou-se no Palácio do Café, no Pátio do Colégio. No ano seguinte passou a se chamar Bolsa Oficial de Valores de São Paulo.',
    atencao:
      'Largo do Café, Palácio do Café e Bolsa de Valores não são o mesmo lugar. O largo é um espaço público de negociação; o Palácio do Café é um edifício no Pátio do Colégio; a Bolsa é uma instituição que mudou de sede ao longo do tempo.',
    fotos: { atual: imagens.largoAtual },
    semFotoNota: {
      texto:
        'Não encontramos uma fotografia histórica do largo com origem verificada. Veja mais fotos do local no Wikimedia Commons.',
      link: largoDoCafeCommons,
    },
    ilustracao: 'saca',
    esquema: { x: 40, y: 60 },
  },
  {
    numero: 4,
    slug: 'theatro-municipal',
    nome: 'Theatro Municipal',
    subtitulo: 'de São Paulo',
    local: 'Praça Ramos de Azevedo, Centro',
    resumo:
      'A riqueza do café ergueu um palco à altura das capitais europeias. Onze anos depois, ele abrigou a Semana de Arte Moderna.',
    contexto: [
      'O Theatro Municipal é uma das maiores expressões arquitetônicas e culturais da prosperidade trazida pelo café.',
      'A construção começou em 1903 e a inauguração aconteceu em 12 de setembro de 1911, com a ópera Hamlet, de Ambroise Thomas.',
      'O projeto é do escritório de Ramos de Azevedo, com os italianos Cláudio Rossi e Domiziano Rossi, misturando referências renascentistas, barrocas e art nouveau.',
      'A riqueza acumulada pelos cafeicultores ajudou a financiar uma cidade que queria se aproximar dos grandes centros culturais da Europa.',
    ],
    destaques: [
      'Inaugurado em 12 de setembro de 1911',
      'Influências arquitetônicas europeias',
      'Financiamento ligado à riqueza dos cafeicultores',
      'Transformação cultural da elite paulistana',
      'Palco da Semana de Arte Moderna de 1922',
    ],
    curiosidade:
      'Entre 11 e 18 de fevereiro de 1922 o Theatro recebeu a Semana de Arte Moderna, com noites de música, poesia e palestras em 13, 15 e 17 de fevereiro.',
    fotos: { historica: imagens.theatroInauguracao, atual: imagens.theatroAtual },
    ilustracao: 'theatro',
    esquema: { x: 20, y: 86 },
  },
]

export type Marco = { ano: string; titulo: string; texto: string }

export const linhaDoTempo: Marco[] = [
  { ano: '1554', titulo: 'Fundação', texto: 'Missa inaugural do colégio jesuíta no atual Pátio do Colégio.' },
  { ano: '1867', titulo: 'Chegam os trilhos', texto: 'A São Paulo Railway inaugura a primeira Estação da Luz.' },
  { ano: '1872', titulo: 'Uma cidade modesta', texto: 'São Paulo é apenas a 9ª cidade do Brasil em população.' },
  { ano: '1890', titulo: 'Nasce a Bolsa', texto: 'Fundação da Bolsa Livre, embrião da atual B3.' },
  { ano: '1901', titulo: 'A nova Luz', texto: 'Entra em operação o edifício atual da estação.' },
  { ano: '1911', titulo: 'Um palco europeu', texto: 'Inauguração do Theatro Municipal.' },
  { ano: '1922', titulo: 'Semana de Arte Moderna', texto: 'O Theatro recebe o marco do modernismo brasileiro.' },
  { ano: '1929', titulo: 'A crise', texto: 'A quebra da bolsa de Nova York abala o comércio do café.' },
]

export const temasIntro = [
  { titulo: 'Riqueza', texto: 'Do meio do século XIX às primeiras décadas do XX, o café foi a base da economia brasileira.' },
  { titulo: 'Fazendas', texto: 'As lavouras do interior paulista produziam o grão que abastecia o mundo.' },
  { titulo: 'Ferrovias', texto: 'Os trilhos nasceram para levar o café até o Porto de Santos.' },
  { titulo: 'Imigrantes', texto: 'Cerca de 4 milhões de imigrantes, sobretudo europeus, chegaram entre o fim do XIX e o início do XX.' },
  { titulo: 'Cidade', texto: 'Palacetes, edifícios e teatros mudaram a paisagem da capital.' },
  { titulo: 'Costumes', texto: 'O cafezinho entrou na rotina e nos encontros da cidade.' },
]

export const fontes = [
  { titulo: 'Prefeitura de São Paulo — O Café e a História da Cidade', url: 'https://prefeitura.sp.gov.br/w/servico/o-cafe-e-a-historia-da-cidade' },
  { titulo: 'USP — Patrimônio Histórico: Largo do Café', url: 'https://sites.usp.br/patrimoniohistorico/largo-do-cafe/' },
  { titulo: 'APTA — Largo do Café', url: 'https://www.apta.sp.gov.br/noticias/largo-do-caf%C3%A9-pra%C3%A7a-de-comercializa%C3%A7%C3%A3o-carrega-mais-de-um-s%C3%A9culo-de-hist%C3%B3ria-do-caf%C3%A9-em-sp' },
  { titulo: 'Theatro Municipal — Sobre o Theatro', url: 'https://theatromunicipal.org.br/sobre-o-theatro/' },
  { titulo: 'USP — Giro Cultural: Theatro Municipal', url: 'https://prceu.usp.br/girocultural/theatro-municipal/' },
  { titulo: 'B3 — Nossa História', url: 'https://www.b3.com.br/pt_br/b3/institucional/trabalhe-na-b3/nossa-historia.htm' },
  { titulo: 'BNDES — Museu da Língua Portuguesa e Estação da Luz', url: 'https://www.bndes.gov.br/wps/portal/site/home/onde-atuamos/cultura-e-economia-criativa/patrimonio-cultural-brasileiro/projetos-apoiados/museu-da-lingua-portuguesa/' },
  { titulo: 'Prefeitura de São Paulo — Dicionário de Ruas', url: 'https://dicionarioderuas.prefeitura.sp.gov.br/' },
  { titulo: 'Diário do Transporte — Estação da Luz completa 159 anos', url: 'https://diariodotransporte.com.br/2026/02/16/estacao-da-luz-da-cptm-completa-159-anos-no-transporte-de-passageiros-sobre-trilhos/' },
  { titulo: 'Capital Aberto — Breve histórico das bolsas no Brasil', url: 'https://www.capitalaberto.com.br/colunistas/2019/06/breve-historico-das-bolsas-no-brasil' },
]
