const cheerio = require("cheerio");
const axios = require("axios");
const allSubjects = []; //Array to store all the details about subjects
const siteUrl = "https://byjus.com/ncert-books-for-class-10/";
const fetchData = async () => {
  const result = await axios.get(siteUrl);  //making HTTP request to get the website's content
  return cheerio.load(result.data);  //loading HTML code of the website and returning a Cheerio instance
};
const scrap = async ($,str, subject) => {	
	$(str).each((index,element) => { //extracting data from the table for the subject 'Maths'		
  		let engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject Maths
        let hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject Maths
        let englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject Maths
		let hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject Maths
		if(subject==='Hindi')
		{
			hindichap= $(element).find("td:first-child").text();
			hindilink= $(element).find("td:first-child a").attr('href');
			if(!hindichap)
			{
				hindichap=$(element).find("th:first-child").text();
			}
			engchap= undefined;
			englink= undefined;
		}
		if(!engchap&&!hindichap)
		{
			engchap= $(element).find("th:first-child").text();
			hindichap= $(element).find("th:nth-child(2)").text();
			if(hindichap==='')
			{
				hindichap= undefined;
			}
		}
		else if(!hindichap)
		{
			engchap= $(element).find("td:first-child").text();	
			hindichap = undefined;
		}
		allSubjects.push({name: subject, //Pushing the information about the Maths subject into the allSubjects array
						engch: engchap,
						englk: englink,
						hindich: hindichap,
						hindilk: hindilink
		})
  	});	
}
const subjectArr = ($,str)=>
{
	let w1=$(str).text().indexOf("0");
	let w2=$(str).text().indexOf("Book");
	return $(str).text().substring(w1+2,w2);
}
const getResults = async () => { //function to extract data from website and store it in an array
	const $ = await fetchData();
	let query=$("article div.table-responsive table");
	let start = 2;
	let end = query.length;
	let query2=$("article h3");
	let subarr = [];
	for(let j=0;j<query2.length;j++)
	{
		subarr[j] = subjectArr($,`article h3:nth-of-type(${j+1})`);
	}
	for(let i=start;i<=end;i++)
	{
		await scrap($,`article div.table-responsive:nth-of-type(${i}) table:nth-child(1) tr`, subarr[i-2]);
	}
	return {
		allSubjects
	};
}
//getResults();
module.exports = getResults;
