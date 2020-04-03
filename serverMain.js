const express = require("express");
const multer  = require("multer");
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const pushToDB = require('./public/scripts/db');
const outputNameCollections = require('./public/scripts/dbOutputNameColl');

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


app.get("/panoram", function (request, response) {
  response.redirect("panaram.html");
});

// обработка страници загрузки
app.post("/uploadPanoram", multer({storage:storageConfig}).array("filesdata", 2), urlencodedParser, function (req, res) {
   
  let filesdata = req.files;
    if(!filesdata)
      res.send("Ошибка при загрузке файлов, проверти выбраны ли файлы");
    else
      dataOfPanaram = {
              nameCollection: req.body.nameCollection,
              name: req.body.namePanaram,
              texture: req.files[0].path,
              stencil: req.files[1].path,
              
            };
      //преобразование в строковый RGB формат
      i = 1, RGB = '', flag=0;
      for(let key in req.body){
        if(key != `discribe${i}` && key != 'namePanaram' && key!='nameCollection'){
           
          flag++;
          if(flag != 3)  RGB += req.body[key]  + ',';
          else RGB += req.body[key];
          console.log('rgb = '+ RGB );

        } else if(key == `discribe${i}`){
            dataOfPanaram[RGB] = req.body[key];
            console.log('dataOfPanaram[RGB] = '+ RGB);
            RGB='';
            i++;
        }
      }
      console.log(dataOfPanaram);
      pushToDB(dataOfPanaram);
      res.send("Файлы загружен");
 
});


//use hbs
app.set("view engine", "hbs");

app.get("/listOfPanoram", function(request, response) {
  
  // const promise = new Promise(function(resolve, reject) {
  //   outputNameCollections.outputNameCollections();
  //   console.log('inPromise: '+ outputNameCollections.Name);

  //   resolve(outputNameCollections.Name);

  // });

  // promise.then((names)=>{
  //   console.log('inPromise.then: ' + names);
  //   response.render('listOfPanoram.hbs', { collections: names });
  // });
  
  // promise.catch(error => console.log(error.message));

  outputNameCollections.outputNameCollections();
  response.render('listOfPanoram.hbs', { collections: outputNameCollections.Name });

});

app.listen(3000);