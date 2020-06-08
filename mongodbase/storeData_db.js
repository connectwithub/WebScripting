const fs = require("fs");
const config = require("./../config/config")
const csv = require('csv-parser');
let SubjectModel = require('./dbschema')
let s3_Url_eng = require('./../util/upload').s3_Url_english;
let s3_Url_hin = require('./../util/upload').s3_Url_hindi;
let i=j=-1;
const dbstore = async (selClass, csvFilePath)=> { //function to store data in the database
    console.log('Storing data in database');
    return new Promise((resolve,reject)=>{
	fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => { //reading data(row) from the CSV file
            if(data.English_Chapter_S3upload_name){
                i++; 
                let retdata = new SubjectModel({
                    class: selClass,
                    subjectName: data.Subject,
                    chapterLanguage: "English",
                    chapterName: data.English_Chapter_S3upload_name,
                    chapterUrl: s3_Url_eng[i],
                });
                retdata.save()
                        .then((doc)=>{
                            console.log(doc); //displaying the document saved in the collection
                        })
                        .catch((err)=>{
                            console.error(err);
                        })
            }
            if(data.Hindi_Chapter_S3upload_name){
                j++;
                let retdata = new SubjectModel({
                    class: selClass,
                    subjectName: data.Subject,
                    chapterLanguage: "Hindi",
                    chapterName: data.Hindi_Chapter_S3upload_name,
                    chapterUrl: s3_Url_hin[j],
                }); 
                retdata.save()
                        .then((doc)=>{ //displaying the document saved in the collection
                            console.log(doc);
                        })
                        .catch((err)=>{
                            console.error(err);
                        })
            }
        })
        .on('end', () => {
            resolve();
        })
        .on('error', (err) => {
            reject(err);
        });
    })
}
module.exports = dbstore;
