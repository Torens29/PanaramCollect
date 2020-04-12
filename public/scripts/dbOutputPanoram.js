module.exports.panoramsData =  function panoramsData(name){

    console.log('DB name: '+ name);
        
    const MongoClient = require("mongodb").MongoClient;
    
    const url = "mongodb://localhost:27017/";
    const mongoClient = new MongoClient(url, { useNewUrlParser: true });
    
    mongoClient.connect(function(err, client){
        
        const db = client.db("panaramsbd");
        const collection = db.collection(name);
        if(err) return console.log(err);
        
        collection.find().toArray(function(err, results){
            console.log('DBBBBB: ');
            console.log(results[0]);
            client.close();
            module.exports.panoram = results[0];
        });
    });
};