# Dino Dash Multiplayer 
This readme contains information related to how multiplayer/matchmaking is implemented and how to interact with it.
## Socket.io Signals
 ### Socket operations
 Connect and Disconnect are supported as default. Connect does not automatically start matchmaking, but disconnect ends all possible option for matchmaking
 ### Player operations
 #### Player.jump, duck, hit
 Registers a jump/duck/hit from a player, the other player will be updated of the operation. 

Returns: TBD
 #### Board.get
 Retrieves the next state of the board so that each player has  an identical copy of the board. Board.get should be called  until the game ends. This returns a buffer of enemies to be spawned by the client. It only needs to be called when the player is close to the end of the buffer.
 
Returns: TBD
#### Match.start, leave, getPlayers
Start

Starts the matchmaking process and finds another player to join the match. 

Returns: 
```json
{ "matchid" : "string(4 letters)" }
```
The matchid can allow anybody to join the game with the given code or just wait for an automatic match to happen.

Leave

This allows the player to forfeit the match and leave the current game. The other player automatically wins the game and a Server.endMatch signal is generated for both players.

getPlayers

Returns the username for both players. This can be used to get more information about an opponent or just display the name during the match.

#### Server.startMatch and endMatch
These signals are emitted by the Server and can only be consumed by the clients. 

startMatch 

Signals the start of the match and returns the very beginning of the board.

Returns: Same as Board.get

endMatch

Signals the end of a match, whether by forfeit or legitimate result.

Returns:

```json
{
 "winner" : "username",
 "scores" : {
	"username1" : "int",
	"username2" : "int"}
}
```
