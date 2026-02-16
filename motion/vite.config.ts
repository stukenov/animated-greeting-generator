import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: ['./templates/*.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: './templates/index.ts',
      formats: ['es'],
      fileName: 'templates',
    },
    outDir: 'dist',
  },
}); 