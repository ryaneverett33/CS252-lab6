var addUser = require("./addUser");
var setUser = require("./setUser");
var getUser = require("./getUser")
var deleteUser = require("./deleteUser");

//table columns: Id, Name, Password, Wins, HighScore, CreateDate (Id is AUTO_INCREMENT, Name is UNIQUE)

//addUser.add("Clint Eastwood", "moo", function() {
//addUser.add("Florence", "im_like_a_city");
//addUser.add("Florance", "lev_dist_of_one");
//setUser.set("Wins", 33, "Ric Flair");
//setUser.set("HighScore", 22, "Ric Flair");
//setUser.set("HighScore", 33, "Ric Flair");
//setUser.set("HighScore", 41, "Ric Flair");
//setUser.set("Wins", 1, "Clint Eastwood");
var u1 = getUser.get("Clint Eastwood");
var u2 = getUser.get("Clint Eastwood");
var u3 = getUser.get("Clarence");
console.log(u1);
console.log(u2);
console.log(u3);
/*
setUser.set("Wins", 1, "Ric Flair");
setUser.set("HighScore", 2, "Ric Flair");
getUser.get("Ric Flair");
deleteUser.delete("Ric Flair");
getUser.get("Ric Flair");*/