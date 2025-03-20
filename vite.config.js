// vite.config.js
import { defineConfig } from 'vite';
import modularComponent from './vite-plugin-modular-component.js';

export default defineConfig({
    plugins: [modularComponent()],
});