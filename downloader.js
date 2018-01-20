import { URLSearchParams } from 'url';

const { ipcRenderer } = require('electron');
const axios = require('axios');

ipcRenderer.on('download-all', (event, arg) => {
  console.log(arg) // prints "pong"
});

ipcRenderer.on('download-range', (event, arg) => {
  console.log(axios);
});

document.addEventListener("DOMContentLoaded", function(event) {

});

axios.get('/services/books.php', {
  params: {
    books_action: 'get_page_info',
    books_book: 429786,
    books_page:  1
  }
}).then(console.log)

var params = new URLSearchParams();
params.set('books_action', 'get_page_info');
params.set('books_book', 429786);
params.set('books_page', 1)

// /services/books.php?books_action=get_page_info&books_book=429786&books_page=1