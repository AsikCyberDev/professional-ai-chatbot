import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'; // Correct import for resolve plugin
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting'; // Include nesting for CSS nesting support
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import tailwindcss from 'tailwindcss';

export default {
    input: 'src/index.js', // Use the entry point
    output: {
        file: 'dist/chatbot.js',
        format: 'es',
        sourcemap: true, // Enable sourcemaps for easier debugging
    },
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
        postcss({
            plugins: [
                tailwindcss({
                    content: ['./src/**/*.js', './src/**/*.html'], // Ensure all relevant files are included
                    darkMode: 'class', // Use class-based dark mode
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
                nesting, // Support CSS nesting for Tailwind utilities and custom styles
                autoprefixer,
            ],
            inject: true, // Inject CSS directly into JS for use with Shadow DOM
            extract: false, // Don't extract CSS to a separate file to avoid style conflicts
            minimize: true, // Minimize CSS for production
        }),
        terser(), // Minify JS for production
    ],
    external: [
        'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js',
        'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js',
        'https://cdn.jsdelivr.net/npm/marked@4.0.0/lib/marked.esm.js',
    ],
};
