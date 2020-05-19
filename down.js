const axios = require("axios");
const fs = require("fs");
const Path=require("path");
const getResults = require("./scraper");
const createCsvWriter=require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: 'store.csv',
	header: [
		{id:'subject', title:'Subject'},
		{id:'lang', title:'Language'},
		{id:'chapter', title:'Chapter_Name'},
		{id:'link', title:'Download_Link'}
	
	]
	
});
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
	result.mathEnglish.forEach(function(item,index) {
		record.push({subject: 'Maths',
				 lang: 'English',
				 chapter: item.engch,
				 link: item.englk	
		});
	})
	result.mathHindi.forEach(function(item,index) {
		record.push({subject: 'Maths',
				 lang: 'Hindi',
				 chapter: item.hindich,
				 link: item.hindilk	
		});
	})
	result.scienceEnglish.forEach(function(item,index) {
		record.push({subject: 'Science',
				 lang: 'English',
				 chapter: item.engch,
				 link: item.englk	
		});
	})
	result.scienceHindi.forEach(function(item,index) {
		record.push({subject: 'Science',
				 lang: 'Hindi',
				 chapter: item.hindich,
				 link: item.hindilk	
		});
	})
	result.socialscEnglish.forEach(function(item,index) {
		record.push({subject: 'Social Science',
					 lang: 'English',
					 chapter: item.engch,
					 link: item.englk	
		});
	})
	result.socialscHindi.forEach(function(item,index) {
		record.push({subject: 'Social Science',
					 lang: 'Hindi',
					 chapter: item.hindich,
					 link: item.hindilk	
		});
	})
	result.english.forEach(function(item,index) {
		record.push({subject: 'English',
					 lang: 'English',
					 chapter: item.englishch,
					 link: item.englishlk	
		});
	})
	result.hindi.forEach(function(item,index) {
		record.push({subject: 'Hindi',
					 lang: 'Hindi',
					 chapter: item.hindich,
					 link: item.hindilk	
		});
	})	
	csvWriter.writeRecords(record).then(()=>console.log("CSV Written Succesfully"));
}
async function getdata()
{
	await storedata();
	const csv = require('csv-parser');
	let count=0;
	let currLang;
	let sscpart;
	fs.createReadStream('store.csv')
	.pipe(csv())
	.on('data', (data)=>{
		
		let str = data.Subject;
		if(str=='Maths')
		{
			if(currLang!=data.Language)
			{
				currLang=data.Language;
				count=0;
			}
			str = str + '(Language-'+data.Language+')';
			count=count+1;
			let d = dwnld(data.Download_Link, 'Maths', str+'-Chapter'+count+'.pdf');
			d.then(()=>{
				console.log('download finished');
			})
			.catch(()=>{
				console.log(`Error in download Maths chapter ${count}`)
			});
			console.log(str);
		}
		else if(str=='Science')
		{
			if(currLang!=data.Language)
			{
				currLang=data.Language;
				count=0;
			}
			str = str + '(Language-'+data.Language+')';
			count=count+1;
			let d= dwnld(data.Download_Link, 'Science', str+'-Chapter'+count+'.pdf');
			d.then(()=>{
				console.log('download finished');
			})
			.catch(()=>{
				console.log(`Error in download Science chapter ${count}`)
			});
			console.log(str);
		}
		else if(str=='English')
		{
			if(currLang!=data.Language)
			{
				currLang=data.Language;
				count=0;
			}
			if(!data.Download_Link)
			{
				sscpart='-'+data.Chapter_Name;
				console.log(data.Chapter_Name);
				count=0;
			}
			else
			{
				str = str + sscpart + '(Language-'+data.Language+')';
				count=count+1;
				let d = dwnld(data.Download_Link, 'English', str+'-Chapter'+count+'.pdf');
				d.then(()=>{
					console.log('download finished');
				})
				.catch(()=>{
					console.log(`Error in download English chapter ${count}`)
				});
				console.log(str);
			}		
		}
		else if(str=='Hindi')
		{
			if(currLang!=data.Language)
			{				
				currLang=data.Language;
				count=0;
			}
			if(!data.Download_Link)
			{
				sscpart='-'+data.Chapter_Name;
				console.log(data.Chapter_Name);
				count=0;
			}
			else
			{
				str = str + sscpart + '(Language-'+data.Language+')';
				count=count+1;
				let d = dwnld(data.Download_Link, 'Hindi', str+'-Chapter'+count+'.pdf');
				d.then(()=>{
					console.log('download finished');
				})
				.catch(()=>{
					console.log(`Error in download Hindi chapter ${count}`)
				});
				console.log(str);
			}
		}
		else
		{
			if(currLang!=data.Language)
			{
				currLang=data.Language;
				count=0;
			}
			if(!data.Download_Link)
			{
				sscpart='-'+data.Chapter_Name;
				console.log(data.Chapter_Name);
				count=0;
			}
			else
			{
				str = str + sscpart + '(Language-'+data.Language+')';
				count=count+1;
				let d = dwnld(data.Download_Link, 'Social science', str+'-Chapter'+count+'.pdf');
				d.then(()=>{
					console.log('download finished');
				})
				.catch(()=>{
					console.log(`Error in download Social Science chapter ${count}`)
				});
				console.log(str);
			}

		}
		
	})
	.on('end', ()=>{
		console.log('CSV file sucessfully parsed');
	})
	.on('error',(err)=>
	{
		reject(err)
	});

}
getdata();

