const fs = require("fs");
const AWS  = require("aws-sdk");
const ID = '';
const secret = '';
const bucket_name = 'CLASS_10_BOOKS';
const s3 = new AWS.S3({
    accessKeyId : ID,
    secretAccessKey : secret
})
const params = {
    Bucket : bucket_name,
    CreateBucketConfiguration : {
        LocationConstraint: ""
    } 
};
s3.createBucket(params,function(err, data){
    if(err)
    {
        console.log(err, err.stack);
    }
    else
    {
        console.log('Bucket created successfully', data.location);
    }
})
