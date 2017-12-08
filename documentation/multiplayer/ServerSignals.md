# Dino Dash - Server Signals
Signals emitted by the client are denoted with a C. Signals emitted by the server are denoted with a S.
## **Responses/Requests are not in json, they're the actual object**
### Server.startMatch S
#### Response
```json
{
	"roomid" : int,
	"playerCount" : int,
	"players" : [
		"username",
	]
}
```
Describe the match that just started with enough information for clients to start. Players **is an array**.
### Server.endMatch S
#### Response
```json
{
	"winner" : username
}
```
Describes the match that just finished, returns who the winner was.