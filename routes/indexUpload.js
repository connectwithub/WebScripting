const express = require("express");
const router = express.Router();
const upload = require("./../util/upload");
var dbconnect = require('./../mongodbase/databs');
const dbstore = require('./../mongodbase/storeData_db');

router.post("/AllChapters", async function(req, res, next) {
    //const result = await getResults();
    new dbconnect();
    console.log(req.body);
    //res.send(req.body.file);
    await upload.up(req.body.cl, req.body.file);
    //res.send(req.body)
    await dbstore(req.body.cl, req.body.file);
  });
module.exports = router;
