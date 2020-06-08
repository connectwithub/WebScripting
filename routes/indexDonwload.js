const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
const stdown = require("../controller/downn.js");
router.post("/AllChapters", async function(req, res, next) {
    //const result = await getResults();
    res.json({"Class": req.body.cl});
    await stdown();
  });
module.exports = router;
  