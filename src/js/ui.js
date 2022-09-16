import {
    constables,
    resize
} from './base.js';
import {
    toolstroke
} from './tool-stroke.js';
import {
    exportglyphs
} from './export.js';
import {
    exportotf
} from './otf.js';
import {
    tooltrace
} from './tool-trace.js';
import {
    toolanchor
} from './tool-anchor.js';

// VARIABLES

const scale = constables().scale;
const parent = document.getElementById('glyphs');

// INIT

export function buildui(glyphs) {

    toolstroke(glyphs);
    tooltrace(glyphs);
    toolanchor(glyphs);
    exportglyphs(glyphs);
    exportotf(glyphs);

}