import opentype from 'opentype.js';
import UtfString from 'utfstring';

import moment from 'moment';

import {
    metrics
} from './metrics.js';

import {
    constables
} from './base';

const scale = constables().scale;


export function exportotf(glyphs) {

    routes(glyphs);

}

function routes(glyphs) {

    let button = document.getElementById('export-otf');
    button.addEventListener('click', () => {

        buildotf(glyphs);

    })

}

function buildotf(glyphs) {

    let glyphlist = [];

    glyphs.forEach(glyph => {

        glyphlist.push(buildglyph(glyph));

    })

    let datename = moment().format("YYMMDD");

    const font = new opentype.Font({
        familyName: 'Genova',
        styleName: 'Trace '+datename,
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        glyphs: glyphlist
    });
    font.download();

}

function buildglyph(glyph) {

    let p = new opentype.Path();

    glyph.trace.forEach(group => {

        group.forEach(path => {

            let lb = glyph.bounds.left / scale;

            let segments = collectsegments(path);
            convertpath(path, p, lb);

        })

    })

    let unicode = undefined;

    if (glyph.char.length == 1) {

        unicode = glyph.char.codePointAt(0)

    }

    let g = new opentype.Glyph({
        name: glyph.name,
        unicode: glyph.unicode,
        advanceWidth: glyph.bounds.width / scale + glyph.parameter.trace * scale,
        path: p
    });

    return g;

}

function collectsegments(paths) {

    let list = [];

    if (typeof paths.segments != "undefined") {

        paths.segments.forEach(s => {

            list.push(s);

        })

    }

    if (typeof paths.children != "undefined") {

        paths.children.forEach(c1 => {

            if (typeof c1.segments != "undefined") {

                c1.segments.forEach(s => {

                    list.push(s);

                })

            }

            if (typeof c1.children != "undefined") {

                c1.children.forEach(c2 => {

                    if (typeof c2.segments != "undefined") {

                        c2.segments.forEach(s => {

                            list.push(s);

                        })

                    }

                    if (typeof c2.children != "undefined") {

                        c2.children.forEach(c3 => {

                            if (typeof c3.segments != "undefined") {

                                c3.segments.forEach(s => {

                                    list.push(s);

                                })

                            }


                        })

                    }


                })

            }



        })

    }

    return list;

}

function convertpath(paths, p, lb) {

    let offset = 525;
    let scale = 2.06;

    let xb = Math.round(paths.segments[0].point.x + lb);
    let yb = Math.round(paths.segments[0].point.y * -1 + offset);

    let x1b = Math.round(paths.segments[0].handleOut.x * -1);
    let y1b = Math.round(paths.segments[0].handleOut.y * -1);

    for (let id = 0; id < paths.segments.length; id++) {

        let segment = paths.segments[id];

        // handle In
        let x1 = Math.round(segment.handleOut.x);
        let y1 = Math.round(segment.handleOut.y * -1);
        // handle Out
        let x2 = Math.round(segment.handleIn.x);
        let y2 = Math.round(segment.handleIn.y * -1);

        // Point
        let x = Math.round(segment.point.x + lb);
        let y = Math.round(segment.point.y * -1 + offset);

        if (id == 0) {

            p.moveTo(x, y);

        } else {

            if (x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
                p.lineTo(x, y);
            } else {
                p.bezierCurveTo(xb + x1b, yb + y1b, x2 + x, y2 + y, x, y);
            }

            if (id === paths.segments.length - 1) {

                x1b = x2 * -1;
                y1b = y2 * -1;
                // handle Out
                x2 = Math.round(paths.segments[0].handleIn.x * -1);
                y2 = Math.round(paths.segments[0].handleIn.y * -1);

                xb = x;
                yb = y;

                // Point
                x = Math.round(paths.segments[0].point.x + lb);
                y = Math.round(paths.segments[0].point.y * -1 + offset);

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