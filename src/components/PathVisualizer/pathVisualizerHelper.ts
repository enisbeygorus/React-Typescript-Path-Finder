import { NodeType } from "../Node/Node";

export const initNodeObject = (
  row: number,
  column: number,
  columnCount: number,
  startNodeId: number,
  finishNodeId: number
) => {
  return {
    col: column,
    row: row,
    isStart: column + row * columnCount === startNodeId ? true : false,
    isFinish: column + row * columnCount === finishNodeId ? true : false,
    isRoad: false,
    isWall: false,
    id: coordinateToId(row, column, columnCount),
    wait: 0,
    isSearched: false,
  };
};

export const initColumns = (
  row: number,
  columnCount: number,
  startNodeId: number,
  finishNodeId: number
) => {
  const rowArr = [];
  for (let column = 0; column < columnCount; column++) {
    rowArr.push(
      initNodeObject(row, column, columnCount, startNodeId, finishNodeId)
    );
  }
  return rowArr;
};

export const initMatrix = (
  rowCount: number,
  columnCount: number,
  startNodeId: number,
  finishNodeId: number
) => {
  const nodes = [];
  for (let i = 0; i < rowCount; i++) {
    const row = initColumns(i, columnCount, startNodeId, finishNodeId);
    nodes.push(row);
  }

  return nodes;
};

export const coordinateToId = (i: number, j: number, columnCount: number) => {
  return j + i * columnCount;
};

export const checkNodeEndOfRow = (
  row: number,
  column: number,
  columnCount: number
) => {
  return !(row % columnCount === columnCount - 1 && column - row === 1);
};

export const checkNodeStartOfRow = (
  row: number,
  column: number,
  columnCount: number
) => {
  return !(row % columnCount === 0 && row - column === 1);
};

export const checkNodeIsWallNode = (wallNodes: Array<number>, row: number, column: number) => {
  const wallNode = wallNodes.indexOf(row) !== -1 || wallNodes.indexOf(column) !== -1;
    return wallNode;
}

export const adjacenyMatrixHelper = (
  row: number,
  column: number,
  columnCount: number,
  wallNodes: Array<number> | []
) => {
  if (row === column) {
    return 0;
  } else if (
    Math.abs(row - column) === 1 &&
    checkNodeEndOfRow(row, column, columnCount) &&
    checkNodeStartOfRow(row, column, columnCount)
  ) {
    if(checkNodeIsWallNode(wallNodes, row, column)){
      return 0;
    }
    return 1;
  } else if (Math.abs(row - column) === columnCount) {
    if(checkNodeIsWallNode(wallNodes, row, column)){
      return 0;
    }
    return 1;
  } else {

    return 0;
  }
};

export const createAdjacenyMatrix = (rowCount: number, columnCount: number, wallNodes: Array<number> = []) => {
  const newAdjancyArray = [];

  for (let i = 0; i < rowCount * columnCount; i++) {
    const row: Array<number> = [];
    for (let j = 0; j < rowCount * columnCount; j++) {
      row.push(adjacenyMatrixHelper(i, j, columnCount, wallNodes));
    }
    newAdjancyArray.push(row);
  }

  return newAdjancyArray;
};

export const changeStartAndFinishNodeHelper = (
  nodes: Array<Array<NodeType>>,
  columnCount: number,
  changedId: number,
  nodeType: string,
  startNodeId: number,
  finishNodeId: number
) => {
  const newNodes = nodes.map((row, i) => {
    return row.map((nodeObj, j) => {
      if (j + i * columnCount === changedId) {
        if (nodeType === "startNode" && finishNodeId !== changedId) {
          return {
            ...nodeObj,
            isStart: true,
            isSearched: false,
            isRoad: false,
          };
        }

        if (nodeType === "finishNode" && startNodeId !== changedId) {
          return {
            ...nodeObj,
            isFinish: true,
            isSearched: false,
            isRoad: false,
          };
        }

        return {
          ...nodeObj,
        };
      } else {
        if (nodeType === "finishNode" && startNodeId !== changedId) {
          return {
            ...nodeObj,
            isFinish: false,
            isSearched: false,
            isRoad: false,
          };
        }

        if (nodeType === "startNode" && finishNodeId !== changedId) {
          return {
            ...nodeObj,
            isStart: false,
            isSearched: false,
            isRoad: false,
          };
        }
      }
      return {
        ...nodeObj,
      };
    });
  });

  return newNodes;
};

export const createShortestArray: any = (
  parents: Array<number>,
  finishNodeId: number,
  shortestArrayNew: Array<number> = []
) => {
  if (parents[finishNodeId] !== -1) {
    shortestArrayNew.unshift(parents[finishNodeId]);
    return createShortestArray(
      parents,
      parents[finishNodeId],
      shortestArrayNew
    );
  } else {
    shortestArrayNew.shift();
    return shortestArrayNew;
  }
};

export const paintSearchedNodesHelper = (
  row: Array<NodeType>,
  processedOrderArr: Array<number>
) => {
  return row.map((rowObj) => {
    const index = processedOrderArr.indexOf(rowObj.id);
    const isSearched = index === -1 ? false : true;
    const wait = index === -1 ? 0 : index;

    return {
      ...rowObj,
      isSearched,
      wait,
    };
  });
};

export const paintSearchedNodes = (
  nodes: Array<Array<NodeType>>,
  processedOrderArr: Array<number>
) => {
  const newNodes = nodes.map((row) =>
    paintSearchedNodesHelper(row, processedOrderArr)
  );

  return newNodes;
};

export const paintShortestPathHelper = (
  row: Array<NodeType>,
  shortestPathArray: Array<number>
) => {
  return row.map((rowObj) => {
    const index = shortestPathArray.indexOf(rowObj.id);
    const wait = index === -1 ? 0 : index + 1;
    const isRoad = index === -1 ? false : true;

    return {
      ...rowObj,
      wait,
      isRoad,
    };
  });
};

export const paintShortestPath = (
  nodes: Array<Array<NodeType>>,
  shortestPathArray: Array<number>
) => {
  const newNodes = nodes.map((row) =>
    paintShortestPathHelper(row, shortestPathArray)
  );

  return newNodes;
};

export const clearPaintedNodesHelper = (row: Array<NodeType>) => {
  return row.map((nodeObj) => {
    return {
      ...nodeObj,
      isRoad: false,
      isSearched: false,
    };
  });
};

export const clearPaintedNodes = (nodes: Array<Array<NodeType>>) => {
  const newNodes = nodes.map(clearPaintedNodesHelper);

  return newNodes;
};
