import JSZip from 'jszip';
import {
    saveAs
} from 'file-saver';


export function exportglyphs(glyphs) {

    routes(glyphs);


}

function routes(glyphs){

    let button = document.getElementById('export-svg');
    button.addEventListener('click',() =>{

        cleanglyphs(glyphs);
        createzip(glyphs);

    })

}

function cleanglyphs(glyphs){

    glyphs.forEach(glyph =>{

        if (glyph.trace.length){

            glyph.path.children.forEach(path => {

                path.remove();

            })

        }

    })

}


function createzip(glyphs){

    let zip = new JSZip();
    let folder = zip.folder("transmediale_geneva");

    glyphs.forEach(glyph => {

        glyph.scope.activate();

        let file = glyph.scope.project.exportSVG({
            asString: true,
            bounds: 'content'
        });

        folder.file(glyph.char+".svg", file, {
            base64: false
        });

    })

    zip.generateAsync({
        type: "blob"
    }).then(function (content) {
        saveAs(content, "transmediale_geneva.zip");
    });

}