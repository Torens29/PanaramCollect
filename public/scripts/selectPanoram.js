document.addEventListener("click", function(e) {
    console.log(e.target);
    console.log(e.target.tagName);
    console.log(e.target.innerHTML);

    if  (e.target.tagName =='LI') {
        console.log('wertyucfvgbh');

        let xhr = new XMLHttpRequest();        
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');      
        xhr.open('POST', '/panoram');
        if (request.readyState == 4 && request.status == 200){ console.log(request.responseText);}
        xhr.send(e.target.innerHTML);
    }
});