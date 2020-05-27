const getdata = require('./csvExtract');
const uploadS3 = require('./upload-S3');
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
async function upld(filedata){ //function to get the path of the files to be uploaded to AWS S3 and also determine their path in S3
    let promises=[]; //array to store a batch files to be uploaded to AWS S3
	for(let i=low;i<high;i++)
	{
		engchapter_path = '';
        hindichapter_path = '';
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
				engchapter_path = `C:/fnwebscrap/download1/${filedata[i].Subject}/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`; //Finding the path where the file is stored
				if(filedata[i].Subject!='English')
				{
					engchapter_awspath = `Class10/${filedata[i].Subject}/English/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`; //Determining the path of the file in AWS S3
				}
				else
				{
					engchapter_awspath = `Class10/${filedata[i].Subject}/${eng_part}${`-Chapter-${chno}(in-English).pdf`}`;	//Determining the path of the file in AWS S3 if the subject is English
				}
				promises.push(uploadS3(engchapter_path, engchapter_awspath) //pushing the call to fileupload function in 'upload-S3.js' to the promises array
							.then(()=>{ 
								uploadedCount++; 
								console.log(`Total files uploaded - ${uploadedCount}`)
							})
							.catch((err)=>{console.log(err)}));
			}
		}
		if(filedata[i].Hindi_Link) //Finding if the subject has a link for the Hindi Chapters
		{
			if(filedata[i].Hindi_Chapter_Status=='Downloaded')
			{
				hindichapter_path = `C:/fnwebscrap/download1/${filedata[i].Subject}/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Finding the path where the file is stored
				if(filedata[i].Subject!='Hindi')
				{
					hindichapter_awspath = `Class10/${filedata[i].Subject}/Hindi/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Determining the path of the file in AWS S3
				}
				else
				{
					hindichapter_awspath = `Class10/${filedata[i].Subject}/${hindi_part}${`-Chapter-${chno}(in-Hindi).pdf`}`; //Determining the path of the file in AWS S3 if the subject is Hindi
				}
				promises.push(uploadS3(hindichapter_path, hindichapter_awspath) //pushing the call to upload function in 'upload-S3.js' to promise array
							.then(()=>{ 
								uploadedCount++;
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
			upld(filedata);
		}		
	})
	.catch((err)=>{ //if any of the file for a batch is not able to upload then calling the 'upld' function to upload the next batch
		low=high;
		high=high+1;
		if(high>filedata.length){
			high=filedata.length;
		}
		if(low<filedata.length){
			upld(filedata);
		}
	});
}
async function up(){
	const filedata = await getdata();
	console.log('File upload starting');
	upld(filedata);
}
module.exports = up;