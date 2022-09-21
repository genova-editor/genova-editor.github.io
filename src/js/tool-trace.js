import * as paper from 'paper';

import {
    metrics
} from './metrics.js';

let size = 30;
let offset = 0.5;
let compress = 0.5;
let rotate = 0;
let taper = 1;
let anchor = 0;
let shapeform = 'circle';

export function tooltrace(glyphs) {

    addevents(glyphs);

}

function addevents(glyphs) {

    let slidersize = document.getElementById('trace-size');

    slidersize.addEventListener('input', () => {

        size = parseFloat(slidersize.value);
        list(glyphs);

    })

    let slideroffset = document.getElementById('trace-offset');

    slideroffset.addEventListener('input', () => {

        offset = parseFloat(slideroffset.value) / 100;
        list(glyphs);

    })

    let slidertaper = document.getElementById('trace-taper');

    slidertaper.addEventListener('input', () => {

        taper = parseFloat(slidertaper.value / 100);
        list(glyphs);

    })

    let slidercompress = document.getElementById('trace-compress');

    slidercompress.addEventListener('input', () => {

        compress = parseFloat(slidercompress.value) / 100;
        list(glyphs);

    })

    let sliderrotate = document.getElementById('trace-rotate');

    sliderrotate.addEventListener('input', () => {

        rotate = parseFloat(sliderrotate.value);
        list(glyphs);

    })

    let shapes = Array.from(document.getElementById('trace-shape').children);
    shapes.forEach(shape => {

        shape.addEventListener('click', () => {

            shapeform = shape.dataset.shape;
            list(glyphs);

        })

    })

    let slideranchor = document.getElementById('anchor-size');

    slideranchor.addEventListener('input', () => {

        anchor = parseFloat(slideranchor.value);
        list(glyphs);

    })


}

function list(glyphs) {

    cleartrace(glyphs);

    glyphs.forEach(glyph => {

        glyph.scope.activate();
        glyph.ctx.clearRect(0, 0, glyph.canvas.width, glyph.canvas.height);

        glyph.path.children.forEach(path => {

            if (path.hasOwnProperty('_children')) {

                path._children.forEach(child => {

                    glyph.trace.push(trace(child));
                    glyph.trace.push(anchors(child));

                })

            } else {

                glyph.trace.push(trace(path));
                glyph.trace.push(anchors(path));

            }

        })

        glyph.path.fullySelected = false;
        glyph.parameter.trace = size;

    })

}

function trace(path) {

    let l = path.length;
    let interval = offset;

    let circles = [];

    let i = 0;

    while (i < l) {

        let s = size / 2 * (i / l + (1 - i / l) * taper);
        let o = s * offset - s * 0.9;

        let p = path.getPointAt(i);

        var circle = createshape(s, p);
        circle.fillColor = 'black';

        circles.push(circle);

        i += s + o + 1;

    }

    return circles;

}

function anchors(path) {


    let circles = [];

    if (anchor > 0) {


        path.segments.forEach(segment => {

            let p = segment.point;
            var circle = createshape(anchor, p);
            circle.fillColor = 'black';

            circles.push(circle);


        })

    }

    return circles;

}

function createshape(s, p) {

    let shape;

    if (shapeform === 'circle') {

        shape = new paper.Path.Circle(p, s);

    } else if (shapeform === 'square') {

        shape = new paper.Path.RegularPolygon(p, 4, s);

    } else if (shapeform === 'triangle') {

        shape = new paper.Path.RegularPolygon(p, 3, s);

    } else if (shapeform === 'star') {

        shape = new paper.Path.Star(p, 8, s * 1.2, s * 0.2);

    }

    shape.scale(1 * compress, (1 - compress) * 1);
    shape.rotate(rotate);

    return shape;

}

function cleartrace(glyphs) {

    glyphs.forEach(glyph => {

        glyph.trace.forEach(circles => {

            circles.forEach(circle => {

                circle.remove();

            })

        })

        glyph.trace.splice(0, glyph.trace.length);

    })

}