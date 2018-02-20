const {ipcRenderer, remote} = require('electron');
const _ = require('lodash');
const QueryString = require('querystring');
const tress = require('tress');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = require('url');

let q = null;

// const mime = require('mime-types');
// const { ipcRenderer, remote } = require('electron');
// const tress = require('tress');
// const fs = require('fs');
// const modal = require('electron-modal');
// const got = require('got');
// const axios = require('axios');

ipcRenderer.on('request', () =>
    ipcRenderer.sendToHost({
        name: 'request',
        data: getBookInformation()
    }));

ipcRenderer.on('download', async (event, data) => {
    const path = await getFolder()
    if(path) {
        q = tress(function(job, done){
            ipcRenderer.sendToHost({
                name: 'download-success',
                data: job
            });
            job.action(job).then(setTimeout(done, data.configs.timeout));
        }, data.configs.concurrency);
        for(let i = data.range.from; i <= data.range.to; i++) {
            q.push({
                action: getBookPageDesc,
                bookInfo: getBookInformation(),
                page: i,
                path: path
            });
        }
    }
});

function getBookInformation() {
    const bookId = _.get(QueryString.parse(location.search), 'book_id');
    const pn_last = _.first(jQuery("#pn_last"));
    if(bookId && pn_last) {
        const regexp = /toPage\s*\(\s*(\d*)\s*\)/;
        const pageMatcher = _.get(jQuery(pn_last).data( "events" ), 'click')
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

async function getFolder() {
    return new Promise((resolve) => remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => resolve(_.first(files))));
}

function getFilePath(page, dir, headers) {
    const fileName = ('0000000000' + page.toString()).slice(-10) + '.' + mime.extension('image/png');
    return path.resolve(dir, fileName);
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
        ipcRenderer.sendToHost({
            name: 'download-success',
            data: response
        });
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
    ipcRenderer.sendToHost({
        name: 'download-success',
        data: url.resolve('http://', job.data.url)
    });
    return await axios.get(url.resolve('http://', job.data.url), {
        responseType: 'blob'
    })
    .then((response) => {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            fs.writeFileSync(getFilePath(job.page, job.path), Buffer(new Uint8Array(this.result)))
        };
        fileReader.readAsArrayBuffer(response.data);
        ipcRenderer.sendToHost({
            name: 'download-success',
            data: getFilePath(job.page, job.path)
        });
        return response;
    })
    .catch(function (error) {
    });
}