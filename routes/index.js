const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
const stdown = require("../controller/downn.js");
const upload = require("./../util/upload");
var dbconnect = require('./../mongodbase/databs');
const dbstore = require('./../mongodbase/storeData_db');
/* GET home page. */
router.get("/", async function(req, res, next) {
  new dbconnect();
  console.log("Request path : ", req.originalUrl);
  const result = await getResults();
  res.render("index", result);
  await stdown();
  await upload.up();
  await dbstore();
});
module.exports = router;
