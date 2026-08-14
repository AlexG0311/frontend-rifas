import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts:[
      '0d6c-181-78-20-113.ngrok-free.app'
    ]
  },
  plugins: [
    tailwindcss(),
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
   
  ],
})
