module.exports = [
    {
        entry: "./src/js/showcar-gallery.js",
        output: {
            filename: "./dist/showcar-gallery.js"
        },
        module: {
            loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015,plugins=babel-plugin-transform-object-assign"}]
        },
        devtool: "source-map",
        cache: true
    },
    {
        entry: "./src/js/showcar-carousel.js",
        output: {
            filename: "./dist/showcar-carousel.js"
        },
        module: {
            loaders: [{test: /\.js$/, loader: "babel?presets[]=es2015,plugins=babel-plugin-transform-object-assign"}]
        },
        devtool: "source-map",
        cache: true
    },
];