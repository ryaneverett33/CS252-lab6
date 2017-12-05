# Dino Dash Multiplayer Documentation
Contents
1. All Signals 
2. Match Signals
3. Player Signals
4. Server Signals
5. Currently Implemented

### How it works
A client emits signals to the server, the server responds by emitting signals to the client or multiple clients. Some signals may only be emitted by the server and some signals will only be emitted by the client. Non-supported signals that are emitted will not be handled and no response will be given for those signals. Emitted signals will be responded to with a different signal. A client may emit a `Match.findGame` signal and have a `Match.foundGame` signal be emitted to them. These response signals will be documented alongside the request signals.

### Game Setup
The basic setup for a multiplayer game is:
1. Find Game
2. Initialize board from server
3. Play game, while emitting player actions to the server
4. Update board whenever the buffer is close to the end
5. End game if a player hits an enemy
