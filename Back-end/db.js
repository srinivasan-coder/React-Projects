const mongodb =  require('mongodb');
const Mongoclient = mongodb.MongoClient;

let database;

async function getDatabse(){
    const client = await Mongoclient.connect('mongodb://127.0.0.1:27017');
    database = client.db('sample');

    if(!database){
        console.log("Database not connected");
    }

    return database;
}


module.exports = {
    getDatabse
}