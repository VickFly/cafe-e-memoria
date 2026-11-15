import { dataDoTour, nomesParadas, urlFoto, type FotoTour } from '../../data/memorias'

/**
 * Desenha um cartão-postal antigo com a foto do tour: moldura creme, carimbo postal,
 * selo de grão de café e linhas de endereço. Retrato ou paisagem conforme a foto.
 * Tudo em canvas, com imagens do próprio site (sem bloqueio de origem cruzada).
 */
export async function desenharPostal(foto: FotoTour, sepia: boolean): Promise<HTMLCanvasElement> {
  await document.fonts?.ready
  const img = await carregar(urlFoto(foto, 'g'))
  const retrato = foto.h > foto.w
  const W = retrato ? 1200 : 1800
  const H = retrato ? 1800 : 1200
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!

  // papel
  g.fillStyle = '#F6EFE2'
  g.fillRect(0, 0, W, H)
  pontilhado(g, W, H)

  // área da foto
  const m = 56
  const foto0 = retrato ? { x: m, y: m, w: W - 2 * m, h: H * 0.66 - m } : { x: m, y: m, w: W * 0.6 - m, h: H - 2 * m }
  g.fillStyle = '#FFFFFF'
  g.fillRect(foto0.x - 10, foto0.y - 10, foto0.w + 20, foto0.h + 20)
  cobrir(g, img, foto0.x, foto0.y, foto0.w, foto0.h, 0.42)
  if (sepia) envelhecer(g, foto0.x, foto0.y, foto0.w, foto0.h)
  g.strokeStyle = 'rgba(50,29,22,.35)'
  g.lineWidth = 2
  g.strokeRect(foto0.x, foto0.y, foto0.w, foto0.h)

  // lado da mensagem
  const t = retrato ? { x: m, y: foto0.y + foto0.h + 50, w: W - 2 * m, h: H - foto0.h - foto0.y - 50 - m } : { x: foto0.x + foto0.w + 60, y: m, w: W - foto0.w - foto0.x - 60 - m, h: H - 2 * m }
  if (!retrato) {
    g.strokeStyle = 'rgba(91,57,40,.35)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(t.x - 30, m + 40)
    g.lineTo(t.x - 30, H - m - 40)
    g.stroke()
  }

  // selo (canto superior direito)
  const selo = { w: retrato ? 150 : 170, h: retrato ? 180 : 205 }
  const sx = t.x + t.w - selo.w
  const sy = t.y
  seloCafe(g, sx, sy, selo.w, selo.h)
  carimbo(g, sx - 30, sy + selo.h * 0.62, retrato ? 108 : 122)

  // títulos
  g.fillStyle = '#321D16'
  g.font = `700 ${retrato ? 72 : 78}px "Playfair Display", Georgia, serif`
  g.textBaseline = 'alphabetic'
  g.fillText('Café', t.x, t.y + (retrato ? 70 : 80))
  const larguraCafe = g.measureText('Café ').width
  g.fillStyle = '#A66A3F'
  g.font = `italic 500 ${retrato ? 72 : 78}px "Playfair Display", Georgia, serif`
  g.fillText('&', t.x + larguraCafe, t.y + (retrato ? 70 : 80))
  g.fillStyle = '#321D16'
  g.font = `700 ${retrato ? 72 : 78}px "Playfair Display", Georgia, serif`
  g.fillText('Memória', t.x, t.y + (retrato ? 150 : 165))

  g.fillStyle = '#5B3928'
  g.font = `italic 400 ${retrato ? 34 : 36}px "Playfair Display", Georgia, serif`
  g.fillText('Lembrança do tour pela história', t.x, t.y + (retrato ? 215 : 235))
  g.fillText('do café em São Paulo', t.x, t.y + (retrato ? 258 : 280))

  // linhas de endereço
  g.strokeStyle = 'rgba(91,57,40,.35)'
  g.lineWidth = 2
  const y0 = t.y + (retrato ? 320 : 380)
  const linhas = retrato ? 3 : 5
  for (let i = 0; i < linhas; i++) {
    g.beginPath()
    g.moveTo(t.x, y0 + i * 62)
    g.lineTo(t.x + t.w * (retrato ? 0.62 : 1), y0 + i * 62)
    g.stroke()
  }

  // rodapé com local e data
  g.fillStyle = '#8A5532'
  g.font = '600 26px Inter, system-ui, sans-serif'
  const rodape = `${nomesParadas[foto.parada].toUpperCase()} · ${dataDoTour.toUpperCase()}`
  ajustarTexto(g, rodape, t.x, retrato ? H - m - 10 : H - m - 6, t.w, 3)
  return c
}

function carregar(src: string) {
  return new Promise<HTMLImageElement>((ok, erro) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => ok(i)
    i.onerror = () => erro(new Error('Não foi possível carregar a foto.'))
    i.src = src
  })
}

