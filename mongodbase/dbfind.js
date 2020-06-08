const SubjectModel = require('./dbschema');
const dbFind  = async (ob) => {
    let query={};
    if(ob.subjectName!=null)
    {
        query={"subjectName" : ob.subjectName};
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