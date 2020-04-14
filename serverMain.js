const express = require("express");
const multer  = require("multer");
const app = express();
const bodyParser = require("body-parser");

//DB:
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
let db, dbClient;

mongoClient.connect(function(err, client){

  if(err) return console.log(err);    
  db = client.db("panaramsbd");
  dbClient = client;
  app.listen(3000, function(){
      console.log("Сервер ожидает подключения...");
  });

});

//use hbs
app.set("view engine", "hbs");
 


const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "./public/uploads");
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


app.post('/getDataColl',multer().none(), function(request, response){
  
  const collection = db.collection(request.body.nameColl);

  collection.find().toArray(function(err, results){
    if(err) return console.log(err);
    console.log('DBBBBB: ');
    console.log(results[0]);
    response.send(results[0]);
  });
  // const promise1 = new Promise(function(resolve, reject) {
    
  //     console.log(request.body.nameColl);
  //     dbOutputPanoram.panoramsData(request.body.nameColl);
  //     resolve();
  // });
  
  // promise1.then(function() {
  //   console.log(dbOutputPanoram.panoram);
  //   response.send(dbOutputPanoram.panoram);
  // });
});


app.get('/panoram', function(request,response){  
});

app.post("/panoram", urlencodedParser, function (request, response) {

  if(!request.body) return response.sendStatus(400);
  console.log( request.body);
  // Object.keys(request.body
  response.render('panoram.hbs', {nameCollection:  Object.keys(request.body)});

});

// обработка страници загрузки
app.post("/uploadPanoram", multer({storage:storageConfig}).array("filesdata", 2), urlencodedParser, function (req, res) {
  console.log('post uploadPanoram: ');
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
      // pushToDB(dataOfPanaram);
      const collection = db.collection(dataOfPanaram.nameCollection);
        collection.insertOne(dataOfPanaram, function(err, result){
            if(err){ 
                return console.log(err);
            }
            console.log(result.ops);
        });
      res.send("Файлы загружен");
 
});

app.get("/listOfPanoram", function(request, response) {
  
  let namesColl = [];
  db.listCollections().toArray(function(err, results){
    if (err)  console.log(err);
    results.forEach((item) =>{
    namesColl.push(item.name);
    }); 
  });
  console.log('namesColl: '+ namesColl);
  response.render('listOfPanoram.hbs', { collections: namesColl });
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});