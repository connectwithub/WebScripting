const getdata = require('./csvExtract');
const uploadS3 = require('./upload-S3');
const updateName = require('./update-CSVuploadName');
const config = require('./../config/config')
let engchapter_path = ''; //variable to store the path of the file in english(language) to be uploaded
let hindichapter_path = ''; //variable to store the path of the file in hindi(language) to be uploaded
let engchapter_awspath; //variable to store the path of the file in english(language) in AWS S3
let hindichapter_awspath; //variable to store the path of the files in hindi(language) in AWS S3
let currSubject = '';
let eng_part;
let hindi_part;
let low=0;
let high=1;
let uploadedCount = 0; //variable to store the number of files successfully uploaded to AWS S3
let eng_upload_name = []; // array to store the names with which files (in English) are uploaded to AWS S3 
let hindi_upload_name = []; // array to store the names with which files (in Hindi) are uploaded to AWS S3
let s3_Url_english = []; //array to store the Url of the files (in English) uploaded 
let s3_Url_hindi = []; //array to store the Url of the files (in Hindi) uploaded
async function upld(filedata, selClass, csvFilePath){ //function to get the path of the files to be uploaded to AWS S3 and also determine their path in S3
    let promises=[]; //array to store a batch files to be uploaded to AWS S3
	for(let i=low;i<high;i++)
	{
		engchapter_path = '';
		hindichapter_path = '';
		eng_upload_name[i] = undefined;
		hindi_upload_name[i] = undefined;
        if(currSubject!== filedata[i].Subject) //Finding if the Subject has changed  
		{
			chno=1;
			currSubject= filedata[i].Subject; //Making the new subject as the current Subject
			eng_part='';
			hindi_part='';
		}
		if((!filedata[i].English_Link)&&(!filedata[i].Hindi_Link)) //Finding if the Subject has a subpart(unit) or not
		{
			chno=0;
			eng_part= filedata[i].English_Chapter;
            hindi_part= filedata[i].Hindi_Chapter;
		}
		if(filedata[i].English_Link) //Finding if the subject has a link for the English Chapters
		{
			if(filedata[i].English_Chapter_Status=='Downloaded') //Checking if the downloaded status of the English Chapter of the Subject is 'Downloaded' 
			{	
				engchapter_path = `${config.uploadpath.drive}${config.uploadpath.folder}${filedata[i].Subject}/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`; //Finding the path where the file is stored
				if(filedata[i].Subject!='English')
				{
					engchapter_awspath = `${selClass}/${filedata[i].Subject}/English/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`; //Determining the path of the file in AWS S3
				}
				else
				{
					engchapter_awspath = `${selClass}/${filedata[i].Subject}/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`;	//Determining the path of the file in AWS S3 if the subject is English
				}
				promises.push(uploadS3(engchapter_path, engchapter_awspath, chno) //pushing the call to fileupload function in 'upload-S3.js' to the promises array
							.then((val)=>{ 
								uploadedCount++; //incrementing the uploaded files count
								s3_Url_english.push(val[0]);
								eng_upload_name[i] = `${eng_part} ${`chapter${val[1]}`}`;
								console.log(`Total files uploaded - ${uploadedCount}`)
							})
							.catch((err)=>{console.log(err)}));
			}
		}
		if(filedata[i].Hindi_Link) //Finding if the subject has a link for the Hindi Chapters
		{
			if(filedata[i].Hindi_Chapter_Status=='Downloaded')
			{
				hindichapter_path = `${config.uploadpath.drive}${config.uploadpath.folder}${filedata[i].Subject}/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Finding the path where the file is stored
				if(filedata[i].Subject!='Hindi')
				{
					hindichapter_awspath = `${selClass}/${filedata[i].Subject}/Hindi/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Determining the path of the file in AWS S3
				}
				else
				{
					hindichapter_awspath = `${selClass}/${filedata[i].Subject}/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Determining the path of the file in AWS S3 if the subject is Hindi
				}
				promises.push(uploadS3(hindichapter_path, hindichapter_awspath, chno) //pushing the call to upload function in 'upload-S3.js' to promise array
							.then((val)=>{ 
								uploadedCount++; //incrementing the uploaded files count
								s3_Url_hindi.push(val[0]);
								hindi_upload_name[i] = `${hindi_part} ${`chapter${val[1]}`}`;
								console.log(`Total files uploaded - ${uploadedCount}`)
							})
							.catch((err)=>{console.log(err)}));
			}
        }
		chno=chno+1; //incrementing the chapter number
	}
	await Promise.all(promises)
	.then(()=>{ //if all files for a batch are uploaded then calling the 'upld' function to upload the next batch
		low=high;
		high=high+1;
		if(high>filedata.length){
			high=filedata.length;
		}
		if(low<filedata.length){
			return upld(filedata, selClass, csvFilePath);
		}
		else{
			return new Promise((resolve, reject)=>{
				resolve(updateStatus(filedata, eng_upload_name, hindi_upload_name, csvFilePath))
			})
		}		
	})
	.catch((err)=>{ //if any of the file for a batch is not able to upload then calling the 'upld' function to upload the next batch
		low=high;
		high=high+1;
		if(high>filedata.length){
			high=filedata.length;
		}
		if(low<filedata.length){
			return upld(filedata, selClass, csvFilePath);
		}
		else{
			return new Promise((resolve, reject)=>{
				resolve(updateStatus(filedata, eng_upload_name, hindi_upload_name, csvFilePath))
			})
		}	
	});
}
async function up(selClass, csvFilePath){
	const filedata = await getdata(csvFilePath);
	console.log('File upload starting');
	await upld(filedata, selClass, csvFilePath);
	return new Promise((resolve,reject)=>{
		resolve();
	})
}
const updateStatus = async (filedata, eng_upload_name, hindi_upload_name, csvFilePath)=>{ //function that updates the upload names of the files in S3 in the CSV file 
	await updateName(filedata, eng_upload_name, hindi_upload_name, csvFilePath);
	return new Promise((resolve,reject)=>{
		resolve(console.log());
	})
}
module.exports = {
	up,
	s3_Url_english,
	s3_Url_hindi,
};
