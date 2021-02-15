const {Worker,  isMainThread, parentPort, workerData} = require('worker_threads');

const buildPathMap = (cells, adjancecyList, parentPort) => {
        
    let shortestPathMap = new Map();
    console.log(`Running foreach in buildmap...`);

    const totalCells = cells.length;
    let cycle = 0;

    cells.forEach(x => {
        
        let map = new Map();

        //TODO This can be shortened /2. 
        cells.forEach(y => {
           map.set(y.id, getShortestPathToBFS(x, y, adjancecyList));
        });

        shortestPathMap.set(x.id, map);

        cycle++;
        parentPort.postMessage({eventType: "progressStatus", progress: ((cycle/totalCells)*100).toFixed()});
    });
    
    console.log(`End running buildPathMap...`);

    return shortestPathMap;
}

const getShortestPathToBFS = (from, to, adjancecyList) => {
    var visitedMap = [];
    visitedMap.push(from.id);
    var queue = [];
    var fromMap = new Map();
    let found = false;
    let path = [];

    queue.push(from.id);

    while (queue.length != 0 && !found) {
        let currentNode = queue.shift();
        let adjacentNodes = adjancecyList.get(currentNode);

        adjacentNodes.forEach(element => {
            if (!visitedMap.includes(element)) {
                visitedMap.push(element);

                fromMap.set(element, currentNode);
                queue.push(element);
                if (element == to.id) {
                    found = true;
                }
            }
        });

        if (found) {
            let previous = fromMap.get(to.id);

            while (previous != undefined) {
                path.push(previous);
                previous = fromMap.get(previous);
            }
        }
    }

    return path.reverse();
}

if(!isMainThread) {
 console.log(`running worker`);
 const pathMap = buildPathMap(workerData.cells, workerData.adjacencyList, parentPort);

 console.log(`finished building pathmap`);
 parentPort.postMessage(pathMap);
}
 
