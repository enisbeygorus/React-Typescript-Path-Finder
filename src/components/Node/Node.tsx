import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { addNodeToWallNodeArray, removeNodeToWallNodeArray } from './NodeHelper';
import { coordinateToId } from "../PathVisualizer/pathVisualizerHelper";

import "./Node.css";

interface NodeProps {
  isStart: boolean;
  isFinish: boolean;
  col: number;
  row: number;
  columnCount: number;
  isSearched: boolean;
  wait: number;
  isRoad: boolean;
  disableButtonAndDrag: boolean;
  isMouseDown: boolean;
  isWall: boolean;
  wallNodes: Array<number>;
  setWallNodes: (array: Array<number>) => void;
  setIsMouseDown: (isMouseDown: boolean) => void;
  changeStartAndFinishNode: (changedId: number, nodeType: string) => void;
}

export type NodeType = {
  id: number;
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  isRoad: boolean;
  isWall: boolean;
  isSearched: boolean;
  wait: number;
};

export const Node: React.FC<NodeProps> = ({
  isStart,
  isFinish,
  col,
  row,
  columnCount,
  isSearched,
  wait,
  isRoad,
  isWall,
  disableButtonAndDrag,
  isMouseDown,
  wallNodes,
  setWallNodes,
  setIsMouseDown,
  changeStartAndFinishNode,
}) => {
  const classStart = isStart ? "isStart" : "";
  const classFinish = isFinish ? "isFinish" : "";

  const [isSearchedNode, setIsSearchedNode] = useState(isSearched);
  const [isRoadNode, setIsRoadNode] = useState<boolean>(isRoad);
  const [isWallNode, setIsWallNode] = useState<boolean>(isWall);

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;

    if (isRoad) {
      timeOut = setTimeout(() => {
        setIsRoadNode(isRoad);
      }, wait * 40);
    } else {
      setIsRoadNode(isRoad);
    }

    if (isSearched) {
      timeOut = setTimeout(() => {
        setIsSearchedNode(isSearched);
      }, wait * 30);
    } else {
      setIsSearchedNode(isSearched);
    }

    setIsWallNode(false);

    wallNodes.forEach((wallNodeId) => {
      if(wallNodeId === coordinateToId(row, col, columnCount)) {
        setIsWallNode(true);
      }
    })

    return () => clearTimeout(timeOut);
  }, [isRoad, isSearched, wait, isWall, wallNodes]);

  const [{ }, drag] = useDrag({
    item: {
      id: `${col + row * columnCount}`,
      type: "node",
      isStart: isStart,
      isFinish: isFinish,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !disableButtonAndDrag,
  });

  const [collectedPropsDrop, drop] = useDrop({
    accept: "node",
    drop: (item: any) => {
      const nodeType = item.isStart
        ? "startNode"
        : item.isFinish
        ? "finishNode"
        : "";
      changeStartAndFinishNode(col + row * columnCount, nodeType);
      setIsMouseDown(false);
    },
  });

  const paintOrRemoveWallNode = () => {
    const nodeId = coordinateToId(row, col, columnCount);
    if (isWallNode) {
      const newWallNodes = removeNodeToWallNodeArray(wallNodes, nodeId);
      setWallNodes(newWallNodes);
    } else {
      const newWallNodes = addNodeToWallNodeArray(wallNodes, nodeId);
      setWallNodes(newWallNodes);
    }
  }

  const paintOrRemoveToNodeWallOnMouseEnter = () => {
    if (isMouseDown && !isStart && !isFinish) {
      paintOrRemoveWallNode();
    }
  };

  const paintOrRemoveToNodeWallOnMouseDown = () => {
    if (!isStart && !isFinish) {
      paintOrRemoveWallNode();
    }
  };

  return (
    <div
      className={
        `node ${classStart} ${classFinish}` +
        (isRoadNode && !isWallNode ? "isRoad" : "") +
        (isWallNode ? "isWall" : "")
      }
      onMouseEnter={() => paintOrRemoveToNodeWallOnMouseEnter()}
      onMouseDown={() => paintOrRemoveToNodeWallOnMouseDown()}
      ref={drop}
      id={`${col + row * columnCount}`}
    >
      {isStart ? <div className="drag isStart" ref={drag}></div> : null}

      {isFinish ? <div className="drag isFinish" ref={drag}></div> : null}

      {!isStart ? (
        !isFinish ? (
          <div className={(isSearchedNode && !isRoadNode && !isWallNode) ? " circle" : ""}></div>
        ) : null
      ) : null}
    </div>
  );
};
