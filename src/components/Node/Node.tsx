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
  isWall: boolean;
  isSearched: boolean;
  isMouseDown: boolean;
  columnCount: number;
  wait: number;
  shortestArray: Array<number>;
  wallNodes: Array<number>;
  setWallHandler: (id: number) => void;
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
  isWall,
  shortestArray,
  wallNodes,
  setWallHandler,
  isMouseDown,
  changeStartAndFinishNode,
}) => {
  const classStart = isStart ? "isStart" : "";
  const classFinish = isFinish ? "isFinish" : "";
  const classWall = isWall ? "isWall" : "";

  const [isRoadNode, setIsRoadNode] = useState(isRoad);
  const [isSearchedNode, setIsSearchedNode] = useState(isSearched);
  const [isWallNode, setIsWallNode] = useState(false);  

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

    if(isRoad && isSearched) {
      timeOut = setTimeout(() => {
        setIsSearchedNode(false);
      }, wait * 30)
    }

    if(!isWall){
      setIsWallNode(false);
    }

    if(isWall) {
      timeOut = setTimeout(() => {
        setIsWallNode(true);
      }, wait * 10)
    }

    if (timeOut) {
      return () => clearTimeout(timeOut);
    }

    
  }, [isRoad, isSearched, isWall]);

  const [{ isDragging }, drag] = useDrag({
    item: {
      id: `${col + row * columnCount}`,
      type: "node",
      isStart: isStart,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    })
  });

  const [collectedPropsDrop, drop] = useDrop({
    accept: "node",
    drop: (item: any) => {
      changeStartAndFinishNode(col + row * columnCount, item.isStart);
    },
  });

  const mouseOverHandler = () => {
    if(isMouseDown){
      if(!isWallNode){
        setIsWallNode(true);
        setWallHandler(id);
      } else {
        setIsWallNode(false);
        setWallHandler(id);
      }
    }
  }

  const mouseClickHandler = () => {
    if(!isWallNode) {
      if(!isStart && !isFinish){
        setIsWallNode(true);
        setWallHandler(id);
      }
    } else {
      setIsWallNode(false);
      setWallHandler(id);
    }
  }

  return (
    <div
      draggable={isStart ? "true" : "false"}
      ref={drop}
      id={`${col + row * columnCount}`}
      className={
        "node " + classStart + classFinish + (isRoadNode ? "isRoad" : "") + (isSearchedNode ? " isSearched" : "") + (isWallNode ? " isWall" : "")
      }
      data-col={col}
      data-row={row}
      style={{ position: "relative" }}
      onMouseOver={mouseOverHandler}
      onClick={mouseClickHandler}
    >
      {isStart ? <div className="drag isStart" ref={drag}></div> : null}

      {isFinish ? <div className="drag isFinish" ref={drag}></div> : null}

      {!isStart ? (!isFinish ? <div className={(isSearchedNode ? " circle" : "")} ></div> : null ): null }
    </div>
  );
};
