module.exports = {
    files: [
        'src/scss/**/*.scss',
        'src/js/**/*.js',
        'examples/**/*',
        '!examples/**/*.css'
    ],
    tasks: ["dist"],
    options: {
        livereload: true
    }
};
