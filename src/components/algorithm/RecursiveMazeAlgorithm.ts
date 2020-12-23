let grid: Array<Array<string>> = [];
let mazeDrawOrder: Array<number> = [];

const fillMazeDrawOrder = (row: number, col: number) => {
    const columnCount = grid.length;
    mazeDrawOrder.push(col + row * columnCount);
}

export const generate = (dimensions: number, numDoors: number) => {
    mazeDrawOrder = [];
    grid = new Array();
    for (var i = 0; i < dimensions; i++) {
        grid[i] = new Array();

        for (var j = 0; j < dimensions; j++) {
            grid[i][j] = "";
        }
    }

    addOuterWalls();
    var ent = addEntrance();
    addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);

    return {grid, mazeDrawOrder};
}

function addOuterWalls() {
    for (var i = 0; i < grid.length; i++) {
        if (i == 0 || i == (grid.length - 1)) {
            for (var j = 0; j < grid.length; j++) {
                grid[i][j] = "w";
                fillMazeDrawOrder(i , j);
            }
        } else {
            grid[i][0] = "w";
            grid[i][grid.length - 1] = "w";
            fillMazeDrawOrder(i , 0);
            fillMazeDrawOrder(i , grid.length - 1);
        }
    }
}

function addEntrance() {
    var x = randomNumber(1, grid.length - 1);
    grid[grid.length - 1][x] = "g";
    return x;
}

function addInnerWalls(h: boolean, minX: number, maxX: number, minY: number, maxY: number, gate: number) {
    if (h) {

        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY)/2)*2;
        addHWall(minX, maxX, y);

        addInnerWalls(!h, minX, maxX, minY, y-1, gate);
        addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX)/2)*2;
        addVWall(minY, maxY, x);

        addInnerWalls(!h, minX, x-1, minY, maxY, gate);
        addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
    }
}

function addHWall(minX: number, maxX: number, y: number) {
    var hole = Math.floor(randomNumber(minX, maxX)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) {
            grid[y][i] = ""
        } else {
            grid[y][i] = "w"
            fillMazeDrawOrder(y, i)
        };
    }
}

function addVWall(minY: number, maxY: number, x: number) {
    var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) {
            grid[i][x] = ""
        } else {
            grid[i][x] = "w"
            fillMazeDrawOrder(i, x)
        };
    }
}

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}