/** Corta a foto para preencher a área (como object-fit: cover), com foco um pouco acima do centro. */
function cobrir(g: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focoY: number) {
  const r = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const sw = w / r
  const sh = h / r
  const sx = (img.naturalWidth - sw) / 2
  const sy = Math.max(0, Math.min(img.naturalHeight - sh, (img.naturalHeight - sh) * focoY))
  g.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

/** Sépia, contraste e vinheta pixel a pixel (funciona em todos os navegadores, inclusive no iPhone). */
function envelhecer(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const dados = g.getImageData(x, y, w, h)
  const d = dados.data
  const cx = w / 2
  const cy = h / 2
  const raio = Math.hypot(cx, cy)
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const gg = d[i + 1]
    const b = d[i + 2]
    let nr = r * 0.393 + gg * 0.769 + b * 0.189
    let ng = r * 0.349 + gg * 0.686 + b * 0.168
    let nb = r * 0.272 + gg * 0.534 + b * 0.131
    const p = i / 4
    const px = p % w
    const py = (p / w) | 0
    const v = 1 - Math.pow(Math.hypot(px - cx, py - cy) / raio, 2.2) * 0.45
    const ruido = (Math.random() - 0.5) * 18
    nr = (nr - 128) * 1.06 + 128
    ng = (ng - 128) * 1.06 + 128
    nb = (nb - 128) * 1.06 + 128
    d[i] = Math.min(255, nr * v + ruido)
    d[i + 1] = Math.min(255, ng * v + ruido)
    d[i + 2] = Math.min(255, nb * v * 0.95 + ruido)
  }
  g.putImageData(dados, x, y)
}

function pontilhado(g: CanvasRenderingContext2D, W: number, H: number) {
  g.fillStyle = 'rgba(91,57,40,.05)'
  for (let i = 0; i < 2600; i++) g.fillRect(Math.random() * W, Math.random() * H, 2, 2)
}

/** Selo postal serrilhado com um grão de café. */
function seloCafe(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  g.save()
  g.fillStyle = '#FFFFFF'
  g.fillRect(x, y, w, h)
  // serrilhado
  g.fillStyle = '#F6EFE2'
  const r = 6
  for (let i = r; i < w; i += r * 2.6) {
    circulo(g, x + i, y, r)
    circulo(g, x + i, y + h, r)
  }
  for (let i = r; i < h; i += r * 2.6) {
    circulo(g, x, y + i, r)
    circulo(g, x + w, y + i, r)
  }
  g.fillStyle = '#321D16'
  g.fillRect(x + 14, y + 14, w - 28, h - 28)
  // grão
  g.translate(x + w / 2, y + h / 2 - 12)
  g.rotate(0.32)
  g.fillStyle = '#B99A62'
  g.beginPath()
  g.ellipse(0, 0, w * 0.2, w * 0.27, 0, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = '#321D16'
  g.lineWidth = 5
  g.beginPath()
  g.moveTo(-w * 0.06, -w * 0.24)
  g.bezierCurveTo(w * 0.1, -w * 0.08, -w * 0.12, w * 0.06, w * 0.04, w * 0.24)
  g.stroke()
  g.restore()
  g.fillStyle = '#B99A62'
  g.font = '700 22px Inter, system-ui, sans-serif'
  g.textAlign = 'center'
  g.fillText('BRASIL · CAFÉ', x + w / 2, y + h - 30)
  g.textAlign = 'start'
}

/** Carimbo postal circular com a cidade e a data, um pouco torto e gasto. */
function carimbo(g: CanvasRenderingContext2D, cx: number, cy: number, raio: number) {
  g.save()
  g.translate(cx, cy)
  g.rotate(-0.22)
  g.globalAlpha = 0.78
  g.strokeStyle = '#5B3928'
  g.fillStyle = '#5B3928'
  g.lineWidth = 4
  circuloVazado(g, 0, 0, raio)
  g.lineWidth = 2
  circuloVazado(g, 0, 0, raio - 12)
  textoEmArco(g, 'SÃO PAULO · CAFÉ & MEMÓRIA · ', raio - 30, '700 17px Inter, system-ui, sans-serif')
  g.font = '700 30px "Playfair Display", Georgia, serif'
  g.textAlign = 'center'
  g.fillText('14', 0, -4)
  g.font = '700 18px Inter, system-ui, sans-serif'
  g.fillText('NOV 2026', 0, 22)
  // ondas do carimbo
  g.lineWidth = 3
  for (let k = 0; k < 4; k++) {
    g.beginPath()
    for (let s = 0; s <= 1; s += 0.02) {
      const px = raio + 10 + s * raio * 1.6
      const py = -36 + k * 24 + Math.sin(s * Math.PI * 4) * 6
      s === 0 ? g.moveTo(px, py) : g.lineTo(px, py)
    }
    g.stroke()
  }
  g.restore()
}

function textoEmArco(g: CanvasRenderingContext2D, texto: string, raio: number, fonte: string) {
  g.font = fonte
  g.textAlign = 'center'
  const passo = (Math.PI * 2) / texto.length
  for (let i = 0; i < texto.length; i++) {
    g.save()
    g.rotate(i * passo)
    g.translate(0, -raio)
    g.fillText(texto[i], 0, 0)
    g.restore()
  }
}

function circulo(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.fill()
}
function circuloVazado(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  g.beginPath()
  g.arc(x, y, r, 0, Math.PI * 2)
  g.stroke()
}

/** Escreve o texto diminuindo a fonte até caber na largura. */
function ajustarTexto(g: CanvasRenderingContext2D, texto: string, x: number, y: number, max: number, espacamento: number) {
  let tamanho = 26
  g.font = `600 ${tamanho}px Inter, system-ui, sans-serif`
  while (g.measureText(texto).width + texto.length * espacamento > max && tamanho > 14) {
    tamanho -= 1
    g.font = `600 ${tamanho}px Inter, system-ui, sans-serif`
  }
  g.fillText(texto, x, y)
}
