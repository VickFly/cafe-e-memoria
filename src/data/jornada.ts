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
  'largo-do-cafe': {
    carimbo: '1890',
    tinta: '#8A5532',
    quiz: {
      pergunta: 'Qual instituição, fundada em 1890, é considerada o embrião da atual B3?',
      opcoes: ['Bolsa Oficial de Valores', 'Bolsa Livre', 'Palácio do Café'],
      correta: 1,
      explicacao: 'A Bolsa Livre, de 1890. O nome Bolsa Oficial de Valores de São Paulo só surgiu em 1935, e o Palácio do Café é um edifício, não uma instituição.',
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
