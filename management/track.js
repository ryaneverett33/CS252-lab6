var UserGetter = require('../database/getUser.js');
var UserAdder = require('../database/addUser.js');

/*
Manages cookies with respect to users;
Will probably also handle matchmaking
*/
//[cookie] = username
var users = {};
//[username] = roomid
var players = {};

//reserves spots [-10,10] for error results
function makeCookie() {
    var number;
    do {
        number = Math.floor(Math.random() * 110000000);
    }
    while (number <= 10 && number >= -10 && users[number] != null);
    return number;
}
function getUserCookie(username) {
    for (var cookie in users) {
        //for all keys in dictionary
        if (users[cookie] === username) {
            return cookie;
        }
    }
    return 0;
}
//Starts tracking a user in the system
//Returns their cookie
function trackUser(username) {
    //login in to system
    var cookieInUsers = getUserCookie(username);
    if (cookieInUsers == 0) {
        console.log("Not in users");
        //does not exist in dictionary
        var cookie = makeCookie();
        users[cookie] = username;
        return cookie;
    }
    else {
        console.log("in users");
        return cookieInUsers;
    }
}
//Checks users for an existing user
// Returns true if the user exists, false otherwise
function userExists(username) {
    return getUserCookie == 0;
}
//Safely handles callback
function handleCallback(callback, value) {
    if (callback != null) {
        callback(value);
    }
}
//callback(cookie)
exports.login = function (username, password, callback) {
    if (username === null || password === null) {
        console.log("invalid arguments");
        //handleCallback(callback, 0);
        handleCallback(callback, 0);
        return;
    }
    else {
        //check if password matches username
        console.log("getting user");
        UserGetter.get(username, function (obj) {
            console.log("== %d, === %d", obj == null, obj === null);
            if (obj === null) {
                console.log("user doesn't exist");
                handleCallback(callback, 0);
                return;
            }
            else {
                if (obj.Password !== password || obj.Password != password) {
                    //wrong password
                    console.log("wrong password");
                    //handleCallback(callback, 0);
                    handleCallback(callback, 0);
                    return;
                }
                else {
                    var cookie = trackUser(username);
                    console.log("new cookie: ", cookie);
                    handleCallback(callback, cookie);
                    return;
                    //handleCallback(callback, cookie);
                }
            }
        })
    }
}
//returns callback(cookie|errcode)
//errcodes are from [-10,10]
//0 - invalid arguments
//1 - user already exists
//2 - Failed to add user
//3 - shit went south
exports.addUser = function (username, password, callback) {
    if (username === null || password === null) {
        console.log("invalid arguments");
        //handleCallback(callback, 0);
        handleCallback(callback, 0);
        return;
    }
    if (userExists(username)) {
        console.log("user already exists");
        handleCallback(callback, 1);
        return;
    }
    //check if user exists in db before adding
    UserGetter.get(username, function(obj) {
        if (obj == null || obj === null) {
            //user doesn't exist, can add
            //success is boolean
            UserAdder.add(username, password, function(success) {
                if (success) {
                    console.log("Successfully added user in db");
                    var cookie = trackUser(username);
                    if (cookie == 0) {
                        console.log("Failed to start tracking user");
                        handleCallback(callback, 3);
                        return;
                    }
                    else{
                        handleCallback(callback, cookie);
                    }
                }
                else {
                    console.log("Failed to add user in db");
                    handleCallback(callback, 2);
                    return;
                }
            });
        }
        else {
            //user already exists. can't add
            console.log("user already exists in db");
            handleCallback(callback, 1);
            return;
        }
    });
}