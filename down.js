const axios = require("axios");
const fs = require("fs");
const Path=require("path");
const getResults = require("./scraper");
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: 'store.csv',
	header: [
		{id:'subject', title:'Subject'},
		{id:'eng_chap', title:'English_Chapter'},
		{id:'eng_link',title:'English_Link'},
		{id:'hindi_chap', title:'Hindi_Chapter'},
		{id:'hindi_link', title:'Hindi_Link'}	
	]	
});
let retdata = [];
async function dwnld (url1,fold,nm) {	
	const path=Path.resolve(__dirname,`download1\\\\${fold}`,nm);
	const response = await axios({
		method: 'GET',
		url: url1,
		responseType: 'stream',
	})
	response.data.pipe(fs.createWriteStream(path));
	return new Promise((resolve,reject) => {
		response.data.on('end',() => {
	 		resolve()
		}) 
		response.data.on('error',err => {
	 		reject(err)
		})
	})
};

async function storedata(){
	const result = await getResults();
	const record = []; 
	result.allSubjects.forEach(function(item,index){
		record.push({ subject: item.name,
					eng_chap: item.engch,
					eng_link: item.englk,
					hindi_chap: item.hindich,
					hindi_link: item.hindilk
		});
	})
	csvWriter.writeRecords(record).then(()=>console.log("CSV Written Succesfully"));
}
	
const getdata = async ()=> {
	await storedata();
	const csv = require('csv-parser');
	let count=0;
	let currLang;
	let sscpart;
	fs.createReadStream('store.csv')
	.pipe(csv())
	.on('data', (data)=>{
		retdata.push(data);
	})
	.on('end', ()=>{
		console.log(retdata);
		console.log('CSV file sucessfully parsed');
		startDownload();
	})
	.on('error',(err)=>
	{
		reject(err)
	});
}
let ind=0;
let sub=['Maths','Science','Social Science','Hindi','English'];
let low=0;
let high=10;
let complete=0;
let chno=0;
let currSubject='';
let eng_part;
let hindi_part;
	
const startDownload= async () => {
	let currentSub=sub[ind];
	let splitdata=[];
	let promises=[];
	for(let i=low;i<high;i++)
	{
		if(currSubject!==retdata[i].Subject)
		{
			chno=1;
			currSubject= retdata[i].Subject;
			eng_part='';
			hindi_part='';
		}
		if((!retdata[i].English_Link)&&(!retdata[i].Hindi_Link))
		{
			chno=0;
			eng_part=retdata[i].English_Chapter;
			hindi_part=retdata[i].Hindi_Chapter;
		}
		if(retdata[i].English_Link)
		{
			promises.push(dwnld(retdata[i].English_Link, retdata[i].Subject, eng_part+`-Chapter-${chno}(in-English).pdf`));
			complete=complete+1;
		}
		if(retdata[i].Hindi_Link)
		{
			promises.push(dwnld(retdata[i].Hindi_Link, retdata[i].Subject, hindi_part+`-Chapter-${chno}(in-Hindi).pdf`));
			complete=complete+1;
		}
		chno=chno+1;
	}
	Promise.all(promises)
	.then(()=>{
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
	.catch((err)=>{
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

