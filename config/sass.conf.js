module.exports = (function() {
    var grunt = require("grunt");
    var DEBUG = !!grunt.option('dbg');

    return {
        options: {
            outputStyle: DEBUG ? 'expanded' : 'compressed',
            sourceMap: DEBUG,
            sourceMapEmbed: true,
            autoprefixer: {'browsers': ['last 3 versions', '> 1%']},
        },
        files: [
            {dest: 'examples/css/style.css', src: 'examples/css/style.scss'},
            {dest: 'dist/showcar-gallery.css', src: 'src/scss/showcar-gallery.scss'}
        ]
    }
})();
