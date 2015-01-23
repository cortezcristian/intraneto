// User Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');
var fixtures = require('mongoose-fixtures');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var User, user, user1, user2;

// Unit Tests
describe('Model Test User', function(){
    before(function(){
        // Before all tests
        User = require("../../../models/user.js");
        // Load fixtures
        fixtures.load('../../../fixtures/shared/users.js');
        User.findOne({email:'user@user.com'}, function(err, usr){
            user1 = usr;    
        });

        User.findOne({email:'demo@demo.com'}, function(err, usr){
            user2 = usr;    
        });
    });

    describe('User', function(){
        // It should create a new document in the database
        it('add a user', function(done){
            user = new User({ 
                name: 'user'+Math.floor((Math.random() * 10) + 1),
                password: '123456'
            });
            user.save(done);
        });
        // It should authenticate an user
        it('authenticate an user', function(done){
            assert.ok(user.authenticate('123456'), 'Password should match');
            assert.ok(!user.authenticate('incorrect'), 'Password should not match');
            done();
        });
        // It should open a new chatroom
        it('open a new private chat room', function(done){
            user.openPrivateChat('other-user-id-here', done);
        });
        // It should send a new message
        it('send a new private message', function(done){
            user1.sendPrivateChat(user2._id, "Hi there!", function(err, chatroom){
                //console.log("chatroom", chatroom)
                assert.ok(chatroom.history.length > 0, 'Chatroom history should exist');
                done(); 
            });
        });
        // TODO:
        // Cannot send messages to himself
        // User2 should exist

    });
});
