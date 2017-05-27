const expect=require('expect');

describe('Testing function "messageGenerator"',()=>{
    it('should return a message object',()=>{
        var {messageGenerator}=require('../utils/message.js');
        var from='AdminTest',text='Text of test22';
        var msg=messageGenerator(from,text);
        expect(msg).toInclude({from,text});
        expect(msg.createdAt).toBeA('number');
    })
});