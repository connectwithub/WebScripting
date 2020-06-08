const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
const stdown = require("../controller/downn.js");
const upload = require("./../util/upload");
var dbconnect = require('./../mongodbase/databs');
const dbstore = require('./../mongodbase/storeData_db');
const dbFind = require('./../mongodbase/dbfind');

/* GET home page. */
router.get("/getAllChpaters", async function(req, res, next) {
  new dbconnect();
  //console.log("Request path : ", req.originalUrl);
  const result = await getResults();
  res.render("index", result);
  /*await stdown();
  await upload.up();
  await dbstore();*/
});
/*router.get("/api/subjects", async function(req, res, next){
  res.json({class : "10", subjectName: "Maths"});			
  const dbf= await dbFind();
  res.json(dbf);
})*/
module.exports = router;
