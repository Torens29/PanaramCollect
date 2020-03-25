let pushToDB = function(json){
    const MongoClient = require("mongodb").MongoClient;
 
    // создаем объект MongoClient и передаем ему строку подключения
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
    
        const db = client.db("panaramsbd");
        const collection = db.collection("panarams");
        //let user = {name: "Tom", age: 23};
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
