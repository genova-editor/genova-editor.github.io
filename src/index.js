import 'normalize.css';
import './style.scss';

import {
    buildglyphs
} from './js/glyphs.js';
import {
    buildui
} from './js/ui.js';

const glyphs = buildglyphs();

init();

function init(){

    buildui(glyphs);

}