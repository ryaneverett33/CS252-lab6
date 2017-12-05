# Dino Dash - All Signals
Signals emitted by the client are denoted with a C. Signals emitted by the server are denoted with a S.
## Match.* signals
1.  Match.findGame C
2. Match.leave C
3. Match.getPlayers C
4. Match.getBoard C
5. Match.foundGame S
6. Match.boardUpdate S
7. Match.playerUpdate S
7. Match.error S
## Player.* signals
1. Player.jump C
2. Player.duck C
3. Player.hit C
4. Player.error S
## Server.* signals
1. Server.startMatch S
2. Server.endMatch S
