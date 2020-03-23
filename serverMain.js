const express = require("express");
const multer  = require("multer");
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");

let pathOfImg;
 
//const upload = multer({dest:"./uploads"});
//app.use(express.static(__dirname));

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "uploads");
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});

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
app.post("/uploadPanaram", multer({storage:storageConfig}).array("filesdata", 2), urlencodedParser, function (req, res) {
   
  let filesdata = req.files;
    if(!filesdata)
        res.send("Ошибка при загрузке файлов");
    else
        res.send("Файлы загружен");
 
});


app.listen(3000);