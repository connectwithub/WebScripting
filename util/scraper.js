const cheerio = require("cheerio");
const axios = require("axios");
const config = require("./../config/config")
let allSubjects; //Array to store all the details about subjects
const siteUrl = config.scrap.siteurl;
let extraChapters = [];
const fetchData = async () => {
	allSubjects = [];
	const result = await axios.get(siteUrl);  //making HTTP request to get the website's content
  	return cheerio.load(result.data);  //loading HTML code of the website and returning a Cheerio instance
};
const storeExtra = async(extraChap)=>{//function to store data(in the second column) of subjects containing data in two columns
	console.log(extraChap);
	for(let i=0;i<extraChap.length;i++)
	{
		allSubjects.push({name: extraChap[i].name, //Pushing the information about the subject into the allSubjects array
						engch: extraChap[i].engch,
						englk: extraChap[i].englk,
						hindich: extraChap[i].hindich,
						hindilk: extraChap[i].hindilk
						});
	}
}
const scrap = async ($,str, subject) => { //function to extract data from the tables with download links for each subject
	extraChapters = []; 
	return new Promise((resolve, reject) =>{	
	$(str).each((index,element) => { //extracting data from the table for each subject 	
  		let engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject 
        let hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject 
        let englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject
		let hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject
		
		if(subject==='Hindi')//Checking if the subject is Hindi 
		{
			hindichap= $(element).find("td:first-child").text();
			hindilink= $(element).find("td:first-child a").attr('href');
			if(!hindichap) //Checking if the variable hindichap contains the sub-units for Hindi subject 
			{
				hindichap=$(element).find("th:first-child").text();
			}
			engchap= undefined;
			englink= undefined;

			if($(element).find("td:nth-child(2)"))
			{
				let extraHindiChapters = $(element).find("td:nth-child(2)").text();
				let extraHindiLink = $(element).find("td:nth-child(2) a").attr('href');
				if(!extraHindiChapters) //Checking if the variable hindichap contains the sub-units for Hindi subject 
				{
					extraHindiChapters=$(element).find("th:nth-child(2)").text();
				}
				let extraEngChap= undefined;
				let extraEngLink= undefined;
				console.log(extraHindiChapters);
				console.log(extraHindiLink);
				if(extraHindiChapters!=="Chapters PDF in Hindi"&&extraHindiChapters!=='') //Removing heading like 'Chapters PDF in English' and 'Chapters PDF in Hindi'
				{
					extraChapters.push({name: subject, //Pushing the information about the subject into the allSubjects array
										engch: extraEngChap,
										englk: extraEngLink,
										hindich: extraHindiChapters,
										hindilk: extraHindiLink
					})
				}	
			}

		}
		else if(subject==="English"){

			engchap= $(element).find("td:first-child").text();
			englink= $(element).find("td:first-child a").attr('href');
			if(!engchap) //Checking if the variable hindichap contains the sub-units for Hindi subject 
			{
				engchap=$(element).find("th:first-child").text();
			}
			hindichap= undefined;
			hindilink= undefined;

			if($(element).find("td:nth-child(2)"))
			{
				let extraEngChapters = $(element).find("td:nth-child(2)").text();
				let extraEngLink = $(element).find("td:nth-child(2) a").attr('href');
				if(!extraEngChapters) //Checking if the variable hindichap contains the sub-units for Hindi subject 
				{
					extraEngChapters=$(element).find("th:nth-child(2)").text();
				}
				let extraHindiChapters= undefined;
				let extraHindiLink= undefined;
				console.log(extraEngChapters);
				console.log(extraEngLink);
				if(extraEngChapters!=="Chapters PDF in Hindi"&&extraEngChapters!=='') //Removing heading like 'Chapters PDF in English' and 'Chapters PDF in Hindi'
				{
						extraChapters.push({name: subject, //Pushing the information about the subject into the allSubjects array
											engch: extraEngChapters,
											englk: extraEngLink,
											hindich: extraHindiChapters,
											hindilk: extraHindiLink
									})
				}	
			}
		}
		else if(!engchap&&!hindichap) //Checking if both engchap and hindichap are undefined and if so then storing the sub-units in them
		{
			engchap= $(element).find("th:first-child").text();
			hindichap= $(element).find("th:nth-child(2)").text();
			if(hindichap==='')
			{
				hindichap= undefined;
			}
		}
		/*else if(!hindichap) //Checking if only the hindichap in undefined
		{
			engchap= $(element).find("td:first-child").text();	
			hindichap = undefined;
		}*/
		
		if(engchap!==" Chapters PDF in English"&&engchap!=="Chapters PDF in English"&&hindichap!=="Chapters PDF in Hindi") //Removing heading like 'Chapters PDF in English' and 'Chapters PDF in Hindi'
		{
			allSubjects.push({name: subject, //Pushing the information about the subject into the allSubjects array
						engch: engchap,
						englk: englink,
						hindich: hindichap,
						hindilk: hindilink
		})
		}
	});
	storeExtra(extraChapters);
	resolve();
	})  	
}
const getResults = async (selClass, tableStart, subjectArray) => { //function to extract data from website and store it in an array
	const $ = await fetchData();
	let query=$("article div.table-responsive table");
	let start = tableStart;
	let end = query.length;
	let query2=$("article h3");
	let subarr = subjectArray;//array to store all the subjects
	console.log(end);
	console.log(query2.length);
	console.log($("article h3:nth-of-type(1)").text());
	console.log(subarr);
	
	for(let i=start;i<end;i++) //calling the function scrap for the table with links for each subject
	{
		await scrap($,`article div.table-responsive:nth-of-type(${i+1}) table:nth-child(1) tr`, subarr[i-start]); 
	}
	return {
		allSubjects //returning the all allSubjects array
	};
}
module.exports = getResults;
