import { resolve } from 'path'

export default ({
  base: "/E-Perfume/",
  root: resolve(__dirname, 'src'),
  build: {
    outDir: '../dist'
  },
  server: {
    port: 8080,    
  }
})