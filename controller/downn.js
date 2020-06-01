const storeData = require("../util/csvStore");
const getdata = require("../util/csvExtract");
const downloadPdf = require("../util/downloadPdf");
const getResults = require("../util/scraper.js")
let extdata;
let status;
const stdown = async () =>{ //function that calls storedata, getadata and dwonloadPdf functions 
    const result = await getResults();
    await storeData(result);
    extdata = await getdata();
    status  = await downloadPdf(extdata);
    return new Promise((resolve,reject)=>{
        resolve();
    })
};
module.exports = stdown;
