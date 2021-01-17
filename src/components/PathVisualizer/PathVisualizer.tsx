import React, { useEffect, useState } from "react";
import { Node, NodeType } from "../Node/Node";
import "./PathVisualizer.css";
import {
  initMatrix,
  createAdjacenyMatrix,
  changeStartAndFinishNodeHelper,
  createShortestArray,
  paintSearchedNodes,
  paintShortestPath,
  clearPaintedNodes,
} from "./pathVisualizerHelper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DijkstraAlgorithm } from "../algorithm/DjikstraAlgorithm";

interface PathVisualizerProps {}

export type coordinateType = {
  i: number;
  j: number;
  columnCount: number;
};

export const PathVisualizer: React.FC<PathVisualizerProps> = () => {
  const rowCount = 15;
  const columnCount = 20;

  const [nodes, setNodes] = useState<Array<Array<NodeType>>>([]);

  const [startNodeId, setStartNode] = useState<number>(2);
  const [finishNodeId, setFinishNode] = useState<number>(8);
  const [adjacenyMatrix, setAdjacenyMatrix] = useState<Array<Array<number>>>(
    []
  );
  const [shortestPathArray, setShortestPathArray] = useState<Array<number>>([]);
  const [processedOrderArr, setProcessedOrderArr] = useState<Array<number>>([]);
  const [paintSearchedDone, setPaintSearchedDone] = useState<boolean>(false);
  const [disableButtonAndDrag, setDisableButtonAndDrag] = useState<boolean>(
    false
  );
  const [nodesCleared, setNodesCleared] = useState<boolean>(false);
  const [startAnimation, setStartAnimation] = useState<boolean>(false);
  const [wallNodes, setWallNodes] = useState<Array<number>>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const nodes = initMatrix(rowCount, columnCount, startNodeId, finishNodeId);

    setNodes(nodes);
    createAdjacenyMatrixAndFindShortestPath();

    return;
  }, [finishNodeId, startNodeId]);

  useEffect(() => {
    if (paintSearchedDone) {
      setTimeout(() => {
        const paintedShortestPath = paintShortestPath(nodes, shortestPathArray);
        setNodes(paintedShortestPath);
        setDisableButtonAndDrag(false);
      }, processedOrderArr.length * 30);

      setPaintSearchedDone(false);
    }
  }, [paintSearchedDone, nodes, processedOrderArr.length, shortestPathArray]);

  useEffect(() => {
    if (nodesCleared && startAnimation) {
      const paintedNodes = paintSearchedNodes(nodes, processedOrderArr);
      setNodes(paintedNodes);
      setPaintSearchedDone(true);
      setNodesCleared(false);
      setStartAnimation(false);
    }
  }, [nodesCleared, startAnimation, nodes, processedOrderArr]);

  const mouseDownHandler = (e: React.MouseEvent) => {
    setIsMouseDown(true);
  };

  const mouseUpHandler = (e: React.MouseEvent) => {
    setIsMouseDown(false);
  };

  const createAdjacenyMatrixAndFindShortestPath = () => {
    const createdAdjacenyMatrix = createAdjacenyMatrix(rowCount, columnCount, wallNodes);
    const { parent, processedOrder } = DijkstraAlgorithm(
      createdAdjacenyMatrix,
      startNodeId,
      finishNodeId
    );
    const shortestPath = createShortestArray(parent, finishNodeId);

    setProcessedOrderArr(processedOrder);
    setShortestPathArray(shortestPath);
    setAdjacenyMatrix(createdAdjacenyMatrix);
  }

  const changeStartAndFinishNode = (changedId: number, nodeType: string) => {
    const { parent, processedOrder } =
      nodeType === "startNode"
        ? DijkstraAlgorithm(adjacenyMatrix, changedId, finishNodeId)
        : DijkstraAlgorithm(adjacenyMatrix, startNodeId, changedId);

    const newNodes = changeStartAndFinishNodeHelper(
      nodes,
      columnCount,
      changedId,
      nodeType,
      startNodeId,
      finishNodeId
    );

    if (nodeType === "startNode" && changedId !== finishNodeId) {
      const shortestPath = createShortestArray(parent, finishNodeId);

      setShortestPathArray(shortestPath);
      setProcessedOrderArr(processedOrder);
      setStartNode(changedId);
    }

    if (nodeType === "finishNode" && changedId !== startNodeId) {
      const shortestPath = createShortestArray(parent, changedId);

      setShortestPathArray(shortestPath);
      setProcessedOrderArr(processedOrder);
      setFinishNode(changedId);
    }

    setNodes(newNodes);
  };

  const clearPaintedNodesControl = () => {
    const newNodes = clearPaintedNodes(nodes);

    setNodes(newNodes);
    setNodesCleared(true);
  };

  const findShortestPathButton = () => {
    createAdjacenyMatrixAndFindShortestPath()

    clearPaintedNodesControl();
    setDisableButtonAndDrag(true);
    setStartAnimation(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="path-visualize">
        <button
          className="btn"
          disabled={disableButtonAndDrag}
          onClick={() => {
            findShortestPathButton();
          }}
          style={{ marginBottom: "50px", width: "100%" }}
        >
          Find the shortest path
        </button>
        <div
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        className="node-cotainer">
          {nodes.map((row, index) => {
            return (
              <div key={index} className={"row"}>
                {row.map((node) => {
                  return (
                    <Node
                      isMouseDown={isMouseDown}
                      setIsMouseDown={setIsMouseDown}
                      changeStartAndFinishNode={changeStartAndFinishNode}
                      key={node.col + " " + node.row}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      col={node.col}
                      row={node.row}
                      wait={node.wait}
                      isSearched={node.isSearched}
                      isRoad={node.isRoad}
                      isWall={node.isWall}
                      wallNodes={wallNodes}
                      setWallNodes={setWallNodes}
                      columnCount={columnCount}
                      disableButtonAndDrag={disableButtonAndDrag}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};
