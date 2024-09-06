module.exports = {
    content: ['./src/**/*.js', './src/**/*.html'], // Include all relevant files where Tailwind classes might be used
    darkMode: 'class', // Use class-based dark mode as the component uses class toggles
    theme: {
        extend: {
            colors: {
                'custom-dark': '#1f2937',
                'custom-text': '#ffffff',
                'custom-button': '#3b82f6',
            },
        },
    },
    plugins: [],
}
