var addUser = require("./addUser");
var setUser = require("./setUser");
var getUser = require("./getUser")
var deleteUser = require("./deleteUser");

//table columns: Id, Name, Password, Wins, HighScore, CreateDate (Id is AUTO_INCREMENT, Name is UNIQUE)

addUser.add("Ric Flair", "Wooo");
addUser.add("Trinidad James", "christianrock");
getUser.get("Ric Flair");
getUser.get("Trinidad James");
setUser.set("Wins", 1, "Ric Flair");
setUser.set("HighScore", 2, "Ric Flair");
getUser.get("Ric Flair");
deleteUser.delete("Ric Flair");
getUser.get("Ric Flair");