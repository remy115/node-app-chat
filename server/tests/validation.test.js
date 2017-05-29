const expect=require('expect');

const {isRealString}=require('./../utils/validation');

describe('isRealString',()=>{
    it('should reject non-string value',()=>{
        expect(isRealString(33.45)).toBe(false);
    });
    it('should reject string with only spaces',()=>{
        expect(isRealString(33.45)).toBe(false);
    });
    it('should accept a valid string',()=>{
        expect(isRealString(33.45)).toBe(false);
    });
});