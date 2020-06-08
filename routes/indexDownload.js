const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
const stdown = require("../controller/downn.js");
router.post("/AllChapters", async function(req, res, next) {
    //const result = await getResults();
    console.log(req.body);
    res.send(req.body.file);
    await stdown(req.body.cl, req.body.file);
  });
module.exports = router;
  