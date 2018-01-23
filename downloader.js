const { URLSearchParams } = require('url');

const { ipcRenderer } = require('electron');
const axios = require('axios');

ipcRenderer.on('back', (event, arg) => window.history.back());
ipcRenderer.on('forward', (event, arg) => window.history.forward());
ipcRenderer.on('refresh', (event, arg) => window.location.reload());

ipcRenderer.on('download-all', (event, arg) => {
    axios.get('/services/books.php', {
        params: {
            books_action: 'get_page_info',
            books_book: 429786,
            books_page:  1
        },
        responseType: 'json'
    }).then(response => console.log(response.data))
  
    var params = new URLSearchParams();
    params.set('books_action', 'get_page_info');
    params.set('books_book', 429786);
    params.set('books_page', 1)
    console.log(params);
});

ipcRenderer.on('download-range', (event, arg) => {
    console.log(axios);
});

document.addEventListener("DOMContentLoaded", function(event) {
    console.log('DOMContentLoaded')
    console.log(axios)
    console.log('DOMContentLoaded')
});


// /services/books.php?books_action=get_page_info&books_book=429786&books_page=1
