// In renderer process (web page).
const { ipcRenderer } = require('electron');

ipcRenderer.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "pong"
})

document.addEventListener("DOMContentLoaded", function(event) {

});