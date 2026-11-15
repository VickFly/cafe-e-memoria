/**
 * Fotos do tour de sábado, 14 de novembro de 2026.
 *  - public/memorias/p/  miniaturas (560 px) para a galeria
 *  - public/memorias/g/  versão grande (1600 px) para o projetor, o download e o cartão-postal
 * As imagens foram giradas corretamente e salvas SEM metadados (sem GPS, modelo do celular etc.).
 *
 * `parada` só foi preenchida quando o lugar é inequívoco na própria foto; o resto está em 'pelo-caminho'.
 * Para mover uma foto de grupo, troque o valor de `parada` (use o slug da parada ou 'pelo-caminho').
 * Para tirar uma foto do site, apague a linha dela (e, se quiser, os dois arquivos .webp).
 * `destaque: true` coloca a foto no rolo de filme do topo.
 */
export type ParadaFoto = 'estacao-da-luz' | 'rua-xv-de-novembro' | 'largo-do-cafe' | 'theatro-municipal' | 'pelo-caminho'

export type FotoTour = { n: number; arquivo: string; w: number; h: number; parada: ParadaFoto; destaque?: boolean }

export const dataDoTour = 'Sábado, 14 de novembro de 2026'

export const nomesParadas: Record<ParadaFoto, string> = {
  'estacao-da-luz': 'Estação da Luz',
  'rua-xv-de-novembro': 'Rua XV de Novembro',
  'largo-do-cafe': 'Largo do Café',
  'theatro-municipal': 'Theatro Municipal',
  'pelo-caminho': 'Pelo caminho',
}

export const urlFoto = (f: FotoTour, tamanho: 'p' | 'g') => `/memorias/${tamanho}/${f.arquivo}`

export const fotosTour: FotoTour[] = [
  { n: 1, arquivo: '01.webp', w: 1280, h: 960, parada: 'estacao-da-luz' },
  { n: 2, arquivo: '02.webp', w: 1280, h: 960, parada: 'estacao-da-luz', destaque: true },
  { n: 3, arquivo: '03.webp', w: 1280, h: 960, parada: 'estacao-da-luz', destaque: true },
  { n: 4, arquivo: '04.webp', w: 1280, h: 960, parada: 'estacao-da-luz' },
  { n: 5, arquivo: '05.webp', w: 1600, h: 1200, parada: 'estacao-da-luz' },
  { n: 6, arquivo: '06.webp', w: 1600, h: 1200, parada: 'estacao-da-luz' },
  { n: 7, arquivo: '07.webp', w: 1600, h: 1200, parada: 'estacao-da-luz' },
  { n: 8, arquivo: '08.webp', w: 1280, h: 960, parada: 'rua-xv-de-novembro', destaque: true },
  { n: 9, arquivo: '09.webp', w: 1280, h: 960, parada: 'rua-xv-de-novembro' },
  { n: 10, arquivo: '10.webp', w: 1600, h: 1200, parada: 'rua-xv-de-novembro' },
  { n: 11, arquivo: '11.webp', w: 1600, h: 1200, parada: 'rua-xv-de-novembro' },
  { n: 12, arquivo: '12.webp', w: 1200, h: 1600, parada: 'largo-do-cafe', destaque: true },
  { n: 13, arquivo: '13.webp', w: 1200, h: 1600, parada: 'largo-do-cafe' },
  { n: 14, arquivo: '14.webp', w: 960, h: 1280, parada: 'theatro-municipal', destaque: true },
  { n: 15, arquivo: '15.webp', w: 960, h: 1280, parada: 'theatro-municipal' },
  { n: 16, arquivo: '16.webp', w: 960, h: 1280, parada: 'theatro-municipal' },
  { n: 17, arquivo: '17.webp', w: 960, h: 1280, parada: 'theatro-municipal' },
  { n: 18, arquivo: '18.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 19, arquivo: '19.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 20, arquivo: '20.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 21, arquivo: '21.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 22, arquivo: '22.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 23, arquivo: '23.webp', w: 1600, h: 1200, parada: 'theatro-municipal', destaque: true },
  { n: 24, arquivo: '24.webp', w: 1600, h: 1200, parada: 'theatro-municipal' },
  { n: 25, arquivo: '25.webp', w: 1600, h: 1200, parada: 'theatro-municipal' },
  { n: 26, arquivo: '26.webp', w: 1200, h: 1600, parada: 'theatro-municipal' },
  { n: 27, arquivo: '27.webp', w: 1600, h: 1200, parada: 'theatro-municipal' },
  { n: 28, arquivo: '28.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 29, arquivo: '29.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 30, arquivo: '30.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 31, arquivo: '31.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 32, arquivo: '32.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 33, arquivo: '33.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 34, arquivo: '34.webp', w: 1280, h: 960, parada: 'pelo-caminho', destaque: true },
  { n: 35, arquivo: '35.webp', w: 960, h: 1280, parada: 'pelo-caminho' },
  { n: 36, arquivo: '36.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 37, arquivo: '37.webp', w: 1280, h: 960, parada: 'pelo-caminho', destaque: true },
  { n: 38, arquivo: '38.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 39, arquivo: '39.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 40, arquivo: '40.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 41, arquivo: '41.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 42, arquivo: '42.webp', w: 1280, h: 960, parada: 'pelo-caminho' },
  { n: 43, arquivo: '43.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 44, arquivo: '44.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 45, arquivo: '45.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 46, arquivo: '46.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 47, arquivo: '47.webp', w: 1600, h: 1200, parada: 'pelo-caminho', destaque: true },
  { n: 48, arquivo: '48.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 49, arquivo: '49.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 50, arquivo: '50.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 51, arquivo: '51.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 52, arquivo: '52.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 53, arquivo: '53.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 54, arquivo: '54.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 55, arquivo: '55.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 56, arquivo: '56.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 57, arquivo: '57.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 58, arquivo: '58.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 59, arquivo: '59.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 60, arquivo: '60.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 61, arquivo: '61.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 62, arquivo: '62.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 63, arquivo: '63.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 64, arquivo: '64.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 65, arquivo: '65.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 66, arquivo: '66.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 67, arquivo: '67.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 68, arquivo: '68.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 69, arquivo: '69.webp', w: 1200, h: 1600, parada: 'pelo-caminho', destaque: true },
  { n: 70, arquivo: '70.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 71, arquivo: '71.webp', w: 1200, h: 1600, parada: 'pelo-caminho' },
  { n: 72, arquivo: '72.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 73, arquivo: '73.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 74, arquivo: '74.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 75, arquivo: '75.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 76, arquivo: '76.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 77, arquivo: '77.webp', w: 1600, h: 1200, parada: 'pelo-caminho', destaque: true },
  { n: 78, arquivo: '78.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 79, arquivo: '79.webp', w: 1600, h: 1200, parada: 'pelo-caminho' },
  { n: 80, arquivo: '80.webp', w: 1600, h: 1200, parada: 'pelo-caminho', destaque: true },
]
