const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
const getdata = require("../down");

/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getResults();
  res.render("index", result);
});
router.get("/", async function(req, res, next) {
  getdata();
});

module.exports = router;
