const path = require('path');
const url = require('url');
const mime = require('mime-types');
const { ipcRenderer, remote } = require('electron');
const _ = require('lodash');
const QueryString = require('querystring');
const tress = require('tress');
const fs = require('fs');
const modal = require('electron-modal');
const got = require('got');
const axios = require('axios');

const q = tress(function(job, done){
    job.action(job).then(done);
}, 3);

ipcRenderer.on('back', () => window.history.back());
ipcRenderer.on('forward', () => window.history.forward());
ipcRenderer.on('refresh', () => window.location.reload());

ipcRenderer.on('download-all', async () => {
    console.log('on download all');
    const bookInfo = getBookInformation();
    if(bookInfo) {
        const path = await getFolder()
        for(let i = 1; i <= bookInfo.maxPage; i++) {
            q.push({
                action: getBookPageDesc,
                bookInfo: bookInfo,
                page: i,
                path: path
            });
        }
    } else {
        alert('Не ужаеться найьти книгу на этой старанице');
    }
});


ipcRenderer.on('download-range', async () => {
    promte();
});

document.addEventListener("DOMContentLoaded", function(event) {
});


function getBookInformation() {
    const bookId = _.get(QueryString.parse(location.search), 'book_id');
    const pn_last = _.first(jQuery("#pn_last"));
    if(bookId && pn_last) {
        const regexp = /toPage\s*\(\s*(\d*)\s*\)/;
        const pageMatcher = _.get($(pn_last).data( "events" ), 'click')
            .map((item) => item.handler.toString().match(regexp))
            .find((item) => !!item);
        const maxPage = Number(pageMatcher[1]);
        return {
            maxPage: maxPage,
            bookId: bookId
        };
    }
    return  null;
}

async function getBookPageDesc(job) {
    const resourceUrl = new url.URL(url.resolve(location.origin, '/services/books.php'));
    resourceUrl.search = QueryString.stringify({
        books_action: 'get_page_info',
        books_book: job.bookInfo.bookId,
        books_page:  job.page,
    });

    try {
        const response = await new Promise((resolve, reject) => $.ajax(resourceUrl.toString()).then((r) => resolve(JSON.parse(r))));
        q.push({
            action: getBookPage,
            data: response,
            path: job.path,
            page:  job.page
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}


async function getBookPage(job) {
    return axios.get(url.resolve(location.origin, job.data.url), {
        responseType: 'blob'
    })
    .then((response) => {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            fs.writeFileSync(getFilePath(job.page, job.path), Buffer(new Uint8Array(this.result)))
        };
        fileReader.readAsArrayBuffer(response.data);
    })
    .catch(function (error) {
    });
}

async function getFolder() {
    return new Promise((resolve) => remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => resolve(_.first(files))));
}

function getFilePath(page, dir, headers) {
    const fileName = ('0000000000' + page.toString()).slice(-10) + '.' + mime.extension('image/png');
    return path.resolve(dir, fileName);
}

function promte() {
    // renderer process (mainWindow)
    let modal = window.open(path.join(__dirname, 'dialogs/download.html'), 'modal')
    console.log(modal);
}