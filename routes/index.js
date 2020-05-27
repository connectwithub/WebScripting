const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
const stdown = require("../controller/downn.js");
const upload = require("./../util/upload");
/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getResults();
  res.render("index", result);
  await stdown();
  await upload();
  //await upload();
});
/*router.get("/upload", async function(req, res, next){
  console.log("Upload")
})*/
module.exports = router;
