export const receita = {
  titulo: 'Café gelado cremoso',
  descricao: 'Simples, acessível e pronto em minutos, para preparar em casa.',
  rendimento: '1 copo',
  tempo: 'cerca de 5 minutos (com o café já frio)',
  ingredientes: [
    { qtd: '100 ml', item: 'de café coado já preparado e frio' },
    { qtd: '150 ml', item: 'de leite' },
    { qtd: '1 colher', item: 'de sopa de açúcar ou adoçante a gosto' },
    { qtd: 'A gosto', item: 'gelo' },
    { qtd: '1 pitada', item: 'de canela', opcional: true },
  ],
  passos: [
    'Prepare o café e espere esfriar.',
    'Coloque o café, o leite, o açúcar e o gelo no liquidificador.',
    'Bata por aproximadamente 20 a 30 segundos, até ficar cremoso e espumante.',
    'Sirva em um copo e finalize com canela, se desejar.',
  ],
}

export const receitaComoTexto = () =>
  [
    `☕ ${receita.titulo.toUpperCase()} — Café & Memória`,
    '',
    'Ingredientes:',
    ...receita.ingredientes.map((i) => `• ${i.qtd} ${i.item}${i.opcional ? ' (opcional)' : ''}`),
    '',
    'Modo de preparo:',
    ...receita.passos.map((p, n) => `${n + 1}. ${p}`),
    '',
    'Uma boa história merece ser compartilhada. Um bom café também!',
  ].join('\n')
