import React, { useEffect, useState } from "react";
import "./Node.css";
import { useDrag, useDrop } from "react-dnd";

interface NodeProps {
  id: number;
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  isRoad: boolean;
  isSearched: boolean;
  columnCount: number;
  wait: number;
  shortestArray: Array<number>;
  changeStartAndFinishNode: (changedId: number, isStart: boolean) => void;
}
export const Node: React.FC<NodeProps> = ({
  id,
  col,
  row,
  isStart,
  isFinish,
  isRoad,
  wait,
  columnCount,
  isSearched,
  shortestArray,
  changeStartAndFinishNode,
}) => {
  const classStart = isStart ? "isStart" : "";
  const classFinish = isFinish ? "isFinish" : "";
  const [isRoadNode, setIsRoadNode] = useState(isRoad);
  const [isSearchedNode, setIsSearchedNode] = useState(isSearched);

  useEffect(() => {
    let timeOut: any;
    if (isRoad) {
      timeOut = setTimeout(() => {
        setIsRoadNode(isRoad);
      }, wait * 30);
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
    if (timeOut) {
      return () => clearTimeout(timeOut);
    }
  }, [isRoad, isSearched]);

  const [{ isDragging }, drag] = useDrag({
    item: {
      id: `${col + row * columnCount}`,
      type: "node",
      isStart: isStart,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [collectedPropsDrop, drop] = useDrop({
    accept: "node",
    drop: (item: any) => {
      changeStartAndFinishNode(col + row * columnCount, item.isStart);
    },
  });

  return (
    <div
      draggable={isStart ? true : false}
      ref={drop}
      id={`${col + row * columnCount}`}
      className={
        "node " + classStart + classFinish + (isRoadNode ? "isRoad" : "") + (isSearchedNode ? " isSearched" : "")
      }
      data-col={col}
      data-row={row}
      style={{ position: "relative" }}
    >
      {isStart ? <div className="drag isStart" ref={drag}></div> : null}

      {isFinish ? <div className="drag isFinish" ref={drag}></div> : null}
    </div>
  );
};
