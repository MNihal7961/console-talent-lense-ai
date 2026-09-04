import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(import.meta.dirname, 'src/styles')],
        additionalData: (source: string, filename: string) =>
          filename.includes('_variables.scss')
            ? source
            : `@use "variables" as *;\n${source}`,
      },
    },
  },
})
