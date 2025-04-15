import { defineConfig } from 'vite';
import postcssSimpleVars from 'postcss-simple-vars';
import postcssNested from 'postcss-nested';

export default defineConfig({
  plugins: [
    postcssSimpleVars(),
    postcssNested(),
  ],
});
