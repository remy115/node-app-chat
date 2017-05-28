const moment=require('moment');
var messageGenerator=(from,text)=>{
    return {
        from,
        text,
        createdAt:moment().valueOf()
    }
}

module.exports={messageGenerator};