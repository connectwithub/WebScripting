const fs = require("fs");
const config = require("./../config/config")
const csv = require('csv-parser'); 
const getdata = async (csvFilePath)=> { //function to extract data from the CSV file
    let retdata = []; //array to store data extracted from the CSV file
    return new Promise((resolve,reject)=>{
	fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            console.log(data);
            retdata.push(data);
        })
        .on('end', () => {
            console.log('CSV file sucessfully parsed');
            resolve(retdata);
        })
        .on('error', (err) => {
            reject(err);
        });
    })
}
module.exports = getdata;
