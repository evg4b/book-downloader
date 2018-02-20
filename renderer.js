const EventEmitter = require('events');
const _ = require('lodash');

const webview = document.getElementById("myweb");
const urlInput = document.getElementById("url");
const ipcEmitter = new EventEmitter();
const configs = {
    concurrency: 2,
    timeout: 100
};

$('#site').dimmer({ closable: false });
$('#go').on('click', () => webview.loadURL($(urlInput).val()));
$('#refresh').on('click', () => webview.reload());
$('#back').on('click', () => webview.goBack());
$('#forward').on('click', () => webview.goForward());
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
    if(data) {
        $('#download').removeClass('disabled');
        $('#pages').val('1-' + data.maxPage);
    } else {
        $('#pages').val(null);
        $('#download').addClass('disabled');
    }
});