MVP v1.0 features:

Sam:
* Add simulator observer mode (waits for observer to join) **DONE**
* Player interface updates to display if you've eliminated **DONE**
* Messages list implemented on observers
* Support multiple observers **DONE**
* Fix explosion transparency **DONE**
* Fix player edge collisions **DONE**

Caleb:
* Register Explosions (id: explosion) first, before spawning shrapnal the following turn 
* Fix issues with players disappearing
* Send new messages for the turn in observer status
* Include player color instead of player id in messages
* Send "winner": true in player update, when a player wins


MVP v2.0 features:

* Observer interface updates to display who wins 
* Animate observers

