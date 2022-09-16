import JSZip from 'jszip';
import {
    saveAs
} from 'file-saver';


export function exportglyphs(glyphs) {

    routes(glyphs);


}

function routes(glyphs) {

    let button = document.getElementById('export-svg');
    button.addEventListener('click', () => {

        cleanglyphs(glyphs);
        createzip(glyphs);

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


function createzip(glyphs) {

    let zip = new JSZip();
    let folder = zip.folder("transmediale_geneva");

    let uppercase = folder.folder("uppercase");
    let lowercase = folder.folder("lowercase");
    let extended = folder.folder("extended");

    glyphs.forEach(glyph => {

        glyph.scope.activate();

        let file = glyph.scope.project.exportSVG({
            asString: true,
            bounds: 'content'
        });

        if (glyph.char.length === 1 && glyph.char == glyph.char.toUpperCase()) {

            uppercase.file(glyph.char + ".svg", file, {
                base64: false
            });

        } else if (glyph.char.length === 1 && glyph.char == glyph.char.toLowerCase()) {

            lowercase.file(glyph.char + ".svg", file, {
                base64: false
            });

        } else {

            extended.file(glyph.char + ".svg", file, {
                base64: false
            });

        }

    })

    zip.generateAsync({
        type: "blob"
    }).then(function(content) {
        saveAs(content, "transmediale_geneva.zip");
    });

}