const storeData = require("../util/csvStore");
const getdata = require("../util/csvExtract");
const downloadPdf = require("../util/downloadPdf");
let extdata;
let status;
const stdown = async () =>{ //function that calls storedata, getadata and dwonloadPdf functions 
    
    await storeData();
    extdata = await getdata();
    status  = await downloadPdf(extdata);
    return new Promise((resolve,reject)=>{
        resolve();
    })
};
/*const stupload = async () => {

}*/
module.exports = stdown;
