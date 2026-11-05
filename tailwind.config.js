/** Identidade visual Café & Memória */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#321D16',
        cafe: '#5B3928',
        caramelo: '#A66A3F',
        'caramelo-texto': '#8A5532', // caramelo escurecido para textos pequenos (contraste 4,5:1)
        papel: '#F3EBDD',
        creme: '#FAF7EF',
        oliva: '#68704B',
        ouro: '#B99A62',
        tinta: '#24201D',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        rise: { from: { opacity: '0.001', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { '0%': { transform: 'scale(1)' }, '45%': { transform: 'scale(1.28) rotate(-8deg)' }, '100%': { transform: 'scale(1)' } },
        fill: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        steam: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '40%': { opacity: '.7' }, '100%': { opacity: '0', transform: 'translateY(-14px)' } },
        chegada: { from: { transform: 'translateX(-115vw)' }, to: { transform: 'translateX(0)' } },
        giro: { to: { transform: 'rotate(360deg)' } },
        fumaca: { '0%': { opacity: '0', transform: 'translate(0,0) scale(.4)' }, '15%': { opacity: '.75' }, '100%': { opacity: '0', transform: 'translate(-26px,-46px) scale(1.7)' } },
        fumacaTopo: { '0%': { opacity: '.7', transform: 'scale(.5)' }, '100%': { opacity: '0', transform: 'scale(2.2)' } },
        brilho: { '0%,100%': { boxShadow: '0 0 0 0 rgba(185,154,98,.0)' }, '50%': { boxShadow: '0 0 0 10px rgba(185,154,98,.28)' } },
        fall: { from: { transform: 'translateY(-30px) rotate(0)', opacity: '0' }, '20%': { opacity: '1' }, to: { transform: 'translateY(110px) rotate(200deg)', opacity: '0' } },
      },
      animation: {
        rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both',
        pop: 'pop .45s ease-out',
        fill: 'fill 2.2s cubic-bezier(.4,0,.2,1) both',
        steam: 'steam 2.4s ease-in-out infinite',
        fall: 'fall 2.6s ease-in infinite',
        chegada: 'chegada 3.4s cubic-bezier(.22,.8,.3,1) both',
        giro: 'giro .55s linear 6',
        fumaca: 'fumaca 2.4s ease-out infinite',
        fumacaTopo: 'fumacaTopo 1.8s ease-out infinite',
        brilho: 'brilho 1.6s ease-in-out 2',
      },
    },
  },
  plugins: [],
}
