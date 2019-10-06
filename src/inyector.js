const { ipcRenderer, remote } = require('electron');
const _ = require('lodash');
const QueryString = require('querystring');
const tress = require('tress');
const fs = require('fs');
const path = require('path');
const url = require('url');
const needle = require('needle');
const mime = require('mime-types');
const svg2png = require("svg2png");

const modules = {
    'biblio-online.ru': {
        getBookInformation: async () => {
            const bookId = window.content_id;
            if (bookId) {
                const dat = await getJson(`/viewer/getData/${bookId}`);
                return {
                    maxPage: dat.pages.count,
                    bookId: bookId
                }
            }
            throw new Error();
        },
        action: getBookPageOnline
    },
    'biblioclub.ru': {
        getBookInformation: () => {
            const bookId = _.get(QueryString.parse(location.search), 'book_id');
            const pn_last = _.first(jQuery(".num-page-box .num"));
            if (bookId && pn_last) {
                const maxPage = Number(_.trim(pn_last.innerText, '/\\ '));
                return {
                    maxPage: maxPage,
                    bookId: bookId
                };
            }
            return null;
        },
        action: getBookPageDesc
    },
};

let q = null;

document.addEventListener("DOMContentLoaded", () => {
    clearLinks();
    document.addEventListener('DOMNodeInserted', clearLinks);
});

function clearLinks() {
    _.forEach(jQuery('a'), (a) => {
        jQuery(a).removeAttr('target');
    });
}

ipcRenderer.on('request', async () =>
    ipcRenderer.sendToHost({
        name: 'request',
        data: await getBookInformation()
    }));

ipcRenderer.on('download', async (event, data) => {
    const path = await getFolder()
    if (path) {
        q = tress(function (job, done) {
            job.action(job).then(setTimeout(done, data.configs.timeout));
        }, data.configs.concurrency);
        q.drain = () => {
            ipcRenderer.sendToHost({ name: 'download-success' });
        };
        const array = [];
        const bookInfo = await getBookInformation();
        for (let i = data.range.from; i <= data.range.to; i++) {
            array.push(i);
        }
        _.forEach(_.chunk(array, 5), (item) => q.push({
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

ipcRenderer.on('navigate', async (event, href) => {
    if (url.parse(location.href).pathname !== url.parse(href).pathname) {
        location.href = href;
    }
});

async function createTasks(data) {
    return new Promise((resolve, reject) => {
        _.forEach(data.array, page => {
            q.push({
                action: getCurrentModule().action,
                bookInfo: data.bookInfo,
                page: page,
                path: data.path
            });
        });
        resolve();
    });
}

async function getBookInformation() {
    try {
        return await getCurrentModule().getBookInformation();
    } catch (e) {
        console.error(e)
        return null;
    }
}

function getCurrentModule() {
    const { host } = url.parse(location.href);
    if (modules[host]) {
        return modules[host];
    }
    throw Error('Not found module');
}

async function getFolder() {
    return new Promise((resolve) => remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => resolve(_.first(files))));
}


async function getBookPageDesc(job) {
    const resourceUrl = new url.URL(url.resolve(location.origin, '/services/books.php'));
    resourceUrl.search = QueryString.stringify({
        books_action: 'get_page_info',
        books_book: job.bookInfo.bookId,
        books_page: job.page,
    });
    try {
        const response = await new Promise((resolve, reject) => $.ajax(resourceUrl.toString()).then((r) => resolve(JSON.parse(r))));
        q.push({
            action: getBookPage,
            data: response,
            path: job.path,
            page: job.page
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function getBookPageOnline(job) {
    const svg = await loadSvg(job);
    await writeSvgToPng(svg, job);
}

function writeSvgToPng(svg, job) {
    return new Promise((resolve, reject) => {
        svg2png(svg, { width: 726 * 5, height: 1115 * 5 })
            .then(buffer => {
                fs.writeFile(getFilePath(job.page, job.path), buffer, resolve)
            }).catch(reject);
    });
}

function loadSvg(job) {
    return new Promise((done, error) => {
        needle('get', url.resolve(location.href, `/viewer/getPage/${job.bookInfo.bookId}/${job.page}`))
            .then(function (resp) { done(resp.body) })
            .catch(function (err) { error(err) });
    });
}

async function getBookPage(job) {
    return new Promise((done) => needle
        .get(job.data.url)
        .pipe(fs.createWriteStream(getFilePath(job.page, job.path)))
        .on('finish', done));
}

function getJson(path) {
    return new Promise((done, error) => {
        needle('post', url.resolve(location.href, path), {}, { json: true })
            .then(function (resp) { done(resp.body) })
            .catch(function (err) { error(err) })
    });
}

function getFilePath(page, dir) {
    const fileName = ('0000000000' + page.toString()).slice(-10) + '.' + mime.extension('image/png');
    return path.resolve(dir, fileName);
}