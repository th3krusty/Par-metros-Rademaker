import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `base` define o subpath onde o app será servido a partir de
// tkone.com.br (ex: tkone.com.br/painel-parametros/). Ajuste conforme
// o subpath escolhido, ou remova a linha se o app for servido na raiz
// de um domínio próprio.
export default defineConfig({
  plugins: [react()],
  base: '/painel-parametros/',
})
