import { NodeType } from "../../Node/Node";
import {
  initNodeObject,
  initColumns,
  initMatrix,
  checkNodeEndOfRow,
  checkNodeStartOfRow,
  createAdjacenyMatrix,
  adjacenyMatrixHelper,
  paintSearchedNodesHelper,
  paintSearchedNodes,
  paintShortestPathHelper,
  clearPaintedNodesHelper,
} from "../pathVisualizerHelper";

describe("initMatrix", () => {
  const rowCount: number = 15;
  const columnCount: number = 20;
  const startNodeId: number = 5;
  const finishNodeId: number = 30;
  const row: number = 4;
  const column: number = 6;

  it("should initial NodeObject", () => {
    const expected = {
      col: 6,
      row: 4,
      isStart: false,
      isFinish: false,
      isRoad: false,
      isWall: false,
      id: 86,
      wait: 0,
      isSearched: false,
    };

    const matrix = initNodeObject(
      row,
      column,
      columnCount,
      startNodeId,
      finishNodeId
    );

    expect(matrix).toMatchObject(expected);
  });

  it("should return colums - nodeObjects", () => {
    const columns = initColumns(row, column, startNodeId, finishNodeId);
    expect(columns.length).toBe(6);
  });

  it("should return rows, array of node objects", () => {
    const rows = initMatrix(rowCount, columnCount, startNodeId, finishNodeId);
    expect(rows.length).toBe(15);
  });
});

describe("Adjacency matrix", () => {
  it("should check the row node is at the end of row need return false", () => {
    const row = 2;
    const column = 3;
    const columnCount = 3;

    const isNodeAtTheEndOfRow = checkNodeEndOfRow(row, column, columnCount);
    expect(isNodeAtTheEndOfRow).toBe(false);
  });

  it("should check the row node is at the end of row need return true", () => {
    const row = 4;
    const column = 5;
    const columnCount = 3;

    const isNodeAtTheEndOfRow = checkNodeEndOfRow(row, column, columnCount);
    expect(isNodeAtTheEndOfRow).toBe(true);
  });

  it("should check the row node is at the start of row need return false", () => {
    const row = 3;
    const column = 2;
    const columnCount = 3;

    const isNodeAtTheStartOfRow = checkNodeStartOfRow(row, column, columnCount);
    expect(isNodeAtTheStartOfRow).toBe(false);
  });

  it("should check the row node is at the start of row need return true", () => {
    const row = 4;
    const column = 4;
    const columnCount = 3;

    const isNodeAtTheStartOfRow = checkNodeStartOfRow(row, column, columnCount);
    expect(isNodeAtTheStartOfRow).toBe(true);
  });

  it('should create return 1 or 0 for adjacency matrix', () => {
    const wallNodes = [5, 2]; 

    const isThereConnectionAt0 = adjacenyMatrixHelper(0, 0, 3, wallNodes);
    expect(isThereConnectionAt0).toBe(0);

    const isThereConnectionAt1 = adjacenyMatrixHelper(0, 1, 3, wallNodes);
    expect(isThereConnectionAt1).toBe(1);
  })

  it("should create adjacency matrix", () => {
    const rowCount = 3;
    const columnCount = 3;
    const wallNodes = [2, 3];
    const adjacencyMatrix = createAdjacenyMatrix(rowCount, columnCount, wallNodes);

    expect(adjacencyMatrix.length).toBe(rowCount*columnCount);

  });
});

describe("Paint Node", () => {
  it('should return isSearched true', () => {
    const processedOrderArr: Array<number> = [5,2,1];
    const paintedNodeObj: Array<NodeType> = [{
      col: 6,
      row: 4,
      isStart: false,
      isFinish: false,
      isRoad: false,
      isWall: false,
      id: 2,
      wait: 0,
      isSearched: false,
    }];

    const notPaintedNodeObj: Array<NodeType> = [{
      col: 6,
      row: 4,
      isStart: false,
      isFinish: false,
      isRoad: false,
      isWall: false,
      id: 7,
      wait: 0,
      isSearched: false,
    }];

    const paintedSearchedNodes = paintSearchedNodesHelper(paintedNodeObj, processedOrderArr);
    expect(paintedSearchedNodes[0].isSearched).toBe(true);

    const notPaintedSearchedNodes = paintSearchedNodesHelper(notPaintedNodeObj, processedOrderArr);
    expect(notPaintedSearchedNodes[0].isSearched).toBe(false);
  });

  it('should return array of Nodes that some of the isSearched true', () => {
    const processedOrderArr: Array<number> = [2,5,4,3];
    const rowCount: number = 15;
    const columnCount: number = 20;
    const startNodeId: number = 5;
    const finishNodeId: number = 30;

    const nodes = initMatrix(rowCount, columnCount, startNodeId, finishNodeId);
    const nodesWithPaintedNodesInIt = paintSearchedNodes(nodes, processedOrderArr);

    expect(nodesWithPaintedNodesInIt[0][2].isSearched).toBe(true);
    expect(nodesWithPaintedNodesInIt[0][1].isSearched).toBe(false);
  });

  it('should return isRoad property true', () => {
    const shortestPathArray = [2,5,4,3];
    const roadNodeObj: Array<NodeType> = [{
      col: 6,
      row: 4,
      isStart: false,
      isFinish: false,
      isRoad: false,
      isWall: false,
      id: 2,
      wait: 0,
      isSearched: false,
    }];

    const roadNode = paintShortestPathHelper(roadNodeObj, shortestPathArray);
    expect(roadNode[0].isRoad).toBe(true);

    const notRoadObj: Array<NodeType> = [{
      col: 6,
      row: 4,
      isStart: false,
      isFinish: false,
      isRoad: false,
      isWall: false,
      id: 7,
      wait: 0,
      isSearched: false,
    }];

    const notRoadNode = paintShortestPathHelper(notRoadObj, shortestPathArray);
    expect(notRoadNode[0].isRoad).toBe(false);
  });
});

describe('clear painted nodes', () => {
    it('should return isRoad and isSearched false', () => {
      const paintedNodeObj: Array<NodeType> = [{
        col: 6,
        row: 4,
        isStart: false,
        isFinish: false,
        isRoad: true,
        isWall: false,
        id: 2,
        wait: 0,
        isSearched: true,
      }];

      const clearedPaintedNodes = clearPaintedNodesHelper(paintedNodeObj);
      expect(clearedPaintedNodes[0].isRoad).toBe(false);
      expect(clearedPaintedNodes[0].isSearched).toBe(false);
    });
});
