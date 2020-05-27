const fs = require("fs");
const AWS  = require("aws-sdk");
const ID = 'AKIAIRTG2A6XYO4RXBIA';
const secret = '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';
const bucket_name = 'subjectresources';
const s3 = new AWS.S3({
    accessKeyId : ID,
    secretAccessKey : secret
});
 const fileupload = async (filepath, filepath_aws) => { //function uploading file from 'filepath' to 'filepath_aws' in AWS S3
     return new Promise((resolve,reject)=>{
     const fileContent = fs.readFileSync(filepath);
     const params = {
         Bucket: bucket_name,
         Key: filepath_aws,
         Body: fileContent 
     };
     console.log(`Starting upload of - ${filepath}`);
     s3.upload(params,function(err, data){
        if(err)
        {
            //throw err
            reject(err)
        }
        else
        {    
            console.log(`File uploaded successfully - to ${filepath_aws} at ${data.Location}`);
            resolve()
        }
     });
     })
 };
 module.exports = fileupload;