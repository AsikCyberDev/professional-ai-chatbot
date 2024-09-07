import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tailwindcss from 'tailwindcss';

export default {
    input: 'src/index.js', // Entry point
    output: {
        file: 'dist/chatbot.js',
        format: 'es',
        sourcemap: true,
    },
    plugins: [
        resolve({
            browser: true,
            extensions: ['.js', '.json'], // Add extensions if needed
        }),
        commonjs(),
        postcss({
            plugins: [
                tailwindcss({
                    content: ['./src/**/*.js', './src/**/*.html'],
                    darkMode: 'class',
                    theme: {
                        extend: {
                            colors: {
                                'custom-dark': '#1f2937',
                                'custom-text': '#ffffff',
                                'custom-button': '#3b82f6',
                            },
                        },
                    },
                }),
                nesting,
                autoprefixer,
            ],
            inject: true,
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
