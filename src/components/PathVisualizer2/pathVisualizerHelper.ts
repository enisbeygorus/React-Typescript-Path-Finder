import { NodeType } from "../Node2/Node2";

export const coordinateToId = (i: number, j: number, columnCount: number) => {
  return j + i * columnCount;
};

export const createAdjacenyMatrix = (rowCount: number, columnCount: number) => {
  const newAdjancyArray = [];
  for (let i = 0; i < rowCount * columnCount; i++) {
    const row: Array<number> = [];
    for (let j = 0; j < rowCount * columnCount; j++) {
      if (i === j) {
        row.push(0);
      } else if (
        Math.abs(i - j) === 1 &&
        !(i % columnCount === columnCount - 1 && j - i === 1) &&
        !(i % columnCount === 0 && i - j === 1)
      ) {
        row.push(1);
      } else if (Math.abs(i - j) === columnCount) {
        row.push(1);
      } else {
        row.push(0);
      }
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
            isRoad: false
          };
        }

        if (nodeType === "finishNode" && startNodeId !== changedId) {
          return {
            ...nodeObj,
            isFinish: true,
            isSearched: false,
            isRoad: false
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
            isRoad: false
          };
        }

        if (nodeType === "startNode" && finishNodeId !== changedId) {
          return {
            ...nodeObj,
            isStart: false,
            isSearched: false,
            isRoad: false
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
  setShortestArray: (shortestArrayNew: Array<number>) => void,
  shortestArrayNew: Array<number> = []
) => {
  if (parents[finishNodeId] !== -1) {
    shortestArrayNew.unshift(parents[finishNodeId]);
    return createShortestArray(
      parents,
      parents[finishNodeId],
      setShortestArray,
      shortestArrayNew
    );
  } else {
    setShortestArray(shortestArrayNew);
    shortestArrayNew.shift();
    return shortestArrayNew;
  }
};

export const paintSearchedNodes = (
  nodes: Array<Array<NodeType>>,
  processedOrderArr: Array<number>,
  setNodes: (nodes: Array<Array<NodeType>>) => void,
  setPaintSearchedDone: (bool: boolean) => void
) => {
  const newNodes = nodes.map((row) => {
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
  });

  setNodes(newNodes);
  setPaintSearchedDone(true);
};

export const paintShortestPath = (
  nodes: Array<Array<NodeType>>,
  shortestPathArray: Array<number>,
  setNodes: (nodes: Array<Array<NodeType>>) => void,
) => {
  const newNodes = nodes.map((row) => {
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
  });

  setNodes(newNodes);
};
