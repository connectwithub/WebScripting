const cheerio = require("cheerio");
const axios = require("axios");

const siteUrl = "https://byjus.com/ncert-books-for-class-10/";

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const getResults = async () => {
	const $ = await fetchData();
        const mathsEnglish = [];
        const mathsHindi = [];
        const scienceEnglish = [];
        const scienceHindi = [];
        const socialscEnglish = [];
        const socialscHindi= [];
        const hindi = [];
	const english = [];
        let count = 0;
        $("article div.table-responsive:nth-of-type(2) table:nth-child(1) tr").each((index,element) => {
  		const engchap= $(element).find("td:first-child").text();
        	const hindichap= $(element).find("td:nth-child(2)").text();
        	const englink= $(element).find("td:first-child a").attr('href');
        	const hindilink= $(element).find("td:nth-child(2) a").attr('href');
        	if(engchap)
        	{
        		mathsEnglish.push({engch: engchap,
        		englk: englink});
        		mathsHindi.push({hindich: hindichap,
        		hindilk: hindilink});
        	}
  	}); 
	console.log(Array.isArray(mathsEnglish));
        $("article div.table-responsive:nth-of-type(3) table:nth-child(1) tr").each((index,element) => {
  		const engchap= $(element).find("td:first-child").text();
        	const hindichap= $(element).find("td:nth-child(2)").text();
        	const englink= $(element).find("td:first-child a").attr('href');
        	const hindilink= $(element).find("td:nth-child(2) a").attr('href');
        	if(engchap)
        	{
        		scienceEnglish.push({engch: engchap,
        		englk: englink});
        		scienceHindi.push({hindich: hindichap,
        		hindilk: hindilink});
        	}
  	});
        $("article div.table-responsive:nth-of-type(4) table:nth-child(1) tbody tr+tr").each((index,element) => {
  		const engchap= $(element).find("td:first-child").text();
        	const hindichap= $(element).find("td:nth-child(2)").text();
        	const englink= $(element).find("td:first-child a").attr('href');
        	const hindilink= $(element).find("td:nth-child(2) a").attr('href');
        	if(engchap)
        	{
        		socialscEnglish.push({engch: engchap,
        		englk: englink});
        		socialscHindi.push({hindich: hindichap,
        		hindilk: hindilink});
        	}
		else
		{
			const engchap= $(element).find("th:first-child").text();
        		const hindichap= $(element).find("th:nth-child(2)").text();
        		socialscEnglish.push({engch: engchap,
        		englk: englink});
        		socialscHindi.push({hindich: hindichap,
        		hindilk: hindilink});
			

		}
  	}); 
        $("article div.table-responsive:nth-of-type(5) table:nth-child(1) tr").each((index,element) => {
  		const hindichap= $(element).find("td:first-child").text();
        	const hindilink= $(element).find("td:first-child a").attr('href');
		console.log(hindilink);
        	if(hindichap)
        	{
        		hindi.push({hindich: hindichap,
        		hindilk: hindilink});
        	}
		else
		{
			const hindichap= $(element).find("th:first-child").text();
        		const hindilink= $(element).find("th:first-child a").attr('href');
                        hindi.push({hindich: hindichap,
     			hindilk: hindilink});
		}
  	});  
        $("article div.table-responsive:nth-of-type(6) table:nth-child(1) tr").each((index,element) => {
  		const englishchap= $(element).find("td:first-child").text();
        	const englishlink= $(element).find("td:first-child a").attr('href');
        	if(englishchap)
        	{
        		english.push({englishch: englishchap,
        		englishlk: englishlink});
        	}
		else
		{
			const englishchap= $(element).find("th:first-child").text();
        		const englishlink= $(element).find("th:first-child a").attr('href');
                        english.push({englishch: englishchap,
     			englishlk: englishlink});
		}
  	});
  	return {
    		mathEnglish: [...mathsEnglish],
    		mathHindi: [...mathsHindi],
                scienceEnglish: [...scienceEnglish],
    		scienceHindi: [...scienceHindi],
                socialscEnglish: [...socialscEnglish],
    		socialscHindi: [...socialscHindi],
                english: [...english],
    		hindi: [...hindi],
  	}
};

module.exports = getResults;
