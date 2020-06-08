const express = require("express");
const router = express.Router();

var dbconnect = require('./../mongodbase/databs');
const dbFind = require('./../mongodbase/dbfind');
/*router.post("/storeMongodb", async function(req, res, next) {
    new dbconnect();
    res.send(req.body)
    await dbstore(req.body.cl, req.body.file);
});*/
router.get("/getAllChapters", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({});
    res.json(dbf);
});
router.get("/Maths", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Maths"});
    res.json(dbf);
});
router.get("/Science", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Science"});
    res.json(dbf);
});
router.get("/SocialScience", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Social Science"});
    res.json(dbf);
});
router.get("/Hindi", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Hindi"});
    res.json(dbf);
});
router.get("/English", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "English"});
    res.json(dbf);
});
module.exports = router;
  