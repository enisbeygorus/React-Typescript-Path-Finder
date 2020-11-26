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
  shortestArray,
  changeStartAndFinishNode,
}) => {
  const classStart = isStart ? "isStart" : "";
  const classFinish = isFinish ? "isFinish" : "";
  const [isRoadNode, setIsRoadNode] = useState(isRoad);

  useEffect(() => {
    let timeOut: any;
    if (isRoad) {
      timeOut = setTimeout(() => {
        setIsRoadNode(isRoad);
      }, wait * 30);
    } else {
      setIsRoadNode(isRoad);
    }
    if (timeOut) {
      return () => clearTimeout(timeOut);
    }
  }, [isRoad]);

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
        "node " + classStart + classFinish + (isRoadNode ? "isRoad" : "")
      }
      data-col={col}
      data-row={row}
      style={{ position: "relative" }}
    >
      <div
        className={`drag isStart ${
          isStart ? "isStart" : isFinish ? "isFinish" : null
        }`}
        ref={drag}
      ></div>
    </div>
  );
};
