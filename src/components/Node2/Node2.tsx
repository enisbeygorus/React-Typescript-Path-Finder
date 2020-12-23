import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

import "./Node2.css";

interface Node2Props {
  isStart: boolean;
  isFinish: boolean;
  col: number;
  row: number;
  columnCount: number;
  isSearched: boolean;
  wait: number;
  isRoad: boolean;
  disableButtonAndDrag: boolean;
  changeStartAndFinishNode: (changedId: number, nodeType: string) => void;
}

export type NodeType = {
  id: number;
  col: number;
  row: number;
  isStart: boolean;
  isFinish: boolean;
  isRoad: boolean;
  isSearched: boolean;
  wait: number;
};

export const Node2: React.FC<Node2Props> = ({
  isStart,
  isFinish,
  col,
  row,
  columnCount,
  isSearched,
  wait,
  isRoad,
  disableButtonAndDrag,
  changeStartAndFinishNode,
}) => {
  const classStart = isStart ? "isStart" : "";
  const classFinish = isFinish ? "isFinish" : "";

  const [isSearchedNode, setIsSearchedNode] = useState(isSearched);
  const [isRoadNode, setIsRoadNode] = useState<boolean>(isRoad);

  useEffect(() => {
    let timeOut:  ReturnType<typeof setTimeout>;

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

    return () => clearTimeout(timeOut);

  }, [isRoad, isSearched])

  const [{ isDragging }, drag] = useDrag({
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
    },
  });

  return (
    <div
      className={`node ${classStart} ${classFinish}` + (isRoadNode ? "isRoad" : "")}
      ref={drop}
      id={`${col + row * columnCount}`}
    >
      {isStart ? <div className="drag isStart" ref={drag}></div> : null}

      {isFinish ? <div className="drag isFinish" ref={drag}></div> : null}

      {!isStart ? (!isFinish ? <div className={((isSearchedNode && !isRoadNode) ? " circle" : "")}></div> : null ): null }
    </div>
  );
};
