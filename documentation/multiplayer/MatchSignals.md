# Dino Dash - Match Signals
Signals emitted by the client are denoted with a C. Signals emitted by the server are denoted with a S.
### Match.findGame C
#### Request
```json
{
	"username" : string,
	"roomid" : int|optional
}
```
This signal adds the user to a match. If the roomid is given (else the field is not included at all), then the server will attempt to join the user to that room. If the room is invalid or already full, then an error will be emitted (see Match.error). If roomid is not given, the server will attempt to join an existing room. On the event there are no empty rooms, a new room will be created and the user will be added to it. On a successful join, Match.foundGame will be emitted.

Success: Match.foundGame

Error: Match.error
### Match.leave C
#### Request
```json
{
	"roomid" : int,
	"username" : string
}
```
Kills the player (username) in match (roomid). If the game is a two person game (which is most likely is), the game will be ended.

Success: Player.dead, Server.endMatch
Error: Player.error
### Match.getPlayers C
TBD
### Match.getBoard C
#### Request
```json
{
	"roomid" : int,
	"distance" : int
}
```
A getBoard request retrieves a buffer of new enemies to be spawned by the client. When a match is first started, called by Server.startMatch, a request is sent with the initial board configuration. The board configuration is only good up to a number of spawns. As such, as the player goes through the game, subsequent calls to getBoard must happen so that the players don't run out of spawns. getBoard is synchronized between all clients.

Success: Match.boardUpdate

Error: Match.error
### Match.foundGame S
#### Response
```json
{
	"roomid" : int
}
```

foundGame is a successful response sent to the client that requests a findGame. Server.startMatch may be called immediately afterwards if the requesting player fills up the room.
### Match.boardUpdate S
#### Response
```json
[
	{
		"id" : int,
		"enemy" : string,
		"spawnTime" : float
	}
]
```
boardUpdate is a successful response sent to the client that requests a getBoard. The response object **is an array**. spawnTime is the amount of time to wait to spawn an enemy (Eg: setInteval(spawn, spawnTime)).
### Match.playerUpdate S
#### Response
```json
{
	"username" : string,
	"action" : "jump|hit|duck"
}
```
When a client sends a Player.jump|duck|hit, the other clients in the room will receive this signal containing an updated state of a player. The player that does the action **does not** get this signal.
### Match.error S
#### Response
```json
{
	"error" : string
}
```
Describes an error that occurred with a previous request.
### Match.players S
#### Response
```json
[
	"username",
]
```
Returns an array of all the players (usernames) in the match.