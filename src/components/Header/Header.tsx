import React from "react";
import "./Header.css";
import { NodeType } from '../Node/Node'

interface HeaderProps {
  disableButtonAndDrag: boolean;
  findShortestPathButton: () => void;
  clearWallNodesButton: () => void;
  clearPaintedNodesButton: () => void;
  clearAllNodesButton: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  disableButtonAndDrag,
  findShortestPathButton,
  clearWallNodesButton,
  clearPaintedNodesButton,
  clearAllNodesButton,
}) => {
  return (
    <div className="header">
      <div className="description-info">
        You can drag both Start and Finish Node
      </div>
      <div className="description-node">
        <div>Start Node:</div>
        <div className="node isStart"></div>
        <div>Finish Node:</div>
        <div className="node isFinish"></div>
        <div>Wall Node:</div>
        <div className="node isWall"></div>
      </div>
      <div className="warning-wrapper">
        <div className={`warning ${thereIsNoWay ? "show" : ""}`}>
          {thereIsNoWay ? <div> There is no way Green to Red</div> : null}
        </div>
      </div>
      <div className="btn-wrapper">
        <button
          className="btn find-path"
          disabled={disableButtonAndDrag}
          onClick={() => {
            findShortestPathButton();
          }}        >
          Find the shortest path
        </button>
        <button
          className="btn clear"
          disabled={disableButtonAndDrag}
          onClick={() => {
            clearPaintedNodesButton();
          }}        >
          clear searched areas.
        </button>

        <button
          className="btn clear"
          disabled={disableButtonAndDrag}
          onClick={() => {
            clearWallNodesButton();
          }}        >
          clear wall.
        </button>

        <button
          className="btn clear"
          disabled={disableButtonAndDrag}
          onClick={() => {
            clearAllNodesButton();
          }}        >
          clear all.
        </button>
      </div>
    </div>
  );
};
