const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
let dbConnection;
console.log(uri)
module.exports = {
    //Connect to the mongo db
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then(client => {
                dbConnection = client.db()
                return cb()//return callback but don't invoke it
            })
            .catch(err => {
                console.log(err)
                return cb(err)//return callback function and invoke it
            })
    },
    //Interact with the db
    getDb: () => dbConnection
}