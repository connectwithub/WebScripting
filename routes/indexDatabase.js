const express = require("express");
const router = express.Router();

var dbconnect = require('./../mongodbase/databs');
const dbFind = require('./../mongodbase/dbfind');
/*router.post("/storeMongodb", async function(req, res, next) {
    new dbconnect();
    res.send(req.body)
    await dbstore(req.body.cl, req.body.file);
});*/
router.get("/English/subjectdashboard/getAllChapters", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({chapterLanguage: "English"});
    res.json(dbf);
});
router.get("/English/subjectdashboard/Maths", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Maths", chapterLanguage: "English"});
    res.json(dbf);
});
router.get("/English/subjectdashboard/Science", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Science", chapterLanguage: "English"});
    res.json(dbf);
});
router.get("/English/subjectdashboard/SocialScience", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Social Science", chapterLanguage: "English"});
    res.json(dbf);
});
router.get("/English/subjectdashboard/Hindi", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Hindi"});
    res.json(dbf);
});
router.get("/English/subjectdashboard/English", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "English"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/getAllChapters", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({chapterLanguage: "Hindi"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/Maths", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Maths", chapterLanguage: "Hindi"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/Science", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Science", chapterLanguage: "Hindi"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/SocialScience", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Social Science", chapterLanguage: "Hindi"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/Hindi", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "Hindi"});
    res.json(dbf);
});
router.get("/Hindi/subjectdashboard/English", async function(req, res, next) {
    new dbconnect();
    const dbf= await dbFind({subjectName: "English"});
    res.json(dbf);
});
module.exports = router;
  