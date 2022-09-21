import * as paper from 'paper';

export function metrics(glyph, s) {

    bounds(glyph, s);

}


function bounds(glyph, s) {

    glyph.scope.activate();

    let bounds = glyph.path.bounds;

    glyph.bounds.left = bounds.x;
    glyph.bounds.right = glyph.bounds.width - bounds.x;

    // glyph.canvas.width = glyph.bounds.width + s * 2;
    // glyph.canvas.height = glyph.bounds.height + s;
    // glyph.canvas.style.width = glyph.bounds.width + s * 2 + "px";
    // glyph.canvas.style.height = glyph.bounds.height + s + "px";
    // glyph.path.position = new paper.Point(glyph.path.bounds.width / 2, glyph.path.bounds.height / 2);

    // glyph.bounds.width += s * 2;
    // glyph.bounds.height += s;

}