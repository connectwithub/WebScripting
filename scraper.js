const cheerio = require("cheerio");
const axios = require("axios");
const fs=require("fs");
const Path=require("path");

const siteUrl = "https://byjus.com/ncert-books-for-class-10/";

const fetchData = async () => {
  const result = await axios.get(siteUrl);  //making HTTP request to get the website's content
  return cheerio.load(result.data);  //loading HTML code of the website and returning a Cheerio instance
};


const getResults = async () => { //function to extract data from website and store it in an array
	const $ = await fetchData();
	const allSubjects = []; //Array to store all the details about subjects
    let count = 0;

    $("article div.table-responsive:nth-of-type(2) table:nth-child(1) tr").each((index,element) => { //extracting data from the table for the subject 'Maths'
  		const engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject Maths
        const hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject Maths
        const englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject Maths
		const hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject Maths
		if(engchap)
        {
			allSubjects.push({name: 'Maths', //Pushing the information about the Maths subject into the allSubjects array
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
			})
        }
  	}); 
    $("article div.table-responsive:nth-of-type(3) table:nth-child(1) tr").each((index,element) => { //extracting data from the table for the subject 'Science'
  		const engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject Science
        const hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject Science
        const englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject Science
        const hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject Science
	    if(engchap)
        {
			allSubjects.push({name: 'Science', //Pushing the information about the Science subject into the allSubjects array 
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
			})
		}
  	});
    $("article div.table-responsive:nth-of-type(4) table:nth-child(1) tbody tr+tr").each((index,element) => { //extracting data from the table for the subject 'Social Science'
  		let engchap= $(element).find("td:first-child").text(); //variable to store Chapters in English for the subject Science
        let hindichap= $(element).find("td:nth-child(2)").text(); //variable to store Chapters in Hindi for the subject Science
        const englink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters in English for the subject Social Science
		const hindilink= $(element).find("td:nth-child(2) a").attr('href'); //variable to store link for Chapters in Hindi for the subject Social Science
        if(!engchap) //checking if the data is a subpart of the subject and storing it
        {
			engchap= $(element).find("th:first-child").text();
        	hindichap= $(element).find("th:nth-child(2)").text();
				
		}
		allSubjects.push({name: 'Social Science', //Pushing the information about the Social Science subject into the allSubjects array
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
		})
  	}); 
        $("article div.table-responsive:nth-of-type(5) table:nth-child(1) tr").each((index,element) => { //extracting data from the table for the subject 'Hindi'
  		let hindichap= $(element).find("td:first-child").text(); //variable to store Chapters for the subject Hindi
        let hindilink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters for the subject Hindi
		if(!hindichap) //checking if the data is a subpart of the subject and storing it
        {
			hindichap= $(element).find("th:first-child").text();
			hindilink= $(element).find("th:first-child a").attr('href');
		}
		allSubjects.push({name: 'Hindi', //Pushing the information about the Hindi subject into the allSubjects array
						engch: undefined,
						englk: undefined,
						hindich: hindichap,
						hindilk: hindilink
		})
  	});  
    $("article div.table-responsive:nth-of-type(6) table:nth-child(1) tr").each((index,element) => { //extracting data from the table for the subject 'English'
  	let englishchap= $(element).find("td:first-child").text(); //variable to store Chapters for the subject English
    let englishlink= $(element).find("td:first-child a").attr('href'); //variable to store link for Chapters for the subject English
	if(!englishchap) //checking if the data is a subpart of the subject and storing it
    {
		englishchap= $(element).find("th:first-child").text();
        englishlink= $(element).find("th:first-child a").attr('href');
	}
	allSubjects.push({name: 'English', //Pushing the information about the English subject into the allSubjects array
					engch: englishchap,
					englk: englishlink,
					hindich: undefined,
					hindilk: undefined
					})
	});
	return {
    		allSubjects: [...allSubjects] //returning allSubjects array
  	}
};
getResults();
module.exports = getResults;
