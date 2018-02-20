const EventEmitter = require('events');
const _ = require('lodash');

const webview = document.getElementById("myweb");
const urlInput = document.getElementById("url");
const ipcEmitter = new EventEmitter();
const configs = {
    concurrency: 2,
    timeout: 100
};
let bookInfo = null;

$('#site').dimmer({ closable: false });
$('#go').on('click', () => webview.loadURL($(urlInput).val()));
$('#refresh').on('click', () => webview.reload());
$('#back').on('click', () => webview.goBack());
$('#forward').on('click', () => webview.goForward());
$('#download').on('click', () => {
    const range = validatePageRange();
    if(range) {
        webview.send('download', {
            range: range,
            configs: configs
        });
    } else {
        alert('Проверьте диапазон страниц')
    }
});
$('#download').focusout(() => !validatePageRange() && resetPageRange());
_.each(_.keys(configs), (item) => {
    const def = _.get(configs, item);
    $('#' + item).val(def);
    $('#' + item).focusout(() => {
        var num = Number($('#' + item).val());
        _.set(configs, item, num || def);
        $('#' + item).val(_.get(configs, item));
    });
});
webview.addEventListener("will-navigate", (event) => $(urlInput).val(event.url));
webview.addEventListener('did-start-loading', () => $('#site').dimmer('show'));
webview.addEventListener('did-stop-loading', () => $('#site').dimmer('hide'));
webview.addEventListener("dom-ready", () => webview.send("request"));
webview.addEventListener('ipc-message', (event) => ipcEmitter.emit(event.channel.name, event.channel.data));
ipcEmitter.on('request', (data) => {
    bookInfo = data;
    if(data) {
        $('#download').removeClass('disabled');
        resetPageRange();
    } else {
        $('#pages').val(null);
        $('#download').addClass('disabled');
    }
});
ipcEmitter.on('download-success', (data) => {
    console.log(data)
});

function validatePageRange() {
    const machesRange = $('#pages').val().match(/^\s*(\d*)\s*-\s*(\d*)\s*$/);
    const machesSingle = $('#pages').val().match(/^\s*(\d*)\s*$/);
    if(isCorrectRange(machesRange, 1)) {
        return {
            from: Number(_.get(machesRange, 1)),
            to: Number(_.get(machesRange, 2))
        }
    } else if (isCorrectSingle(machesSingle)) {
        return {
            from: Number(_.get(machesSingle, 1)),
            to: Number(_.get(machesSingle, 1))
        }
    } else {
        return null;
    }
}

function isCorrectSingle(range) {
    return !!_.get(range, 1);
}

function isCorrectRange(range) {
    return _.get(range, 1) && _.get(range, 2) && _.get(range, 1) <= _.get(range, 2);
}

function resetPageRange() {
    $('#pages').val('1-' + bookInfo.maxPage);
}