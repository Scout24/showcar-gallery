module.exports = (function() {
    var grunt = require("grunt");
    var DEBUG = !!grunt.option('dbg');

    return {
        options: {
            autoprefixer: {'browsers': ['last 2 versions', '> 5%']},
            minifier: !DEBUG
        },
        files: {
            'dist/': 'dist/*.css'
        }
    };
})();
