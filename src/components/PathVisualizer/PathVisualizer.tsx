import React, { useEffect, useState } from "react";
import { Node } from "../Node/Node";
import { DijkstraAlgorithm } from "../algorithm/DjikstraAlgorithm";
import { generate } from "../algorithm/RecursiveMazeAlgorithm";
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
  isSearched: boolean;
  isWall: boolean;
  wait: number;
  isMouseDown: boolean;
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
  const [startNodeId, setStartNode] = useState<number>(2);
  const [finishNodeId, setFinishNode] = useState<number>(0);

  const [canClickFindPathButton, setCanClickFindPathButton] = useState<boolean>(
    true
  );

  const [nodePositionChanged, setNodePositionChanged] = useState<boolean>(
    false
  );
  const [onAnimation, setOnAnimation] = useState<boolean>(false);

  const [timer, setTimer] = useState<any> (() => {});

  const [wallNodes, setWallNodes] = useState<Array<number>> ([]);
  const [isMouseDown, setIsMouseDown] = useState(false);


  const rowCount = 4;
  const columnCount = 4;

  const mouseDownHandler = (e: React.MouseEvent) => {
    setIsMouseDown(true);
  }

  const mouseUpHandler = (e: React.MouseEvent) => {
    setIsMouseDown(false);
  }

  const setWallHandler = (id: number) => {
    // let newWallNodes = []
    // const index = wallNodes.indexOf(id);
    // if(index === -1){
    //   newWallNodes = [...wallNodes, id] 
    // } else {
    //   newWallNodes = wallNodes.filter((wallId) => wallId != id)
    // }

    // setWallNodes(newWallNodes);
  }

  const createAdjacenyMatrix = () => {
    const newAdjancyArray = []
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
          if(wallNodes.length && (wallNodes.indexOf(i) !== -1 || wallNodes.indexOf(j) !== -1)){
            row.push(0);
          } else {
            row.push(1)
          }
        } else if (Math.abs(i - j) === columnCount) {
          if(wallNodes.length && (wallNodes.indexOf(i) !== -1 || wallNodes.indexOf(j) !== -1)){
            row.push(0);
          } else {
            row.push(1)
          }
        } else {
          row.push(0);
        }
      }
      newAdjancyArray.push(row);
    }

    setAdjacenyMatrix(newAdjancyArray);
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
          isSearched: false,
          isWall: false,
          isMouseDown: false,
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

  useEffect(() => {
    if (nodePositionChanged && onAnimation) {
      clearTimeout(timer);
    }
    return () => {
      // removing the listener when props.x changes
    };
  }, [nodePositionChanged]);

  useEffect(() => {
    if(!canClickFindPathButton) {
      // const parent = DijkstraAlgorithm(
      //   adjacenyMatrix,
      //   startNodeId,
      // );
      // let alternativeOrder = processedOrder.slice(0, parent.indexOf(finishNodeId));
      // console.log(alternativeOrder)
      // console.log(parent.indexOf(finishNodeId))
      // console.log(finishNodeId)
      // const shortestArrayNew: Array<number> = [];
      // searchVisualizer(processedOrder);
      // setOnAnimation(true);
      // const timerOut = setTimeout(() => {
      //   fillShortestArray(parent, finishNodeId, shortestArrayNew);
      //   console.log(shortestArrayNew)
      //   setCanClickFindPathButton(true);
      //   setOnAnimation(false);
      // }, processedOrder.length * 30);

      // setTimer(timerOut);
    }
  }, [adjacenyMatrix, canClickFindPathButton])

  const changeStartAndFinishNode = (changedId: number, isStart: boolean) => {
    setNodePositionChanged(true);
    if (
      (isStart && changedId !== finishNodeId) ||
      (!isStart && changedId !== startNodeId)
    ) {
      const newNodes = nodes.map((row) => {
        return row.map((rowObj) => {
          const id = coordinateToId(rowObj.row, rowObj.col, columnCount);
          if (isStart) {
            if (id === changedId) {
              setCanClickFindPathButton(true);
              setStartNode(changedId);
              return {
                ...rowObj,
                isRoad: false,
                isStart: true,
                isSearched: false,
              };
            }
            return {
              ...rowObj,
              isRoad: false,
              isStart: false,
              isSearched: false,
            };
          } else {
            if (id === changedId) {
              setCanClickFindPathButton(true);
              setFinishNode(changedId);
              return {
                ...rowObj,
                isRoad: false,
                isFinish: true,
                isSearched: false,
              };
            }
            return {
              ...rowObj,
              isRoad: false,
              isFinish: false,
              isSearched: false,
            };
          }
        });
      });
      setIsMouseDown(false);
      setNodePositionChanged(false);
      setNodes(newNodes);
    }
  };

  const createRecursiveMaze = () => {
    console.log('test')
    const { grid, mazeDrawOrder } = generate(rowCount, 1);

    const clearMazeNodes = nodes.map((row, indexRow) => {
      return row.map((rowObj, indexCol) => {
        return {
          ...rowObj,
          isWall: false,
          isSearched: false,
          isRoad: false
        };
      });
    });

    setNodes(clearMazeNodes);

    setTimeout(() => {
      const mazeNodes = nodes.map((row, indexRow) => {
        return row.map((rowObj, indexCol) => {
          const index = mazeDrawOrder.indexOf(rowObj.id);
          const isWall = index === -1 ? false : true;
          const wait = index === -1 ? 0 : index;

          return {
            ...rowObj,
            isWall,
            wait,
            isSearched: false,
            isRoad: false
          };
        });
      });
      setNodes(mazeNodes);
    }, 100);
  };

  const findTheShortestPathHandler = () => {
    createAdjacenyMatrix()
    setCanClickFindPathButton(false);
  };

  const searchVisualizer = (processedOrder: Array<number>) => {
    const newNodes = nodes.map((row) => {
      return row.map((rowObj) => {
        const index = processedOrder.indexOf(rowObj.id);
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
      <div className="container">
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
        <div className="button-wrapper">
          <button
            className="btn"
            disabled={!canClickFindPathButton}
            onClick={findTheShortestPathHandler}
            style={{ marginBottom: "50px", width: "100%" }}
          >
            Find the shortest path
          </button>
          <button
            className="btn"
            onClick={createRecursiveMaze}
            style={{ marginBottom: "50px", width: "100%" }}
          >
            createMaze
          </button>
        </div>
        <div 
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        className="path-visualize">
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
                      isSearched={node.isSearched}
                      isWall={node.isWall}
                      columnCount={columnCount}
                      shortestArray={shortestArray}
                      wallNodes={wallNodes}
                      setWallHandler={setWallHandler}
                      wait={node.wait}
                      isMouseDown={isMouseDown}
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
