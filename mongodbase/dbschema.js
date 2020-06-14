let mongoose = require('mongoose')
let subjectSchema = new mongoose.Schema({
  class:String,
  subjectName: String,
  chapterLanguage: String,
  chapterName: String,
  chapterUrl: String,
})
module.exports = mongoose.model('cbsesubjects9', subjectSchema)