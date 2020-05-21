const axios = require("axios");
const fs = require("fs");
const Path=require("path");
const getResults = require("./scraper");
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: 'store.csv', //path of the CSV file
	header: [ //heeaders of the CSV file
		{id:'subject', title:'Subject'},
		{id:'eng_chap', title:'English_Chapter'},
		{id:'eng_link',title:'English_Link'},
		{id:'hindi_chap', title:'Hindi_Chapter'},
		{id:'hindi_link', title:'Hindi_Link'}	
	]	
});
let retdata = []; //array to store values extracted from the CSV file
let low=0; //start of a batch of files to be downloaded
let high=10; //end of a batch of files to be downloaded
let complete=0; //variable to store the number of files downloaded 
let chno=0; //variable that stores the chapter number
let currSubject=''; //variable that holds the current Subject whose chapters are being downloaded
let eng_part; //variable to store the English subpart of the Subject
let hindi_part; //variable to store the Hindi subpart of the Subject
async function dwnld (url1,fold,nm) { //function to download the files from the url1 and store them in the specified path	
	const path=Path.resolve(__dirname,`download1\\\\${fold}`,nm);
	const response = await axios({ //initializing axios instance with the url, 'GET' method and stream value for respnseType 
		method: 'GET',
		url: url1,
		responseType: 'stream',
	})
	response.data.pipe(fs.createWriteStream(path)); //piping the read-stream into the Node.js write-stream that points to a file at the specified path
	return new Promise((resolve,reject) => {
		response.data.on('end',() => {
	 		resolve()
		}) 
		response.data.on('error',err => {
	 		reject(err)
		})
	})
};

async function storedata(){ //function for storing data in a CSV file
	const result = await getResults();
	const record = []; //array to store values extracted from allSubjects array 
	result.allSubjects.forEach(function(item,index){ //reading allSubjects array and storing the values in record array
		record.push({ subject: item.name,
					eng_chap: item.engch,
					eng_link: item.englk,
					hindi_chap: item.hindich,
					hindi_link: item.hindilk
		});
	})
	csvWriter.writeRecords(record).then(()=>console.log("CSV Written Succesfully")); //writing to the CSV file
}
	
const getdata = async ()=> { //function to extract data from the CSV file
	await storedata();
	const csv = require('csv-parser');
	fs.createReadStream('store.csv')
	.pipe(csv())
	.on('data', (data)=>{ //reading a row from the CSV file and writing it to the retdata array
		retdata.push(data);
	})
	.on('end', ()=>{
		console.log(retdata); //displaying retdata array 
		console.log('CSV file sucessfully parsed');
		startDownload(); //calling the startDownload function
	})
	.on('error',(err)=>
	{
		reject(err)
	});
}
const startDownload= async () => { //function for downloading files 
	let promises=[]; //array to store a batch of files to be downloaded
	for(let i=low;i<high;i++)
	{
		if(currSubject!==retdata[i].Subject) //Checking if the Subject has changed  
		{
			chno=1;
			currSubject= retdata[i].Subject; //making the new subject as the current Subject
			eng_part='';
			hindi_part='';
		}
		if((!retdata[i].English_Link)&&(!retdata[i].Hindi_Link)) //Checking if the Subject has a subpart or not
		{
			chno=0;
			eng_part=retdata[i].English_Chapter;
			hindi_part=retdata[i].Hindi_Chapter;
		}
		if(retdata[i].English_Link) //Checking if the subject has a link for the English Chapters
		{
			promises.push(dwnld(retdata[i].English_Link, retdata[i].Subject, eng_part+`-Chapter-${chno}(in-English).pdf`));
			complete=complete+1; //incrementing the number of files downloaded
		}
		if(retdata[i].Hindi_Link) //Checking if the subject has a link for the Hindi Chapters
		{
			promises.push(dwnld(retdata[i].Hindi_Link, retdata[i].Subject, hindi_part+`-Chapter-${chno}(in-Hindi).pdf`));
			complete=complete+1; //incrementing the number of files downloaded
		}
		chno=chno+1; //incrementing the chapter number
	}
	Promise.all(promises)
	.then(()=>{ //if all files for a batch are downloaded then displaying the message and calling the startDownload function to download the next batch
		console.log(` ${complete} Chapters Downloads Finsihed`);
		low=high;
		high=high+10;
		if(high>retdata.length)
		{
			high=retdata.length;
		}
		if(low<retdata.length)
		{
			startDownload();
		}
		
	})
	.catch((err)=>{ //if any of the file for a batch is not able to downloaded then displaying the message and calling the startDownload function to download the next batch
		console.log("Error in downloading");
		low=high;
		high=high+10;
		if(high>retdata.length)
		{
			high=retdata.length;
		}
		if(low<retdata.length)
		{
			startDownload();
		}
	});
}	
getdata();
console.log(retdata);
//module.exports = getdata;

