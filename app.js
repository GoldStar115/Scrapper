

var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
const cheerio = require('cheerio');
const cheerioTableParse = require('cheerio-tableparser');
var multer = require('multer');
var fs = require('fs');
var app = express();
var path = require('path');
var https = require('https');
var download = require('download-file');
const util = require('util');
const readFile = util.promisify(fs.readFile);

var PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const folderName = 'e1';
const htmlName = 'h1';
app.listen(PORT, async function () {
    console.log('Listening on port ' + PORT);
    getStart()
});

async function getStart() {
    const resHTML = await getHtmlFile();
    const res =  await GetData(resHTML);
    console.log('Success', res);
};
async function getHtmlFile() {
    const dirName = `${__dirname}/${folderName}/${htmlName}.html`
    return await readFile(dirName, 'utf8');
}
async function GetData(html) {
    try {
        let $ = cheerio.load(html); 
        const htmlObj = $('xpl-results-list', html).children();
        for (const idx in htmlObj) {
            const link = $('a', htmlObj[idx]).attr('href')
            if (link && link.includes('document') && link.includes('/')) {
                const name = link.split('/')[2]
                console.time(name);
                // await GetPDFLink(name);
                console.timeEnd(name);
            }
        }
        return true;
    } catch (error) {
        console.log(error.message);   
    }
}
async function DownLoadPDF(url) {
    const name = url.split('/')[url.split('/').length - 1];
    var directory = './downloads'
    var options = {
        directory, filename: name
    }
    return new Promise(function(resolve, reject){
        download(url, options, function (err, res) {
            if (err) {                
                reject(err);
            } else {
                resolve(res)
            }
        });
    })
}

async function GetPDFLink(name) {
    try {
        const url = `https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=${name}`
        const response = await axios.get(url)
        let $ = cheerio.load(response.data);
        cheerioTableParse($);
        const pdfLink = $('iframe', response.data).attr('src').split('?')[0]
        const res = await DownLoadPDF(pdfLink); 
        console.log(res);
        return true;
    } catch (error) {
        console.log('Exception error ', error.message);
    }
}