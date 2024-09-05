module.exports = {
    content: ['./src/**/*.js', './src/**/*.html'], // Make sure to cover all component paths
    darkMode: 'class', // Enable class-based dark mode
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
