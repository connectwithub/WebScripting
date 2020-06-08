const config = require("./../config/config");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function updateData(result, eng_down_status, hindi_down_status, csvFilePath){ //function for updating data in a CSV file
	console.log(`Update csv ${csvFilePath}`)
	const csvWriter = createCsvWriter({
		path: csvFilePath, //path of the CSV file
		header: [ //heeaders of the CSV file
			{id:'subject', title:'Subject'},
			{id:'eng_chap', title:'English_Chapter'},
			{id:'eng_link',title:'English_Link'},
			{id:'eng_down_status',title:'English_Chapter_Status'},
			{id:'eng_upload_name',title:'English_Chapter_S3upload_name'},
			{id:'hindi_chap', title:'Hindi_Chapter'},
			{id:'hindi_link', title:'Hindi_Link'},	
			{id:'hindi_down_status',title:'Hindi_Chapter_Status'},
			{id:'hindi_upload_name',title:'Hindi_Chapter_S3upload_name'},
		]	
	});
	let i=0;
	const record = []; //array to store updated values with the download status in the CSV file 
	return new Promise((resolve,reject) => {
	result.forEach(function(item,index){ //reading result array and storing the updated values in record array
		record.push({ subject: item.Subject,
					eng_chap: item.English_Chapter,
					eng_link: item.English_Link,
					eng_down_status: eng_down_status[i],
					eng_upload_name: undefined,
					hindi_chap: item.Hindi_Chapter,
					hindi_link: item.Hindi_Link,
					hindi_down_status: hindi_down_status[i],
					hindi_upload_name: undefined,
        });
        i=i+1;
	})
	csvWriter.writeRecords(record).then(()=>{console.log("CSV Updated Succesfully"); //writing to the CSV file
		resolve(record);
	});
	});
}
module.exports = updateData;