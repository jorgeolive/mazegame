# mazegame

This is an WIP project about a CSS-based labyrinth multiplayer game, built over the MERN stack.

It plays with several math-ish concepts, such as:

- Randomized BFS graph generation algorythm, implemented at the backend.
- Optimized shortest path finding algorythms for the monsters. TODO

There're some optimizations to be analyzed:
*on the algorithm side, such as pre-compile the maze adjancecy list paths. 
*on the Maze react component so it's not re-rendered every time a movement comes. Only cells should be.

On the tech side, obviously it's heavily based on socket.io library, which feels blazing fast.

Features to add eventually:

- some css to the menus *PLEASE!
- Score and game count down
- placing random items to be collected
- Collision detection
- At some point it would be cool to replace the whole css thing with p5.js, but, who has the time anyway? :)


#How to run

on frontend folder, npm install, then npm start.
on backend folder, npm install, then npm start

open two different browser screens because as of now there are two players harcoded.

