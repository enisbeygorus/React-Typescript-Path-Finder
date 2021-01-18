import React, { useEffect, useState } from "react";
import { Node, NodeType } from "../Node/Node";
import { Header } from '../Header/Header';
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
import { DijkstraAlgorithm } from "../../algorithm/DjikstraAlgorithm";

interface PathVisualizerProps {}

export type coordinateType = {
  i: number;
  j: number;
  columnCount: number;
};

export const PathVisualizer: React.FC<PathVisualizerProps> = () => {
  const rowCount = 12;
  const columnCount = 16;

  const [nodes, setNodes] = useState<Array<Array<NodeType>>>([]);

  const [startNodeId, setStartNode] = useState<number>(83);
  const [finishNodeId, setFinishNode] = useState<number>(92);
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
  }, [paintSearchedDone, nodes, processedOrderArr.length]);

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

    setProcessedOrderArr(processedOrder);

    const parentKeys = Object.keys(parent);
    if(parentKeys.indexOf(finishNodeId.toString()) === -1 ){
      setShortestPathArray([]);
      return ;
    }
    const shortestPath = createShortestArray(parent, finishNodeId);

    setShortestPathArray(shortestPath);
    setAdjacenyMatrix(createdAdjacenyMatrix);
  }

  const changeStartAndFinishNode = (changedId: number, nodeType: string) => {
    const newNodes = changeStartAndFinishNodeHelper(
      nodes,
      columnCount,
      changedId,
      nodeType,
      startNodeId,
      finishNodeId,
      wallNodes
    );

    if (nodeType === "startNode" && changedId !== finishNodeId && wallNodes.indexOf(changedId) === -1) {
      setStartNode(changedId);
    }

    if (nodeType === "finishNode" && changedId !== startNodeId && wallNodes.indexOf(changedId) === -1) {
      setFinishNode(changedId);
    }

    setNodes(newNodes);
  };

  const clearPaintedNodesControl = () => {
    const newNodes = clearPaintedNodes(nodes);

    setNodes(newNodes);
    setShortestPathArray([]);
    setNodesCleared(true);
  };

  const findShortestPathButton = () => {
    clearPaintedNodesControl();
    
    createAdjacenyMatrixAndFindShortestPath()
    setDisableButtonAndDrag(true);
    setStartAnimation(true);
  };

  const clearWallNodesButton = () => {
    setWallNodes([]);
  }

  const clearPaintedNodesButton = () => {
    clearPaintedNodesControl();
  }

  const clearAllNodesButton = () => {
    clearPaintedNodesControl();
    clearWallNodesButton();
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="path-visualize">
        <Header
          disableButtonAndDrag={disableButtonAndDrag}
          findShortestPathButton={findShortestPathButton}
          clearWallNodesButton={clearWallNodesButton}
          clearPaintedNodesButton={clearPaintedNodesButton}
          clearAllNodesButton={clearAllNodesButton}
        />
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
