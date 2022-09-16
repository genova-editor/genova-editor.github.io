import opentype from 'opentype.js'


export function exportotf(glyphs) {

    routes(glyphs);

}

function routes(glyphs) {

    let button = document.getElementById('export-otf');
    button.addEventListener('click', () => {

        cleanglyphs(glyphs);
        buildotf(glyphs);

    })

}

function cleanglyphs(glyphs) {

    glyphs.forEach(glyph => {

        if (glyph.trace.length) {

            glyph.path.children.forEach(path => {

                path.remove();

            })

        }

    })

}


function buildotf(glyphs) {

    let glyphlist = [];

    glyphs.forEach(glyph => {

        glyphlist.push(buildglyph(glyph));

    })

    // const font = new opentype.Font({
    //     familyName: 'OpenTypeSans',
    //     styleName: 'Medium',
    //     unitsPerEm: 1000,
    //     ascender: 800,
    //     descender: -200,
    //     glyphs: glyphlist});
    // font.download();

}

function buildglyph(glyph) {

    let p = new opentype.Path();

    glyph.trace.forEach(group => {

        group.forEach(path => {

            convertpath(path, p);

        })

    })

    let g = new opentype.Glyph({
        name: glyph.char,
        advanceWidth: 650,
        path: p
    });

    return g;

}

function collectpaths(paths) {

    let list = [];

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

    return list;

}

function convertpath(path, p) {

    //Going through the array with the segments of the paper.js Path
    for (var i2 = 0; i2 < path.length; i2++) {

        // handle In
        var x1 = paths[i2].handleIn.x;
        var y1 = paths[i2].handleIn.y;

        // handle Out
        var x2 = paths[i2].handleOut.x;
        var y2 = paths[i2].handleOut.y;

        // Point
        let x = paths[i2].point.x;
        let y = paths[i2].point.y;

        if (i2 === 0) {
            // if its the first segment use move to
            p.moveTo(x, y);
        } else if (x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
            // if there is no curve use line to
            p.lineTo(x, y);
        } else {
            // use curve if its a curve
            p.curveTo(x1 + x, y1 + y, x2 + x, y2 + y, x, y, );
        }

        if (i2 + 1 == paths.length) {
            p.close();
        }

        w = Math.max(w, x);
    }

    return p;

}