const expect=require('expect');

const {Users}=require('./users');

describe('Users',()=>{
    var users;
    beforeEach(()=>{
        users=new Users();
        users.users=[{
            id:'1',
            name:'Mike',
            room:'room2'
        },{
            id:'2',
            name:'Ben',
            room:'room2'
        },{
            id:'3',
            name:'Joe',
            room:'room45'
        }];
    });

    it('should add new user',()=>{
        var users=new Users();
        var user={
            id:'234',
            name:'user01',
            room:'room45'
        }
        users.addUser(user.id,user.name,user.room);
        expect(users.users[0]).toEqual(user);
    });

    it('should remove a user',()=>{
        var user=users.users[1];
        var removedUser=users.removeUser(user.id);
        expect(removedUser).toEqual(user);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user',()=>{
        var removedUser=users.removeUser(-1);
        expect(removedUser).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find a user',()=>{
        var user=users.users[1];
        var user1=users.getUser(user.id);
        expect(user1).toEqual(user);
        expect(users.users.length).toBe(3);

    });

    it('should not find a user',()=>{
        var user=users.users[1];
        var user1=users.getUser(-2);
        expect(user1).toNotExist();
        expect(users.users.length).toBe(3);

    });

    it('should return names for room2',()=>{
        var usersList=users.getUserList('room2');
        expect(usersList).toEqual(['Mike','Ben']);
    });
    
    it('should return names for room45',()=>{
        var usersList=users.getUserList('room45');
        expect(usersList).toEqual(['Joe']);
    });

});