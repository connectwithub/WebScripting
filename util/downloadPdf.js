const axios = require("axios");
const fs = require("fs");
const Path = require("path");
const config = require("./../config/config");
const updateData = require("./update-CSVstatus");
let low=0; //variable to store starting index of batch of files for downloading 
let high=5; //variable to store one more than last index of batch of files for downloading
let complete=0; //variable to store the number of files downloaded 
let chno=0; //variable that stores the chapter number
let currSubject=''; //variable that holds the current Subject whose chapters are being downloaded
let eng_part; //variable to store the English subpart of the Subject
let hindi_part; //variable to store the Hindi subpart of the Subject
let common_eng_part;
let common_hindi_part;
let eng_down_status = [];
let hindi_down_status = [];
async function dwnld (url1,subfold,nm) { //function to download the files from the url1 and store them in the specified path		
	const path=Path.join(`${config.downloadpath.drive}${config.downloadpath.folder}\\\\${subfold}`,nm); //path where downloaded PDFs will be stored
	const response = await axios({ //initializing axios instance with the url, 'GET' method and stream value for responseType 
		method: 'GET',
		url: url1,
		responseType: 'stream',
	})
	response.data.pipe(fs.createWriteStream(path)); //piping the read-stream into the Node.js write-stream that points to a file at the specified path		
	return new Promise((resolve,reject) => {
		response.data.on('end',() => {
			complete=complete+1; //incrementing the number of files downloaded
			console.log(`Downloaded : ${subfold}/${nm}`);
			console.log(` ${complete} Chapters Downloaded`);
	 		resolve()
		}) 
		response.data.on('error',(err)=>{
			reject(err)
		})
	})	
};
const stringCheck = async (subunit_part)=>{
	return new Promise((resolve, reject)=>{
		for(let m=0;m<subunit_part.length;m++)
		{
			if(subunit_part.charAt(m)==='/'||subunit_part.charAt(m)==='<'||subunit_part.charAt(m)===':')
			{
				console.log();
            	//eng_part.charAt(m)=' ';
            	subunit_part = subunit_part.substring(0,m);
            }
            //console.log(eng_part.charAt(m))
		}
		console.log("Sub-unit:", subunit_part);
		resolve(subunit_part);
	})
}
const startDownload= async (retdata, csvFilePath) => { //function for downloading files 
	let promises=[]; //array to store a file to be downloaded
	//console.log(csvFilePath);
	for(let i=low;i<high;i++)
	{	
		eng_down_status[i] = undefined;
		hindi_down_status[i] = undefined;
		//if(retdata[i].Subject=="English")
		//{
		if(currSubject!==retdata[i].Subject) //Checking if the Subject has changed  
		{
			chno=1;
			currSubject= retdata[i].Subject; //making the new subject as the current Subject
			eng_part='';
			hindi_part='';
			common_eng_part='';
			common_hindi_part='';
		}
		if((!retdata[i].English_Link)&&(!retdata[i].Hindi_Link)) //Checking if the Subject has a subpart(unit) or not
		{
			if(retdata[i].English_Chapter||retdata[i].Hindi_Chapter)
			{
			chno=0;
			
			retdata[i].English_Chapter = await stringCheck(retdata[i].English_Chapter);
			retdata[i].Hindi_Chapter = await stringCheck(retdata[i].Hindi_Chapter);
			
			if(retdata[i].Subject==='Hindi'){
				/*if(hindi_part==='')
				{
					eng_part=retdata[i].English_Chapter;
					hindi_part=retdata[i].Hindi_Chapter;
					common_eng_part = eng_part;
					common_hindi_part = hindi_part;
					console.log(1);
				}
				else
				{
					eng_part=retdata[i].English_Chapter;
					hindi_part=retdata[i].Hindi_Chapter;
					eng_part = common_eng_part+eng_part;
					hindi_part = common_hindi_part+hindi_part;
					console.log(2);
				}*/
				if((!retdata[i+1].Hindi_Link)&&retdata[i+1].Hindi_Chapter){
					common_eng_part = retdata[i].English_Chapter;
					common_hindi_part = retdata[i].Hindi_Chapter;
				}
				else{
					eng_part=retdata[i].English_Chapter;
					hindi_part=retdata[i].Hindi_Chapter;
					eng_part = `${common_eng_part} ${eng_part}`;
					hindi_part = `${common_hindi_part} ${hindi_part}`;
					console.log(2);
				}
			}
			else{
				eng_part=retdata[i].English_Chapter;
				hindi_part=retdata[i].Hindi_Chapter;
			}
			}
			else{
				chno = chno-1;
			}
		}
		if(retdata[i].English_Chapter==="Prelims"||retdata[i].English_Chapter==="Answers"||retdata[i].English_Chapter==="Brain Teaser"){
			if(retdata[i].English_Link) //Checking if the subject has a link for the English Chapters
			{
				promises.push(dwnld(retdata[i].English_Link, retdata[i].Subject, `${retdata[i].English_Chapter}.pdf`)
					.then(()=>{eng_down_status[i] = "Downloaded"})
					.catch((err)=>{eng_down_status[i] = "Error in Downloading";
					console.log(err.message)}));
					if(retdata[i+1])
					{
						if(!retdata[i+1].English_Link&&retdata[i+1].Hindi_Link){
							chno=0;
						}
					}	
			}
			if(retdata[i].Hindi_Link) //Checking if the subject has a link for the Hindi Chapters
			{
				promises.push(dwnld(retdata[i].Hindi_Link, retdata[i].Subject, `${retdata[i].Hindi_Chapter}.pdf`)
					.then(()=> {hindi_down_status[i] = "Downloaded"})
					.catch((err)=>{hindi_down_status[i] = "Error in Downloading";
					console.log(err.message)}));
			}		
			chno=chno-1;	
		}
		else{
		if(retdata[i].English_Link) //Checking if the subject has a link for the English Chapters
		{
			promises.push(dwnld(retdata[i].English_Link, retdata[i].Subject, eng_part+`-Chapter-${chno}(in-English).pdf`)
					.then(()=>{eng_down_status[i] = "Downloaded"})
					.catch((err)=>{eng_down_status[i] = "Error in Downloading";
					console.log(err.message)}));
					if(retdata[i+1])
					{
					if(!retdata[i+1].English_Link&&retdata[i+1].Hindi_Link){
						chno=0;
					}
					}
		}
		if(retdata[i].Hindi_Link) //Checking if the subject has a link for the Hindi Chapters
		{
			promises.push(dwnld(retdata[i].Hindi_Link, retdata[i].Subject, hindi_part+`-Chapter-${chno}(in-Hindi).pdf`)
					.then(()=> {hindi_down_status[i] = "Downloaded"})
					.catch((err)=>{hindi_down_status[i] = "Error in Downloading";
					console.log(err.message)}));
		}
		}
		chno=chno+1; //incrementing the chapter number
		//}
	}
	await Promise.all(promises)
	.then(()=>{ //if all files for a batch are downloaded then calling the startDownload function to download the next batch
		low=high;
		high=high+5;
		if(high>retdata.length){
			high=retdata.length;
		}
		if(low<retdata.length){
			//console.log(retdata.length);
			//console.log(high);
			//console.log(low);
			/*return new Promise((resolve,reject)=>{ 
				resolve(startDownload(retdata, csvFilePath));
			})*/
			//await startDownload(retdata,csvFilePath);
			return startDownload(retdata, csvFilePath);
		}
		else{
			//console.log(csvFilePath);
			console.log('Calling updateCSV from then')
			return new Promise((resolve, reject)=>{
				resolve(updateStatus(retdata, eng_down_status, hindi_down_status, csvFilePath))
			})
		}		
	})
	.catch((err)=>{ //if any of the file for a batch is not able to download then calling the startDownload function to download the next batch
		low=high;
		high=high+5;
		if(high>retdata.length){
			high=retdata.length;
		}
		if(low<retdata.length){
			console.log(1);
			/*return new Promise((resolve,reject)=>{ 
				resolve(startDownload(retdata, csvFilePath));
			})*/
			return resolve(startDownload(retdata, csvFilePath));
		}
		else{
			console.log(err);
			return new Promise((resolve, reject)=>{
				resolve(updateStatus(retdata, eng_down_status, hindi_down_status, csvFilePath))
			})
		}
	});
}
const updateStatus = async (retdata, eng_down_status, hindi_down_status, csvFilePath)=>{
	//console.log(csvFilePath);
	await updateData(retdata, eng_down_status, hindi_down_status, csvFilePath);
	return new Promise((resolve,reject)=>{
		resolve(console.log());
	})
}
module.exports = startDownload;