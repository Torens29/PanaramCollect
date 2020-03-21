const express = require("express");
const multer  = require("multer");
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");

let pathOfImg;
 
const upload = multer({dest:"./uploads"});
//app.use(express.static(__dirname));
 
const urlencodedParser = bodyParser.urlencoded({extended: false});


app.use(express.static(__dirname + "/public"));

//главная стр
app.get("/",function (request, response) {
  response.redirect("main.html");
});


app.get("/download", function (request, response) {
  response.redirect("download.html");
});


app.get("/panaram", function (request, response) {
  response.redirect("panaram.html");
});

// обработка страници загрузки
app.post("/uploadPanaram", upload.array("filesdata", 2), urlencodedParser, function (req, res) {
   
    let filesdata = req.files,
    newNames= [req.body.newNamePanaram, req.body.newNameShablon];

    for(let i=0; i >2; i++){
      console.log(filesdata[i]);
      // oldName=filedata.filename;
      if(!filedata[i])
          res.send("Ошибка при загрузке файла");
      else{
        if(filesFilter(filesdata[i], newNames[i])){
          console.log('filedata.filename '+ [i] +'= ' + filedata.filename);
          console.log(pathOfImg);
          res.send("Файл загружен");
        }else res.send("Не верное расширение файла");
      }
    }
});


// фильтр для загружаемых файлов
function filesFilter (filedata, newName) {

// проверка массива файлов
//   let tail;
//   for(let i=0; i >2; i++){
//     tail[i] = filedata[i].originalname.split(".");

//     if(tail[i][tail[i].length-1] == 'jpg' || tail[i][tail[i].length-1] == 'png'){
//       console.log('tail[' + i +']= ' + tail[i][tail[i].length-1]); 
      
//       pathOfImg = './uploads/'+ newName +'.' + tail[tail.length-1];
//       fs.rename('./uploads/'+ filedata.filename, pathOfImg,
//           function(err) {
//             if ( err ) console.log('ERROR: ' + err);
//             console.log('ok');
//       });
//       return true;
//     } else return false;
//   }
// }
    let tail = filedata.originalname.split(".");

    if(tail[tail.length-1] == 'jpg' || tail[tail.length-1] == 'png'){
      
      console.log(tail[tail.length-1]); 

    // if(filedata.mimetype === "image/png" || 
    // filedata.mimetype.mimetype === "image/jpg"|| 
    // filedata.mimetype.mimetype === "image/jpeg"){
      
      pathOfImg = './uploads/'+ newName +'.' + tail[tail.length-1];

      fs.rename('./uploads/'+ filedata.filename, pathOfImg,
          function(err) {
            if ( err ) console.log('ERROR: ' + err);
            console.log('ok');
          });
        return true;
      } else return false;
}

app.listen(3000);