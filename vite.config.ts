import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import {
  presetAttributify,
  presetIcons,
  presetTagify,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerAttributifyJsx,
  transformerDirectives
} from 'unocss';
import UnoCSS from 'unocss/vite';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons(),
        presetWebFonts(),
        presetAttributify(),
        presetTypography(),
        presetTagify({
          prefix: 'un-'
        })
      ],
      transformers: [transformerAttributifyJsx(), transformerDirectives()]
    }),
    Pages({
      extensions: ['vue', 'tsx']
    })
  ],
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`
    }
  }
});
