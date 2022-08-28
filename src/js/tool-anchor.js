import * as paper from 'paper';
import paperCore from 'paper/dist/paper-core';

import {
    metrics
} from './metrics.js';

let rotation = 0;
let offset = 10;

export function toolanchor(glyphs) {

    addevents(glyphs);

}

function addevents(glyphs) {

    let slidersize = document.getElementById('handle-size');

    slidersize.addEventListener('input', () => {

        offset = parseFloat(slidersize.value);
        list(glyphs);

    })

    let sliderdir = document.getElementById('handle-dir');

    sliderdir.addEventListener('input', () => {

        rotation = parseFloat(sliderdir.value);
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

                    anchor(child);

                })

            } else {

                    anchor(path);

            }

        })
        glyph.path.fullySelected = true;


    })

}

function anchor(path) {

    path.segments.forEach(segment => {

        let c = new paper.Path.Circle(new paper.Point(offset,0), 1);
        c.rotate(rotation, new paper.Point(0,0));

        let hi = segment.handleIn;
        hi.x = c.bounds.center.x;
        hi.y = c.bounds.center.y;

        c.position = new paper.Point(-offset,0);
        c.rotate(rotation, new paper.Point(0,0));

        let ho = segment.handleOut;
        ho.x = c.bounds.center.x;
        ho.y = c.bounds.center.y;

        c.remove();

    })

}

function cleartrace(glyphs) {

    glyphs.forEach(glyph => {

        glyph.trace.forEach(circles => {

            circles.forEach(circle => {

                circle.remove();

            })

        })

    })

}