module.exports = (function () {
    var grunt = require("grunt");
    var DEBUG = !!grunt.option('dbg');

    return {
        options: {
            outputStyle: DEBUG ? 'expanded' : 'compressed',
            sourceMap: DEBUG,
            sourceMapEmbed: true
        },
        files: [
            {dest: 'examples/css/style.css', src: 'examples/css/style.scss'},
            {dest: 'dist/showcar-gallery.css', src: 'src/scss/showcar-gallery.scss'},
            {dest: 'dist/showcar-carousel.css', src: 'src/scss/showcar-carousel.scss'},
            {
                expand: true,
                cwd: 'examples',
                src: ['*.scss'],
                dest: 'examples',
                ext: '.css'
            }
        ]
    }
})();
