const { ipcRenderer, remote } = require('electron');

const elem = document.getElementById('content');
elem.addEventListener('click',() => {
    alert('download-all');
    ipcRenderer.send("download-all'");
    window.close();
})