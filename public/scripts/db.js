let pushToDB = function(json){
    const MongoClient = require("mongodb").MongoClient;
 
    // создаем объект MongoClient и передаем ему строку подключения
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
        console.log('File DB: ' + json);
        const db = client.db("panaramsbd");
        const collection = db.collection(json.nameCollection);
        collection.insertOne(json, function(err, result){
            
            if(err){ 
                return console.log(err);
            }
            console.log(result.ops);
            client.close();
        });
    });
}
module.exports = pushToDB;
