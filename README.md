# mazegame

This is an WIP project about a CSS-based labyrinth multiplayer game, built over the MERN stack. I would catalog this as some javascript algorithm/websocket experiment. 

It plays with several math-ish concepts, such as:

- Randomized BFS graph generation algorythm, implemented at the backend.
- BFS pathfinding finding algorythm for the monsters.

On the tech side:
-Front is React 16, hooks everywhere!
-Back is Node.js with Express. I played too with process workers to perform heavy cpu operations such as the shortest path maps.
-it's heavily based on socket.io library, which feels blazing fast.

There're some optimizations to be analyzed:
- on the algorithm side, such as pre-compile the maze adjancecy list paths. 
- Check if it's worth it to modify shortest path detection from BFS to A star algorithm
- Modify  the Maze react component so it's not re-rendered every time a movement comes. Only cells should be.
- It would be cool to export some of the heavier algorithms as Node.js/C++ plugins so they can be executed asynchronously 
- it's pointless to rerender the whole labyrinth on each socket update from the server, so manipulation through useRef hook could be useful.

Features to add eventually:

- some css to the menus.
- Styling the players with animated css or emojis.
- Player score - DONE
- Countdown 
- placing random items to be collected - DONE, currently a sheep is placed.
- Collision detection - DONE
- Currently it's fairly unplayable, the long corridors means that you have no escape from the monsters. Some modifications to the maze random generator should be added to break some walls.


#How to run

on frontend folder, npm install, then npm start.
on backend folder, npm install, then npm start

open two different browser screens because as of now there are two players harcoded.

