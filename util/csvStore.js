const getResults = require("./scraper");
const config = require("./../config/config");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: config.csv.path, //path of the CSV file
	header: [ //heeaders of the CSV file
		{id:'subject', title:'Subject'},
		{id:'eng_chap', title:'English_Chapter'},
		{id:'eng_link',title:'English_Link'},
		{id:'eng_down_status',title:'English_Chapter_Status'},
		{id:'hindi_chap', title:'Hindi_Chapter'},
		{id:'hindi_link', title:'Hindi_Link'},	
		{id:'hindi_down_status',title:'Hindi_Chapter_Status'},
	]	
});
async function storedata(){ //function for storing data in a CSV file
	const result = await getResults();
	const record = []; //array to store values extracted from allSubjects array 
	result.allSubjects.forEach(function(item,index){ //reading allSubjects array and storing the values in record array
		record.push({ subject: item.name,
					eng_chap: item.engch,
					eng_link: item.englk,
					eng_down_status: undefined,
					hindi_chap: item.hindich,
					hindi_link: item.hindilk,
					hindi_down_status: undefined,
		});
	})
	csvWriter.writeRecords(record).then(()=>console.log("CSV Written Succesfully")); //writing to the CSV file
}
module.exports = storedata;
