const {ipcRenderer, remote} = require('electron');
const _ = require('lodash');
const QueryString = require('querystring');
const tress = require('tress');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = require('url');
const needle = require('needle');
const mime = require('mime-types');

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
            job.action(job).then(setTimeout(done, data.configs.timeout));
        }, data.configs.concurrency);
        q.drain = () => {
            ipcRenderer.sendToHost({name: 'download-success'});
        };
        const array = [];
        const bookInfo = getBookInformation();
        for(let i = data.range.from; i <= data.range.to; i++) {
            array.push(i);
        }
        ipcRenderer.sendToHost({
            name: 'debug',
            data: _.chunk(array, 20)
        });
        _.forEach(_.chunk(array, 20), (item) => q.push({
            action: createTasks,
            bookInfo: bookInfo,
            array: item,
            path: path
        }));
    } else {
        ipcRenderer.sendToHost({ name: 'download-success' });
    }
});

ipcRenderer.on('cancel', async (event, data) => {
    q.kill();
    ipcRenderer.sendToHost({ name: 'download-success' });
});

async  function createTasks(data) {
    return new Promise((resolve, reject) => {
        ipcRenderer.sendToHost({
            name: 'debug',
            data: data
        });
        _.forEach(data.array, page =>  {
            q.push({
                action: getBookPageDesc,
                bookInfo: data.bookInfo,
                page: page,
                path: data.path
            });
        });
        resolve();
    });
}

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


async function getBookPageDesc(job) {
    ipcRenderer.sendToHost({
        name: 'debug',
        data: job
    });
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
    const out = fs.createWriteStream(getFilePath(job.page, job.path));
    return new Promise((done) => needle.get(job.data.url).pipe(out).on('finish', done));
    // const response = await axios.get(url.resolve('https://', job.data.url), {
    //     responseType: 'blob'
    // });
    // ipcRenderer.sendToHost({
    //     name: 'download-success',
    //     data: {
    //         name: 'true',
    //         data: response
    //     }
    // });
    // const fileReader = new FileReader();
    // fileReader.onload = function () {
    //     fs.writeFileSync(getFilePath(job.page, job.path), Buffer(new Uint8Array(this.result)))
    //     ipcRenderer.sendToHost({
    //         name: 'download-success',
    //         data: {
    //             name: 'true',
    //             data: {
    //                 a: Buffer(new Uint8Array(this.result)),
    //                 b
    //             }
    //         }
    //     });
    // };
    // fileReader.readAsArrayBuffer(response.data);
}

function getFilePath(page, dir) {
    const fileName = ('0000000000' + page.toString()).slice(-10) + '.' + mime.extension('image/png');
    return path.resolve(dir, fileName);
}