const SubjectModel = require('./dbschema');
const dbFind  = async (ob) => {
    let query={};
    if(ob.subjectName!=null&&ob.chapterLanguage!=null){
        query={"subjectName": ob.subjectName, "chapterLanguage": ob.chapterLanguage};
    }
    else if(ob.subjectName!=null)
    {
        query={"subjectName" : ob.subjectName};
    }
    else if(ob.chapterLanguage!=null)
    {
        query={"chapterLanguage" : ob.chapterLanguage};
    }
    return new Promise((resolve,reject) => {
            SubjectModel.find(query)
                        .then((doc)=>{
                            console.log(doc);
                            resolve(doc);
                        })
                        .catch((err)=>{
                            console.error(err);
                            reject(err);
                        })
                        
    }); 
}
module.exports = dbFind;