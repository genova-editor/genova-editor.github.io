import * as paper from 'paper';
import {
    constables,
    resize,
    glyphorder,
    basemetrics
} from './base';

function importAll(r) {
    return r.keys().map(r);
}

function importNames(r) {
    return r.keys();
}

const ToDecimal = hex => parseInt(hex, 16);

// VARIABLES

let svgs = importAll(require.context('../glyphs/', true, /\.(svg)$/));
svgs = svgs.slice(0, Math.ceil(svgs.length / 2));

let names = importNames(require.context('../glyphs/', true, /\.(svg)$/));
names = names.slice(0, Math.ceil(names.length / 2));

names.forEach((n, id) => {

    let s = n.substring(2, n.length - 4);
    names[id] = s;

})

const scale = constables().scale;
const unicodelist = glyphorder();
const parent = document.getElementById('glyphs');

let glyphs = [];

// INIT

export function buildglyphs() {

    buildcanvas();
    drawsvg();
    removemask();

    return glyphs;

}

function unicode2name(unicode){

    let u = unicodelist.unicode.indexOf(unicode);
    let name = unicodelist.name[u];
    
    return name;

}

function buildcanvas() {

    svgs.forEach((glyph, id) => {

        let unicode = ToDecimal(names[id]);
        let name = unicode2name(names[id]);

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        parent.appendChild(canvas);

        let c = new paper.PaperScope();
        c.setup(canvas);

        let list = {
            svg: glyph,
            canvas: canvas,
            ctx: ctx,
            scope: c,
            cap: 'square',
            char: name,
            name: names[id],
            unicode: unicode,
            offsetPaths: [],
            bounds: {},
            trace: [],
            parameter: {}
        }

        glyphs.push(list);

    })


}

function drawsvg() {

    glyphs.forEach(glyph => {

        glyph.scope.activate();

        glyph.scope.project.importSVG(glyph.svg, (load) => {

            glyph.path = load;
            glyph.canvas.width = glyph.path.bounds.width * scale;
            glyph.canvas.height = glyph.path.bounds.height * scale;
            glyph.canvas.style.width = glyph.path.bounds.width * scale / 2 + "px";
            glyph.canvas.style.height = glyph.path.bounds.height * scale / 2 + "px";
            glyph.path.scale(scale);
            glyph.path.position = new paper.Point(glyph.path.bounds.width / 2, glyph.path.bounds.height / 2);

            glyph.bounds.width = glyph.path.bounds.width * scale;
            glyph.bounds.height = glyph.path.bounds.height * scale;

            glyph.bounds.left = glyph.path.bounds.x * scale;
            glyph.bounds.right = (glyph.path.bounds.width - glyph.path.bounds.y) * scale;

            if (glyph.path.children.length > 1) {
                glyph.path.children[0].remove();
            }

            glyph.bounds.left = glyph.path.bounds.left * scale;
            glyph.bounds.right = glyph.bounds.width - glyph.path.bounds.right * scale;


            glyph.path.children.forEach(path => {

                path.style = {
                    strokeColor: "black",
                    strokeWidth: "0",
                    strokeCap: "square"
                };

            })


        });

    })


}

function removemask() {

    glyphs.forEach(glyph => {

        glyph.scope.activate();

        glyph.path.children.forEach(path => {

            if (path._clipMask && path._type === "rectangle") {

                path.remove();

            }

        })


    });

}

function getbounds() {

    glyphs.forEach((glyph, id) => {

        glyphs[id].bounds = {};

        glyph.scope.activate();

        glyph.path.children.forEach(path => {

            glyphs[id].bounds.left = path.bounds.left;
            glyphs[id].bounds.right = path.bounds.right;
            glyphs[id].bounds.top = path.bounds.top;
            glyphs[id].bounds.bottom = path.bounds.bottom;
            glyphs[id].bounds.width = path.bounds.width;
            glyphs[id].bounds.height = path.bounds.height;

        })


    });

}