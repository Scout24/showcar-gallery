module.exports = {
    files: [
        'src/scss/**/*.scss',
        'src/js/**/*.js',
        'examples/**/*.js',
        'examples/**/*.scss',
        '!examples/**/*.css'
    ],
    tasks: ["dist"],
    options: {
        livereload: true
    }
};
