import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting'; // Include nesting plugin
import tailwindcss from 'tailwindcss';

export default {
    plugins: [
        tailwindcss,
        nesting, // Add nesting support to use Tailwind with nested rules
        autoprefixer,
    ],
};
