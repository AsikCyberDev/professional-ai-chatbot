//rolllup.config.mjs

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tailwindcss from 'tailwindcss';

export default {
    input: 'src/ChatBot.js',
    output: {
        file: 'dist/chatbot.js',
        format: 'es',
    },
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
        postcss({
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
            inject: false,
            extract: false,
            minimize: true,
        }),
        terser(),
    ],
    external: [
        'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js',
        'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js',
        'https://cdn.jsdelivr.net/npm/marked@4.0.0/lib/marked.esm.js',
    ],
};