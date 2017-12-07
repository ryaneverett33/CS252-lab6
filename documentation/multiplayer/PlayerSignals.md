# Dino Dash - Player Signals
Signals emitted by the client are denoted with a C. Signals emitted by the server are denoted with a S.
### Player.jump C
#### Request
```json
{
	"roomid" : int,
	"username" : string,
	"action" : "jump"
}
```
Describes a jump that the player just did.

Success: Match.playerUpdate

Error: Player.error
### Player.duck C
#### Request
```json
{
	"roomid" : int,
	"username" : string,
	"action" : "duck"
}
```
Describes a duck that the player just did.

Success: Match.playerUpdate

Error: Player.error
### Player.hit C
#### Request
```json
{
	"roomid" : int,
	"username" : string,
	"action" : "hit"
}
```
Describes a hit that the player just did.

Success: Match.playerUpdate

Error: Player.error
### Player.error S
#### Response
```json
{
	"error" : string,
}
```
Contains an error message from a previous request that failed.
