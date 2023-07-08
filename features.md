MVP v1.0 features:

Sam:
* Add simulator observer mode (waits for observer to join) **DONE**
* Player interface updates to display if you've eliminated **DONE**
* Messages list implemented on observers **DONE**
* Support multiple observers **DONE**
* Fix explosion transparency **DONE**
* Fix player edge collisions **DONE**
* Add shrapnel on observer **DONE**
* Add update observers with final game state **DONE**
* Fix using dashes in argument names **DONE**
* Add end-game callback **DONE**
* Send "winner": true in player update, when a player wins **DONE**
* Observer interface updates to display who wins **DONE**
* Web socket keep alive **DONE**
* support changing colors **DONE**
* Add support for ai players **DONE**

Caleb:
* Improve AI
* fix duplicate color **DONE**
* Register Explosions (id: explosion) first, before spawning shrapnal the following turn **DONE**
* Fix issues with players disappearing **DONE**
* Send new messages for the turn in observer status **DONE**
* Include player color instead of player id in messages **DONE**


MVP v2.0 features:

Sam:
* Lobby manager
    * Game list backend
    * Lobby front-end
    * Log-in players to get user id
    * Game creater is admin and can start game
    * Game lobby shows players who joined and connection status
* Animate observers

Caleb:
* fix issue where multiple players can have the same color
* Player dies if flies into an explosion
* Player dies if flies directly through the path of a bullet or shrapnel



