
const mysql = require('serverless-mysql');

const db = mysql({
    config:{
        host:process.env.root,
        database:process.env.wikipediaGolf,
        user:process.env.root,
        password:process.env.Haruchan_007
    }
})
exports.query = async query =>{
    try{
        const results = await db.query(query);
        await db.end()
        return results;
    }catch(error){
        return{error}
    }
}