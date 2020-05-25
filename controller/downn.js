const storeData = require("../util/csvStore");
const getdata = require("../util/csvExtract");
const downloadPdf = require("../util/downloadPdf");
let extdata;
const stdown = async () =>{ //function that call storedata, getadata and dwonloadPdf functions 
    await storeData();
    extdata = await getdata();
    console.log(extdata); //displaying array containing data extracted from the CSV file
    downloadPdf(extdata);
};
module.exports = stdown;
