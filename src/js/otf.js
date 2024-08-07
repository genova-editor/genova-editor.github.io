import opentype from 'opentype.js';
import UtfString from 'utfstring';

import moment from 'moment';

const ToDecimal = hex => parseInt(hex, 16);

import {
    getmetrics
} from './metrics.js';

import {
    constables
} from './base';

const scale = constables().scale;
const pathscale = 2;

let removeoverlap = true;


export function exportotf(glyphs) {

    routes(glyphs);

}

function routes(glyphs) {

    let button = document.getElementById('export-otf');
    button.addEventListener('click', () => {

        document.body.classList.add('generating');
        setTimeout(function() {
            buildotf(glyphs);
        }, 100);

    })

    let overlapradio = document.getElementById('overlap');
    overlapradio.addEventListener('click', () => {

        removeoverlap = overlapradio.checked;

    })

}

function buildotf(glyphs) {

    let glyphlist = [];

    let notdefGlyph = new opentype.Glyph({
        name: '.notdef',
        unicode: 0,
        advanceWidth: 280,
        path: new opentype.Path()
    });

    glyphlist.push(notdefGlyph);

    let space = new opentype.Glyph({
        name: 'space',
        unicode: ToDecimal("0020"),
        advanceWidth: 280,
        path: new opentype.Path()
    });

    glyphlist.push(space);

    glyphs.forEach(glyph => {

        glyphlist.push(buildglyph(glyph));

    })

    let datename = moment().format("YYMMDD");

    const font = new opentype.Font({
        familyName: 'Genova',
        styleName: 'Trace ' + datename,
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        glyphs: glyphlist
    });
    font.download();

    document.body.classList.remove('generating');

}

function buildglyph(glyph) {

    let p = new opentype.Path();
    let metrics = getmetrics(glyph.char);
    let paths = [];

    if (removeoverlap) {

        glyph.trace.forEach(group => {

            if (group.length > 0) {

                Array.prototype.push.apply(paths, filteroverlap(group));

            }

        })

    } else {

        glyph.trace.forEach(group => {

            if (group.length > 0) {

                Array.prototype.push.apply(paths, group);

            }

        })

    }




    paths.forEach(path => {

        let lb = glyph.parameter.trace / 2;

        if (path.segments.length) {
            convertpath(path, p, lb, glyph.parameter.trace / 2);
        }

    })


    let g = new opentype.Glyph({
        name: glyph.char,
        unicode: glyph.unicode,
        advanceWidth: metrics.width + glyph.parameter.trace,
        path: p
    });

    return g;

}

function filteroverlap(group) {

    let overlap = [];

    if (group.length) {

        let u = group[0];

        for (let i = 1; i < group.length; i++) {

            if (group[i].intersects(u) && !u.hasChildren()) {

                let t = u;

                u = group[i].unite(t, {
                    insert: false
                });

            } else {

                if (u.hasChildren()) {

                    u.children.forEach(c => {

                        overlap.push(c);

                    })

                } else {

                    overlap.push(u);


                }
                u = group[i];

            }

        }

        if (u.hasChildren()) {

            u.children.forEach(c => {

                overlap.push(c);

            })

        } else {

            overlap.push(u);


        }

    }

    return overlap;

}

function convertpath(paths, p, lb, trace) {

    let offset = 1000 + trace;

    let xb = Math.round(paths.segments[0].point.x * pathscale + lb);
    let yb = Math.round(paths.segments[0].point.y * pathscale * -1 + offset);

    let x1b = Math.round(paths.segments[0].handleOut.x * pathscale * -1);
    let y1b = Math.round(paths.segments[0].handleOut.y * pathscale * -1);

    for (let id = 0; id < paths.segments.length; id++) {

        let segment = paths.segments[id];

        // handle In
        let x1 = Math.round(segment.handleOut.x * pathscale);
        let y1 = Math.round(segment.handleOut.y * pathscale * -1);
        // handle Out
        let x2 = Math.round(segment.handleIn.x * pathscale);
        let y2 = Math.round(segment.handleIn.y * pathscale * -1);

        // Point
        let x = Math.round(segment.point.x * pathscale + lb);
        let y = Math.round(segment.point.y * pathscale * -1 + offset);

        if (id == 0) {

            p.moveTo(x, y);

        } else {

            if (x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
                p.lineTo(x, y);
            } else {
                p.bezierCurveTo(xb + x1b, yb + y1b, x2 + x, y2 + y, x, y);
            }

            if (id === paths.segments.length - 1) {

                x1b = Math.round(segment.handleOut.x * pathscale);
                y1b = Math.round(segment.handleOut.y * pathscale * -1);
                // handle Out
                x2 = Math.round(paths.segments[0].handleIn.x * pathscale * -1);
                y2 = Math.round(paths.segments[0].handleIn.y * pathscale * -1);

                xb = x;
                yb = y;

                // Point
                x = Math.round(paths.segments[0].point.x * pathscale + lb);
                y = Math.round(paths.segments[0].point.y * pathscale * -1 + offset);

                p.bezierCurveTo(xb + x1b, yb + y1b, x2 + x, y2 + y, x, y);

                p.closePath();
            }

        }

        xb = x;
        yb = y;

        x1b = x1;
        y1b = y1;

    }

    return p;

}