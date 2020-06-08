const storeData = require("../util/csvStore");
const getdata = require("../util/csvExtract");
const downloadPdf = require("../util/downloadPdf");
const getResults = require("../util/scraper.js")
let extdata;
let status;
const stdown = async (selClass, csvFilePath) =>{ //function that calls storedata, getadata and dwonloadPdf functions 
    const result = await getResults(selClass);
    await storeData(result, csvFilePath);
    extdata = await getdata(csvFilePath);
    //console.log(csvFilePath);
    status  = await downloadPdf(extdata, csvFilePath);
    return new Promise((resolve,reject)=>{
        resolve();
    })
};
module.exports = stdown;
