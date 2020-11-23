# mazegame

This is an WIP project about a CSS-based labyrinth multiplayer game, built over the MERN stack.

It plays with several math-ish concepts, such as:

- Randomized BFS graph generation algorythm, implemented at the backend.
- BFS pathfinding finding algorythms for the monsters.

On the tech side:
-it's heavily based on socket.io library, which feels blazing fast.


There're some optimizations to be analyzed:
- on the algorithm side, such as pre-compile the maze adjancecy list paths. 
- Check if it's worth it to modify shortest path detection from BFS to A star algorithm
- Modify  the Maze react component so it's not re-rendered every time a movement comes. Only cells should be.
- It would be cool to export some of the heavier algorithms as Node.js/C++ plugins so they can be executed asynchronously 


Features to add eventually:

- some css to the menus
- Score and game count down
- placing random items to be collected
- Collision detection
- Maze styles - open rooms, break long corridors on a randomized way
- At some point it would be cool to replace the whole css thing with p5.js, but, who has the time anyway? :)


#How to run

on frontend folder, npm install, then npm start.
on backend folder, npm install, then npm start

open two different browser screens because as of now there are two players harcoded.

