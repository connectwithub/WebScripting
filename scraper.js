const cheerio = require("cheerio");
const axios = require("axios");
const fs=require("fs");
const Path=require("path");

const siteUrl = "https://byjus.com/ncert-books-for-class-10/";

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};


const getResults = async () => {
	const $ = await fetchData();
	const allSubjects = [];
    let count = 0;

    $("article div.table-responsive:nth-of-type(2) table:nth-child(1) tr").each((index,element) => {
  		const engchap= $(element).find("td:first-child").text();
        const hindichap= $(element).find("td:nth-child(2)").text();
        const englink= $(element).find("td:first-child a").attr('href');
		const hindilink= $(element).find("td:nth-child(2) a").attr('href');
		if(engchap)
        {
			allSubjects.push({name: 'Maths',
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
			})
        }
  	}); 
    $("article div.table-responsive:nth-of-type(3) table:nth-child(1) tr").each((index,element) => {
  		const engchap= $(element).find("td:first-child").text();
        const hindichap= $(element).find("td:nth-child(2)").text();
        const englink= $(element).find("td:first-child a").attr('href');
        const hindilink= $(element).find("td:nth-child(2) a").attr('href');
	    if(engchap)
        {
			allSubjects.push({name: 'Science',
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
			})
		}
  	});
    $("article div.table-responsive:nth-of-type(4) table:nth-child(1) tbody tr+tr").each((index,element) => {
  		let engchap= $(element).find("td:first-child").text();
        let hindichap= $(element).find("td:nth-child(2)").text();
        const englink= $(element).find("td:first-child a").attr('href');
		const hindilink= $(element).find("td:nth-child(2) a").attr('href');
        if(!engchap)
        {
			engchap= $(element).find("th:first-child").text();
        	hindichap= $(element).find("th:nth-child(2)").text();
				
		}
		allSubjects.push({name: 'Social Science',
							engch: engchap,
							englk: englink,
							hindich: hindichap,
							hindilk: hindilink
		})
  	}); 
        $("article div.table-responsive:nth-of-type(5) table:nth-child(1) tr").each((index,element) => {
  		let hindichap= $(element).find("td:first-child").text();
        let hindilink= $(element).find("td:first-child a").attr('href');
		if(!hindichap)
        {
			hindichap= $(element).find("th:first-child").text();
			hindilink= $(element).find("th:first-child a").attr('href');
		}
		allSubjects.push({name: 'Hindi',
							engch: undefined,
							englk: undefined,
							hindich: hindichap,
							hindilk: hindilink
		})
  	});  
    $("article div.table-responsive:nth-of-type(6) table:nth-child(1) tr").each((index,element) => {
  	let englishchap= $(element).find("td:first-child").text();
    let englishlink= $(element).find("td:first-child a").attr('href');
	if(!englishchap)
    {
		englishchap= $(element).find("th:first-child").text();
        englishlink= $(element).find("th:first-child a").attr('href');
	}
	allSubjects.push({name: 'English',
						engch: englishchap,
						englk: englishlink,
						hindich: undefined,
						hindilk: undefined
					})
	});
	return {
    		allSubjects: [...allSubjects]
  	}
};
getResults();
module.exports = getResults;
