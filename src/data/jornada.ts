/**
 * Desafio de cada parada e o carimbo que ele rende. Todo o conteúdo histórico continua em historia.ts;
 * as perguntas abaixo saem apenas de fatos que já estão lá.
 */
export type Quiz = { pergunta: string; opcoes: string[]; correta: number; explicacao: string }
export type Extra = { carimbo: string; tinta: string; quiz: Quiz }

export const extras: Record<string, Extra> = {
  'estacao-da-luz': {
    carimbo: '1867',
    tinta: '#5B3928',
    quiz: {
      pergunta: 'Antes da ferrovia, como o café do interior chegava ao litoral?',
      opcoes: ['Em tropas de mulas', 'Em barcos pelo rio Tietê', 'Em carroças puxadas por bois'],
      correta: 0,
      explicacao: 'O transporte era feito por tropas de mulas. Com as lavouras cada vez mais longe do litoral, a São Paulo Railway passou a ligar Santos a Jundiaí em 1867.',
    },
  },
  'rua-xv-de-novembro': {
    carimbo: '1850·60',
    tinta: '#68704B',
    quiz: {
      pergunta: 'Quantos clientes Maria Punga esperava chegar para servir o café?',
      opcoes: ['Dois', 'Três', 'Cinco'],
      correta: 1,
      explicacao: 'Três: era a quantidade de xícaras que o bule dela rendia. Quem chegasse antes precisava esperar mais dois clientes.',
    },
  },
  'tribunal-de-justica': {
    carimbo: '1920',
    tinta: '#4A5536',
    quiz: {
      pergunta: 'Qual escritório projetou o Palácio da Justiça?',
      opcoes: ['O de Lucjan Korngold', 'O de Ramos de Azevedo', 'O de Washington Luís'],
      correta: 1,
      explicacao: 'O escritório de Ramos de Azevedo, o mesmo do Theatro Municipal. Washington Luís, então secretário da Justiça, determinou a construção em 1911; a pedra fundamental foi assentada em 1920.',
    },
  },
  'edificio-vista-alegre': {
    carimbo: '1894',
    tinta: '#7A4A2E',
    quiz: {
      pergunta: 'Em que momento foi fundada a Associação Comercial de São Paulo, em 1894?',
      opcoes: ['Durante a expansão da economia cafeeira', 'Logo depois da crise de 1929', 'Na inauguração do Theatro Municipal'],
      correta: 0,
      explicacao: 'Durante a expansão do café, quando as oportunidades de negócio atraíam empreendedores locais e estrangeiros. A fundação foi em 7 de dezembro de 1894.',
    },
  },
  'praca-antonio-prado': {
    carimbo: '1909',
    tinta: '#5B3928',
    quiz: {
      pergunta: 'O que existia aqui antes de o lugar se chamar Praça Antônio Prado?',
      opcoes: ['O Largo do Café', 'O Largo do Rosário, com a igreja da irmandade dos homens pretos', 'O Pátio do Colégio'],
      correta: 1,
      explicacao: 'O Largo do Rosário. A igreja foi derrubada para alargar a Rua XV, e a irmandade, depois de lutar e conseguir indenização, ergueu um novo templo no Largo do Paissandu.',
    },
  },
  'largo-do-cafe': {
    carimbo: 'séc. XIX',
    tinta: '#8A5532',
    quiz: {
      pergunta: 'Quem se reunia no Largo do Café para fazer negócios?',
      opcoes: ['Juízes e advogados do Tribunal', 'Comerciantes, corretores, comissários e exportadores', 'Imigrantes recém-chegados pela ferrovia'],
      correta: 1,
      explicacao: 'Comerciantes, corretores, comissários e representantes de exportadores. Os lotes chegavam do interior, eram negociados ali e seguiam para o porto, como numa bolsa informal.',
    },
  },
  'theatro-municipal': {
    carimbo: '1911',
    tinta: '#321D16',
    quiz: {
      pergunta: 'Que acontecimento ocupou o palco do Theatro em fevereiro de 1922?',
      opcoes: ['A estreia da ópera Hamlet', 'A Semana de Arte Moderna', 'A fundação da Bolsa de Valores'],
      correta: 1,
      explicacao: 'A Semana de Arte Moderna, um dos marcos da cultura brasileira. Hamlet foi a ópera da inauguração, em 1911.',
    },
  },
}
