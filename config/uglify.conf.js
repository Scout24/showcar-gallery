module.exports = {
    options: {
        compress: true,
        mangle: true,
        sourceMap: true,
        sourceMapIn: "dist/showcar-gallery.js.map"
    },
    files: {
        "dist/showcar-gallery.min.js": "dist/showcar-gallery.js",
        "dist/showcar-carousel.min.js": "dist/showcar-carousel.js",
    }
};
