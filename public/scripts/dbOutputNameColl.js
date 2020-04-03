module.exports.Name = [];

module.exports.outputNameCollections = function(){
    const MongoClient = require("mongodb").MongoClient;
    console.log('db sterted');
    
    // создаем объект MongoClient и передаем ему строку подключения
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
        
        const db = client.db("panaramsbd");
        
        db.listCollections().toArray(function(err, results){
            let names = [];
            results.forEach((item) =>{
                names.push(item.name);
                module.exports.Name = names;
            });

            console.log('DB: '+ module.exports.Name);
            client.close();
           
        });
    });
    
};

