const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const html = fs.readFileSync('./build/index.html');

const metaLoader = require('./public/meta/meta');

app.use('/', express.static('build'));
app.use('/metastatic', express.static('public/meta'));
app.use('/static', express.static('build/static'));

app.get('/*', (req, res) => {
    res.end(composeHtml(html.toString(), metaLoader.load(req.url)));
})

app.listen(5000, () => {
    console.log("Server started");
})


function composeHtml(html, meta) {
   
    let splitted = html.split('<title>Confidences d\'Abeilles</title>');
    let output = "";
    if (meta.title) {
        output = output + '<title>' + meta.title + '</title>';
    }
    if (meta.ogtitle) {
        output = output + '<meta id="og-title" property="og:title" content="' + meta.ogtitle + '" />';
    }
    if (meta.ogdescription) {
        output = output + '<meta id="og-description" property="og:description" content="'+meta.ogdescription+'" />';
    }
    if (meta.ogurl) {
        output = output + '<meta id="og-url" property="og:url" content="'+meta.ogurl+'" />';
    }
    if (meta.ogimg) {
        output = output + '<meta id="og-image" property="og:image" content="' + meta.ogimg + '" />';
    }
    return splitted[0] + output + splitted[2];
}