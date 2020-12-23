import React, { useEffect, useState } from "react";
import { Node2, NodeType } from "../Node2/Node2";
import "./PathVisualizer2.css";
import {
  createAdjacenyMatrix,
  changeStartAndFinishNodeHelper,
  createShortestArray,
  coordinateToId,
  paintSearchedNodes,
  paintShortestPath,
} from "./pathVisualizerHelper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DijkstraAlgorithm } from "../algorithm/DjikstraAlgorithm";

interface PathVisualizer2Props {}

export type coordinateType = {
  i: number;
  j: number;
  columnCount: number;
};

export const PathVisualizer2: React.FC<PathVisualizer2Props> = ({}) => {
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
  const [disableButtonAndDrag, setDisableButtonAndDrag] = useState<boolean>(false)

  useEffect(() => {
    const nodes = [];
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        row.push({
          col: j,
          row: i,
          isStart: j + i * columnCount === startNodeId ? true : false,
          isFinish: j + i * columnCount === finishNodeId ? true : false,
          isRoad: false,
          id: coordinateToId(i, j, columnCount),
          wait: 0,
          isSearched: false,
        });
      }
      nodes.push(row);
    }

    setNodes(nodes);
    const createdAdjacenyMatrix = createAdjacenyMatrix(rowCount, columnCount);
    const { parent, processedOrder } = DijkstraAlgorithm(
      createdAdjacenyMatrix,
      startNodeId,
      finishNodeId
    );
    const shortestPath = createShortestArray(
      parent,
      finishNodeId,
      setShortestPathArray
    );

    setProcessedOrderArr(processedOrder);
    setAdjacenyMatrix(createdAdjacenyMatrix);
    setShortestPathArray(shortestPath);
    console.log(shortestPath);
    console.log("parent: ", parent);
    return;
  }, []);

  useEffect(() => {
    console.log("nodes changed");    
  }, [nodes]);

  useEffect(() => {
    if (paintSearchedDone) {
      setTimeout(() => {
        paintShortestPath(nodes, shortestPathArray, setNodes);
        setDisableButtonAndDrag(false);
      }, processedOrderArr.length * 30);

      setPaintSearchedDone(false);
    }
  }, [paintSearchedDone]);

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
      createShortestArray(parent, finishNodeId, setShortestPathArray);
      setProcessedOrderArr(processedOrder);
      setStartNode(changedId);
    }

    if (nodeType === "finishNode" && changedId !== startNodeId) {
      createShortestArray(parent, changedId, setShortestPathArray);
      setProcessedOrderArr(processedOrder);
      setFinishNode(changedId);
    }

    setNodes(newNodes);
  };

  const findShortestPathButton = () => {
    setDisableButtonAndDrag(true);
    paintSearchedNodes(
      nodes,
      processedOrderArr,
      setNodes,
      setPaintSearchedDone
    );
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
        {nodes.map((row, index) => {
          return (
            <div key={index} className={"row"}>
              {row.map((node) => {
                return (
                  <Node2
                    changeStartAndFinishNode={changeStartAndFinishNode}
                    key={node.col + " " + node.row}
                    isStart={node.isStart}
                    isFinish={node.isFinish}
                    col={node.col}
                    row={node.row}
                    wait={node.wait}
                    isSearched={node.isSearched}
                    isRoad={node.isRoad}
                    columnCount={columnCount}
                    disableButtonAndDrag={disableButtonAndDrag}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </DndProvider>
  );
};
