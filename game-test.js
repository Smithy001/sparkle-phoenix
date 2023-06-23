const Game = require('./src/game');

/*
Direction = value * 45

0 => 0 // Up
1 => 45
2 => 90 // Right
3 => 135
4 => 180 // Down
5 => 225
6 => 270 // Left
7 => 315
*/

var game = new Game("test");

game.newGame(3);

game.playerJoin('abc')
game.playerJoin('cbd')
game.playerJoin('edg')

game.endTurn('abc', 0, 0)
game.endTurn('cbd', 5, 7)
game.endTurn('edg', 1, 4)

game.endTurn('abc', 0, 0)
game.endTurn('cbd', 5, 7)
game.endTurn('edg', 1, 4)

game.endTurn('abc', 0, 0)
game.endTurn('cbd', 5, 7)
game.endTurn('edg', 1, 4)

// Player abc dies

game.endTurn('cbd', 5, 7)
game.endTurn('edg', 1, 4)

// Player cbd dies

// Player edg wins
