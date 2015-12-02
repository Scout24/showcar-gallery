module.exports = {
    entry: "./src/js/showcar-gallery.js",
    output: {filename: "./dist/showcar-gallery.js"},
    module: {
        loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015"}]
    },
    devtool: "source-map",
    cache: true
};
