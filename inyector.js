const {ipcRenderer} = require('electron');
const _ = require('lodash');
const QueryString = require('querystring');

ipcRenderer.on('request', () =>
    ipcRenderer.sendToHost({
        name: 'request',
        data: getBookInformation()
    }));

ipcRenderer.on('download', (evend, data) => {
    console.log('evend')
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