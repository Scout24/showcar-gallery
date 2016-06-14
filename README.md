# showcar-gallery

This module provides an easy to use gallery.

## Usage

For an example usage of the gallery, have a look inside the
examples directory.

### HTML Code

The whole gallery is defined by an `as24-gallery` element. Each
item needs to be wrapped inside a `as24-gallery-item` element.
Basically any content within an item is possible. Normally you
would use an `a` (for seo reasons) wrapping an `img` tag.

The items with the classes
`placeholder` (placeholder when no images are defined),
`page` (displays the current and total pages),
`left` (left paginator) and
`right` (right paginator)
are special child nodes that you can style and fill
depending on your individual needs.

```html
<as24-gallery data-preload-items="2">
    <div class="left"></div>
    <as24-gallery-item>
        <a href="http://placehold.it/640x480?text=1">
            <img src="http://placehold.it/640x480?text=1,640x480" alt="">
        </a>
    </as24-gallery-item>

    ...

    <div class="placeholder">No Images</div>
    <div class="right"></div>
    <div class="pager"></div>
</as24-gallery>
```

#### lazy loading
 For better performance it is possible to lazy load images. Therefor just replace
 the `src` attribute of your `img` with an `data-src` attribute. For SEO reasons
 include the source of the first `img` always with the `src` attribute.

### preload count
 You can adjust the amount of images that are preloaded with the `data-preload-items`
 the default value is `2`.

### CSS Styling

To use the gallery on your page, some minimal css code is needed:

```css
    as24-gallery {
      height: 480px;
      width: 100%;

      as24-gallery-item {
        width: 50%;
        min-width: 320px;
      }
    }
```

### JS Interface

If you need to change the size of the gallery dynamically (e.g. width and/or height), you can call the ``redraw()`` method, to force the gallery to recalculate its sizings and positionings.

```
document.getElementById('gallery-example').redraw()
```

### JS Events

You can listen on a `as24-gallery:change` event. This event is triggered if a page was changed and a new image loaded:

```
$('as24-gallery').on('as24-gallery:change', (e) => console.log("Page changed", e) );
```

## Installation

### How to install:

  Via NPM:

  `npm i --save git+ssh://git@github.com:AutoScout24/showcar-gallery.git`

  Afterwards you can include it in your JS code

  ```js
  require('showcar-gallery') // or import 'showcar-gallery';
  ```

  ... and SCSS code

  ```scss
  @import "node_modules/showcar-gallery/dist/showcar-gallery.css"
  ```

## Contributing

### How to contribute:

  Fork this repository and `git clone` your fork. Then `npm install` the required dependencies.

  Note: If you do not have `grunt` installed globally, use `./node_modules/.bin/grunt` instead.

#### Contribute

  Save your changes and run `grunt dist` (or `./node_modules/.bin/grunt dist`).

  Commit your code _and_ the compiled libraries in _./dist_. Then create a pull-request.


## License

MIT License
