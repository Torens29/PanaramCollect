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


app.post('/getDataColl', multer().none(), function(request, response){
  
  const collection = db.collection(request.body.nameColl);

  collection.find().toArray(function(err, results){
    if(err) return console.log(err);
    console.log('/getDataColl: ');
    let arrDataOfPanorams = Array.prototype.slice.call(results);
    let dataOfPanorams={};
    arrDataOfPanorams.forEach((item,index,arr) => {
      dataOfPanorams[item.name] = item;
    });
    console.log(dataOfPanorams);
    response.send(dataOfPanorams);
  });
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
app.post("/uploadPanoram", multer({storage:storageConfig}).array("filesdata", 2), urlencodedParser, function (req, response) {
  console.log('post uploadPanoram: ');

  let collection = db.collection(req.body.nameCollection);
  collection.find({name: req.body.namePanaram}).toArray(function(err, results){
    if(results[0] !=undefined ){
      response.render('afterLoadPanoram.hbs', { resultLouding: 'Панорама с таким именем была уже создана' });
      //res.send('Панорама с таким именем была уже создана');
    }else{
      let filesdata = req.files;
        if(!filesdata)
          response.render('afterLoadPanoram.hbs', { resultLouding: 'Ошибка при загрузке файлов, проверти выбраны ли файлы' });
          //res.send("Ошибка при загрузке файлов, проверти выбраны ли файлы");
        else{
           dataOfPanaram = {
              nameCollection: req.body.nameCollection,
              name: req.body.namePanaram,
              texture: req.files[0].path,
              stencil: req.files[1].path,
            };
        }
        
        
      //преобразование в строковый RGB формат

      console.log(req.body);

      i = 1, RGB = '', flag=0;
      for(let key in req.body){
        
        if(key != `discribe${i}` && key != `inputExcursions${i-1}` && key != 'namePanaram' && key!='nameCollection' && key !=`typeOfZone${i}` && key !=`nameExcursions${i}` ){
          flag++
          console.log(flag);
          console.log('key'+ key)
          if(flag%3 != 0) { RGB += req.body[key]  + ',';}
          else {RGB += req.body[key];}
          console.log('rgb = '+ RGB );
        } else if(key == `discribe${i}`){
            dataOfPanaram[RGB] = req.body[key];
            console.log('dataOfPanaram[RGB] = '+ RGB);
            console.log('RGB1: ' +RGB);
            RGB='';
            i++;
        } else if(key == `nameExcursions${i}`){   //если выбрана связь(переход) к др панораме
          let nameExcursions;
          if(req.body[`nameExcursions${i}`] == 'write'){
             nameExcursions = req.body[`inputExcursions${i}`];
             console.log('RGB2: ' +RGB);
          }else {
             nameExcursions = req.body[`nameExcursions${i}`];
             console.log('RGB3: ' +RGB);
          }
          console.log('nameExcursions${i}: ' + nameExcursions);
          
          dataOfPanaram[RGB]= // rgbPanoram для отслеживания панарамы(panoram.js)
            `function jump(){
                    rgbPanoram = panoramData.${nameExcursions};
            }`;

          console.log('dataOfPanaram[RGB] = '+ RGB);
          console.log('RGB4: ' +RGB);

          RGB='';
          console.log('RGB5: ' +RGB);

          i++;
        }
        

      }
      

      console.log(dataOfPanaram);
      // pushToDB(dataOfPanaram);
      collection = db.collection(dataOfPanaram.nameCollection);
        collection.insertOne(dataOfPanaram, function(err, result){
            if(err){ 
                return console.log(err);
            }
            console.log(result.ops);
        });
      response.render('afterLoadPanoram.hbs', { resultLouding: 'Файлы загружен' });
      //res.send("Файлы загружен");
    }
  });
      
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

app.post("/listOfRelations", multer().none(), function (request, response) {

  console.log(request.body.nameExcursion);
  const collection = db.collection(request.body.nameExcursion);

  collection.find().toArray(function(err, results){ //не работает фильтр выборки
    if(err) return console.log(err);

    let nameExcursion = ''; 
    let dataOfExcursion = Array.prototype.slice.call(results);
    
    dataOfExcursion.forEach((item, index, arr) => {
      nameExcursion += item.name +',';
    });
    response.send(nameExcursion);
  });

});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});