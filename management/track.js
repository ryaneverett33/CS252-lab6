var UserGetter = require('../database/getUser.js');

/*
Manages cookies with respect to users;
Will probably also handle matchmaking
*/
//[cookie] = username
var users = {};

function makeCookie() {
    var number;
    do {
        number = Math.floor(Math.random() * 110000000);
    }
    while (number != 0 && users[number] != null);
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
function handleCallback(callback, value) {
    if (callback != null) {
        callback(value);
    }
}
//callback(cookie)
exports.login = function (username, password, callback) {
    console.log("Username %s, password: %s", username, password);
    if (username === null || password === null) {
        console.log("invalid arguments");
        //handleCallback(callback, 0);
        callback(0);
        return;
    }
    else {
        //check if password matches username
        console.log("getting user");
        UserGetter.get(username, function (obj) {
            console.log("== %d, === %d", obj == null, obj === null);
            if (obj === null) {
                console.log("user doesn't exist");
                callback(0);
                return;
            }
            else {
                if (obj.Password !== password || obj.Password != password) {
                    //wrong password
                    console.log("wrong password");
                    //handleCallback(callback, 0);
                    callback(0);
                    return;
                }
                else {
                    var cookie = trackUser(username);
                    console.log("new cookie: ", cookie);
                    callback(cookie);
                    return;
                    //handleCallback(callback, cookie);
                }
            }
        })
    }
}
exports.addUser = function (username, password) {

}