let xhr = new XMLHttpRequest();

xhr.open('GET', '/panoram');

// xhr.responseType = 'json';
xhr.send();

xhr.onload = function() {
    console.log('download: ');
    console.log(xhr.response);
};