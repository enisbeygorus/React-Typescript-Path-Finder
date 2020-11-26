import React, { useEffect, useState } from "react";
import { Node } from "../Node/Node";
import { DijkstraAlgorithm } from "../algorithm/DjikstraAlgorithm";
import "./PathVisualizer.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface PathVisualizerProps {}

export type NodeType = {
  id: number;
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  isRoad: boolean;
  wait: number;
};

export type coordinateType = {
  i: number;
  j: number;
  columnCount: number;
};

const coordinateToId = (i: number, j: number, columnCount: number) => {
  return j + i * columnCount;
};

export const PathVisualizer: React.FC<PathVisualizerProps> = () => {
  const [nodes, setNodes] = useState<Array<Array<NodeType>>>([]);
  const [shortestArray, setShortestArray] = useState<Array<number>>([]);
  const [adjacenyMatrix, setAdjacenyMatrix] = useState<Array<Array<number>>>(
    []
  );
  const [startNodeId, setStartNode] = useState<number>(6);
  const [finishNodeId, setFinishNode] = useState<number>(22);

  const rowCount = 15;
  const columnCount = 20;

  const createAdjacenyMatrix = () => {
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
      adjacenyMatrix.push(row);
    }
  };

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
        });
      }
      nodes.push(row);
    }
    setNodes(nodes);
    createAdjacenyMatrix();
    return;
  }, []);

  useEffect(() => {
    if (shortestArray.length) {
      drawRoadFromStartToFinish(shortestArray);
    }
    return () => {
      // removing the listener when props.x changes
    };
  }, [shortestArray]);

  const changeStartAndFinishNode = (changedId: number, isStart: boolean) => {
    let isStartNodeChanged = false;
    if (
      (isStart && changedId !== finishNodeId) ||
      (!isStart && changedId !== startNodeId)
    ) {
      const newNodes = nodes.map((row) => {
        return row.map((rowObj) => {
          const id = coordinateToId(rowObj.row, rowObj.col, columnCount);
          if (isStart) {
            if (id === changedId) {
              isStartNodeChanged = true;
              setStartNode(changedId);
              return { ...rowObj, isRoad: false, isStart: true };
            }
            return { ...rowObj, isRoad: false, isStart: false };
          } else {
            if (id === changedId) {
              setFinishNode(changedId);
              return { ...rowObj, isRoad: false, isFinish: true };
            }
            return { ...rowObj, isRoad: false, isFinish: false };
          }
        });
      });
      setNodes(newNodes);
    }
  };

  const findTheShortestPathHandler = () => {
    const parents = DijkstraAlgorithm(adjacenyMatrix, startNodeId);
    const shortestArrayNew: Array<number> = [];
    fillShortestArray(parents, finishNodeId, shortestArrayNew);
  };

  const drawRoadFromStartToFinish = (shortestPath: Array<number>) => {
    const newNodes = nodes.map((row) => {
      return row.map((rowObj) => {
        const index = shortestPath.indexOf(rowObj.id);
        const isRoad = index === -1 ? false : true;
        const wait = index === -1 ? 0 : index;

        return {
          ...rowObj,
          isRoad,
          wait,
        };
      });
    });

    setNodes(newNodes);
  };

  const fillShortestArray: any = (
    parents: Array<number>,
    pathNumber: number,
    shortestArrayNew: Array<number>
  ) => {
    if (parents[pathNumber] !== -1) {
      shortestArrayNew.unshift(parents[pathNumber]);
      return fillShortestArray(parents, parents[pathNumber], shortestArrayNew);
    } else {
      setShortestArray(shortestArrayNew);
      return shortestArrayNew;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          You can Drag And Drop Both Start and Finish node
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "50px",
          }}
        >
          <div>Start Node</div>
          <div className="node isStart"></div>
          <div>Finish Node</div>
          <div className="node isFinish"></div>
        </div>
        <button
          onClick={findTheShortestPathHandler}
          style={{ marginBottom: "50px", width: "100%" }}
        >
          Find the shortest path
        </button>
        <div className="path-visualize">
          {nodes.map((row, index) => {
            return (
              <div key={index} className={"row"}>
                {row.map((node) => {
                  return (
                    <Node
                      key={node.col + " " + node.row}
                      id={coordinateToId(node.row, node.col, columnCount)}
                      col={node.col}
                      row={node.row}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      isRoad={node.isRoad}
                      columnCount={columnCount}
                      shortestArray={shortestArray}
                      wait={node.wait}
                      changeStartAndFinishNode={changeStartAndFinishNode}
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
