/**
 * Baixa as fotos do Wikimedia Commons para public/img/ antes do build.
 * Assim o site serve as imagens do próprio domínio (rápido e sem depender do Commons no dia do tour).
 * Nunca derruba o build: se uma imagem falhar, o app usa o endereço do Commons como reserva.
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'

const lista = JSON.parse(await readFile(new URL('../src/data/imagens-commons.json', import.meta.url), 'utf8'))
const destino = new URL('../public/img/', import.meta.url)
await mkdir(destino, { recursive: true })

const UA = 'CafeEMemoria/1.0 (projeto academico USP; build estatico)'

// sharp reduz o peso das fotos (≈ 3 a 5x menores no celular). Se não estiver disponível, salva o original.
let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('[imagens] sharp indisponível: salvando as fotos sem otimizar')
}
const otimizar = async (buf, largura) => {
  if (!sharp) return buf
  try {
    return await sharp(buf).rotate().resize({ width: largura, withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true, progressive: true }).toBuffer()
  } catch {
    return buf
  }
}
let ok = 0
let falhas = 0

for (const [chave, { arquivo, largura }] of Object.entries(lista)) {
  const alvo = new URL(`${chave}.jpg`, destino)
  try {
    const s = await stat(alvo)
    if (s.size > 1000) { ok++; continue }
  } catch { /* ainda não existe */ }
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}?width=${largura}`
  try {
    const ctrl = AbortSignal.timeout(25000)
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: ctrl })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const original = Buffer.from(await r.arrayBuffer())
    if (original.length < 1000) throw new Error('arquivo vazio')
    const buf = await otimizar(original, Math.min(largura, chave === 'panorama' ? 1280 : 900))
    await writeFile(alvo, buf)
    ok++
    console.log(`[imagens] ok   ${chave} (${Math.round(buf.length / 1024)} KB)`)
  } catch (e) {
    falhas++
    console.warn(`[imagens] falhou ${chave}: ${e.message} — o site usará o Commons como reserva`)
  }
}
console.log(`[imagens] ${ok} prontas, ${falhas} com reserva remota`)
