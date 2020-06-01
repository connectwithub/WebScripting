const mongoose = require("mongoose");
const config = require("./../config/config");
const dbPath = config.mongodb.dbPath;
class dbase{
    constructor(){
        this.connection();
    }
    connection(){
        mongoose.connect(dbPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            console.log("Database connection successfull");
        })
        .catch((err)=>{
            console.log("Error in database connection");
        })
    }
}
module.exports = dbase;
