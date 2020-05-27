const fs = require("fs");
const config = require("./../config/config")
const csv = require('csv-parser');
let retdata = []; //array to store data extracted from the CSV file 
const getdata = async ()=> { //function to extract data from the CSV file
    return new Promise((resolve,reject)=>{
	fs.createReadStream(config.csv.path)
        .pipe(csv())
        .on('data', (data) => {
            retdata.push(data);
        })
        .on('end', () => {
            //console.log(retdata);
            console.log('CSV file sucessfully parsed');
            resolve(retdata);
        })
        .on('error', (err) => {
            reject(err);
        });
    })
}
module.exports = getdata;
