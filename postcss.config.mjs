import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting'; // Add nesting plugin for CSS nesting support
import tailwindcss from 'tailwindcss';

export default {
    plugins: [
        tailwindcss,
        nesting, // Add nesting support
        autoprefixer,
    ],
};
