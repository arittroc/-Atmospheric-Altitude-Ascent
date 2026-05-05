import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
          if (id.includes('gsap') || id.includes('@studio-freight')) return 'gsap-vendor'
          if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor'
        },
      },
    },
  },
})
